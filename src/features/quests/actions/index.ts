"use server";

import { createClient, getCurrentUser } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { calculateLevel, calculateMaxHearts } from "@/lib/utils";

export async function getDailyQuests() {
  const user = await getCurrentUser();
  if (!user) return { quests: [], error: "Not authenticated" };

  const supabase = await createClient();

  const { data, error } = await supabase.rpc("get_or_create_daily_quests", {
    p_user_id: user.id,
  });

  if (error) return { quests: [], error: error.message };

  return { quests: data || [] };
}

export async function claimQuestReward(userQuestId: string) {
  const user = await getCurrentUser();
  if (!user) return { error: "Not authenticated" };

  const supabase = await createClient();

  const { data: userQuest } = await supabase
    .from("user_quests")
    .select("*, quests(*)")
    .eq("id", userQuestId)
    .eq("user_id", user.id)
    .single();

  if (!userQuest) return { error: "Quest not found" };
  if (!userQuest.is_completed) return { error: "Quest not yet completed" };
  if (userQuest.is_claimed) return { error: "Reward already claimed" };

  const quest = userQuest.quests;
  if (!quest) return { error: "Quest data not found" };

  const { data: currentProfile } = await supabase
    .from("profiles")
    .select("xp, coins, hearts")
    .eq("id", user.id)
    .single();

  if (!currentProfile) return { error: "Profile not found" };

  const oldLevel = calculateLevel(currentProfile.xp);
  const newXp = currentProfile.xp + quest.reward_xp;
  const newLevel = calculateLevel(newXp);
  const leveledUp = newLevel > oldLevel;
  const newCoins = currentProfile.coins + quest.reward_coins;

  const updateData: Record<string, unknown> = {
    xp: newXp,
    coins: newCoins,
  };

  if (leveledUp) {
    updateData.hearts = calculateMaxHearts(newXp);
    updateData.last_heart_refill_at = new Date().toISOString();
  }

  await supabase
    .from("profiles")
    .update(updateData)
    .eq("id", user.id);

  await supabase
    .from("user_quests")
    .update({ is_claimed: true })
    .eq("id", userQuestId);

  revalidatePath("/learn");
  revalidatePath("/quests");
  revalidatePath("/leaderboard");

  return {
    success: true,
    xpEarned: quest.reward_xp,
    coinsEarned: quest.reward_coins,
    leveledUp,
  };
}

export async function updateQuestProgress(type: string, amount: number = 1) {
  const user = await getCurrentUser();
  if (!user) return { error: "Not authenticated" };

  const supabase = await createClient();

  // Bootstrap: pastikan quest hari ini sudah ada sebelum update progress
  await supabase.rpc("get_or_create_daily_quests", { p_user_id: user.id });

  const today = new Date().toISOString().split("T")[0];

  const { data: quests } = await supabase
    .from("quests")
    .select("id")
    .eq("type", type)
    .eq("is_daily", true);

  if (!quests || quests.length === 0) return { success: true };

  for (const quest of quests) {
    const { data: existingUQ } = await supabase
      .from("user_quests")
      .select("id, progress, is_completed")
      .eq("user_id", user.id)
      .eq("quest_id", quest.id)
      .eq("assigned_at", today)
      .single();

    if (existingUQ) {
      if (existingUQ.is_completed) continue;
      const { data: questData } = await supabase
        .from("quests")
        .select("target_value")
        .eq("id", quest.id)
        .single();

      const newProgress = (existingUQ.progress || 0) + amount;
      const isCompleted = questData && newProgress >= questData.target_value;

      await supabase
        .from("user_quests")
        .update({
          progress: newProgress,
          is_completed: isCompleted,
          completed_at: isCompleted ? new Date().toISOString() : null,
        })
        .eq("id", existingUQ.id);
    }
  }

  return { success: true };
}
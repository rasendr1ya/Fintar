"use server";

import { createClient, getCurrentUser } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

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

  const { data: rpcResult, error: rpcError } = await supabase.rpc(
    "claim_quest_reward",
    {
      p_user_id: user.id,
      p_user_quest_id: userQuestId,
    }
  );

  if (rpcError || !rpcResult || rpcResult.length === 0) {
    console.error("[claimQuestReward] RPC error:", rpcError);
    return { error: "Gagal claim reward quest" };
  }

  const result = rpcResult[0];

  if (!result.success) {
    return { error: result.error_msg ?? "Gagal claim reward quest" };
  }

  revalidatePath("/learn");
  revalidatePath("/profile");
  revalidatePath("/quests");
  revalidatePath("/leaderboard");

  return {
    success: true,
    xpEarned: result.xp_earned,
    coinsEarned: result.coins_earned,
    leveledUp: result.leveled_up,
  };
}

export async function updateQuestProgress(type: string, amount: number = 1) {
  const user = await getCurrentUser();
  if (!user) return { error: "Not authenticated" };

  const supabase = await createClient();

  // Bootstrap: pastikan quest hari ini sudah ada sebelum update progress
  const { error: bootstrapError } = await supabase.rpc("get_or_create_daily_quests", { p_user_id: user.id });
  if (bootstrapError) {
    console.error("[updateQuestProgress] Bootstrap error:", bootstrapError);
    return { error: "Gagal menyiapkan quest harian" };
  }

  const today = new Date().toISOString().split("T")[0];

  const { data: quests, error: questsError } = await supabase
    .from("quests")
    .select("id")
    .eq("type", type)
    .eq("is_daily", true);

  if (questsError) {
    console.error("[updateQuestProgress] Quests fetch error:", questsError);
    return { error: "Gagal memuat quest" };
  }

  if (!quests || quests.length === 0) return { success: true };

  for (const quest of quests) {
    const { data: existingUQ, error: userQuestError } = await supabase
      .from("user_quests")
      .select("id, progress, is_completed")
      .eq("user_id", user.id)
      .eq("quest_id", quest.id)
      .eq("assigned_at", today)
      .maybeSingle();

    if (userQuestError) {
      console.error("[updateQuestProgress] User quest fetch error:", userQuestError);
      return { error: "Gagal memuat progress quest" };
    }

    if (existingUQ) {
      if (existingUQ.is_completed) continue;
      const { data: questData, error: questDataError } = await supabase
        .from("quests")
        .select("target_value")
        .eq("id", quest.id)
        .single();

      if (questDataError || !questData) {
        console.error("[updateQuestProgress] Quest target fetch error:", questDataError);
        return { error: "Gagal memuat target quest" };
      }

      const newProgress = (existingUQ.progress || 0) + amount;
      const isCompleted = newProgress >= questData.target_value;

      const { error: updateError } = await supabase
        .from("user_quests")
        .update({
          progress: newProgress,
          is_completed: isCompleted,
          completed_at: isCompleted ? new Date().toISOString() : null,
        })
        .eq("id", existingUQ.id);

      if (updateError) {
        console.error("[updateQuestProgress] Progress update error:", updateError);
        return { error: "Gagal memperbarui progress quest" };
      }
    }
  }

  return { success: true };
}

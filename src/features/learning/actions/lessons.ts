"use server";

import { createClient, getCurrentUser } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { calculateLevel, calculateMaxHearts } from "@/lib/utils";
import { calculateNewStreak, getHeartsToRefill } from "@/lib/streak";
import type { Unit, Lesson, Challenge, UserProgress } from "@/types/database";

type LessonStatus = "completed" | "current" | "locked";

export async function getUserProgress(userId: string): Promise<UserProgress[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("user_progress")
    .select("*")
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching user progress:", error);
    return [];
  }

  return data || [];
}

interface LessonWithStatus extends Lesson {
  status: LessonStatus;
}

interface UnitWithLessons extends Unit {
  lessons: LessonWithStatus[];
}

export async function getUnitsWithLessons(): Promise<{
  units: UnitWithLessons[];
  error?: string;
}> {
  const user = await getCurrentUser();
  if (!user) return { units: [], error: "Not authenticated" };

  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("financial_goal")
    .eq("id", user.id)
    .single();

  const { data: units, error: unitsError } = await supabase
    .from("units")
    .select("*")
    .eq("is_deleted", false)
    .order("order_index");

  if (unitsError || !units) return { units: [], error: "Failed to fetch units" };

  const { data: lessons } = await supabase
    .from("lessons")
    .select("*")
    .eq("is_deleted", false)
    .order("order_index");

  const { data: progress } = await supabase
    .from("user_progress")
    .select("lesson_id")
    .eq("user_id", user.id);

  const completedLessonIds = new Set((progress || []).map((p) => p.lesson_id));

  const financialGoalTags: Record<string, string[]> = {
    hutang: ["debt", "basics"],
    investasi: ["investing", "stocks", "property"],
    cashflow: ["budgeting", "banking"],
    darurat: ["basics", "insurance", "risk"],
  };

  const goalTags = financialGoalTags[profile?.financial_goal || ""] || [];

  const unitsWithLessons: UnitWithLessons[] = units.map((unit) => {
    const unitLessons = (lessons || [])
      .filter((l) => l.unit_id === unit.id)
      .map((lesson, idx, arr) => {
        let status: LessonStatus = "locked";
        const prevLesson = idx > 0 ? arr[idx - 1] : null;

        if (completedLessonIds.has(lesson.id)) {
          status = "completed";
        } else if (idx === 0 || (prevLesson && completedLessonIds.has(prevLesson.id))) {
          status = "current";
        }

        return { ...lesson, status };
      });

    return { ...unit, lessons: unitLessons };
  });

  unitsWithLessons.sort((a, b) => {
    const aIsBasic = a.order_index <= 3 ? 0 : 1;
    const bIsBasic = b.order_index <= 3 ? 0 : 1;
    if (aIsBasic !== bIsBasic) return aIsBasic - bIsBasic;

    const aMatchesGoal = goalTags.some((tag) => a.tags?.includes(tag)) ? 0 : 1;
    const bMatchesGoal = goalTags.some((tag) => b.tags?.includes(tag)) ? 0 : 1;
    if (aMatchesGoal !== bMatchesGoal) return aMatchesGoal - bMatchesGoal;

    return a.order_index - b.order_index;
  });

  return { units: unitsWithLessons };
}

export async function getLessonById(lessonId: string) {
  const supabase = await createClient();

  const { data: lesson, error } = await supabase
    .from("lessons")
    .select("*")
    .eq("id", lessonId)
    .single();

  if (error) {
    console.error("Error fetching lesson:", error);
    return null;
  }

  return lesson;
}

export async function getChallengesByLessonId(
  lessonId: string
): Promise<{ challenges: Challenge[]; error?: string }> {
  const user = await getCurrentUser();
  if (!user) return { challenges: [], error: "Not authenticated" };

  const supabase = await createClient();

  const { data: lesson } = await supabase
    .from("lessons")
    .select("id")
    .eq("id", lessonId)
    .eq("is_deleted", false)
    .single();

  if (!lesson) return { challenges: [], error: "Lesson not found" };

  const { data: challenges, error } = await supabase
    .from("challenges")
    .select("*")
    .eq("lesson_id", lessonId)
    .eq("is_deleted", false)
    .order("order_index");

  if (error || !challenges) return { challenges: [], error: "Failed to fetch challenges" };

  const shuffled = [...challenges].sort(() => Math.random() - 0.5);
  const shuffledWithOptions = shuffled.map((c) => {
    const options = Array.isArray(c.options) ? c.options : [];
    const shuffledOpts = [...options].sort(() => Math.random() - 0.5);
    return { ...c, options: shuffledOpts };
  });

  return { challenges: shuffledWithOptions };
}

interface CompleteLessonResult {
  newXP: number;
  newLevel: number;
  leveledUp: boolean;
  newMaxHearts: number;
  coinsEarned: number;
  error?: string;
}

export async function completeLesson(
  lessonId: string,
  totalXP: number
): Promise<CompleteLessonResult> {
  const user = await getCurrentUser();
  if (!user) return { newXP: 0, newLevel: 1, leveledUp: false, newMaxHearts: 5, coinsEarned: 0, error: "Not authenticated" };

  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("xp, coins, streak, last_active_at, timezone")
    .eq("id", user.id)
    .single();

  if (!profile) return { newXP: 0, newLevel: 1, leveledUp: false, newMaxHearts: 5, coinsEarned: 0, error: "Profile not found" };

  const { error: progressError } = await supabase
    .from("user_progress")
    .upsert({ user_id: user.id, lesson_id: lessonId }, { onConflict: "user_id,lesson_id" });

  if (progressError) return { newXP: profile.xp, newLevel: calculateLevel(profile.xp), leveledUp: false, newMaxHearts: calculateMaxHearts(profile.xp), coinsEarned: 0, error: "Failed to save progress" };

  const oldLevel = calculateLevel(profile.xp);
  const newXP = profile.xp + totalXP;
  const newLevel = calculateLevel(newXP);
  const leveledUp = newLevel > oldLevel;
  const newMaxHearts = calculateMaxHearts(newXP);
  const coinsEarned = 5;

  const streakResult = calculateNewStreak(profile.streak, profile.last_active_at, profile.timezone || "Asia/Jakarta");

  const updateData: Record<string, any> = {
    xp: newXP,
    coins: profile.coins + coinsEarned,
    streak: streakResult.newStreak,
    last_active_at: streakResult.lastActiveAt,
    current_unit_id: null,
  };

  if (leveledUp) {
    updateData.hearts = newMaxHearts;
  }

  await supabase.from("profiles").update(updateData).eq("id", user.id);

  const { data: xpQuests } = await supabase
    .from("quests")
    .select("id")
    .eq("type", "XP")
    .eq("is_daily", true);

  const { data: lessonQuests } = await supabase
    .from("quests")
    .select("id")
    .eq("type", "LESSON")
    .eq("is_daily", true);

  const today = new Date().toISOString().split("T")[0];

  if (xpQuests && xpQuests.length > 0) {
    for (const q of xpQuests) {
      await supabase
        .from("user_quests")
        .upsert(
          { user_id: user.id, quest_id: q.id, assigned_at: today, progress: totalXP },
          { onConflict: "user_id,quest_id,assigned_at" }
        );
    }
  }

  if (lessonQuests && lessonQuests.length > 0) {
    const { data: lessonProgress } = await supabase
      .from("user_progress")
      .select("id")
      .eq("user_id", user.id)
      .gte("completed_at", `${today}T00:00:00`);

    const lessonsToday = lessonProgress?.length || 0;

    for (const q of lessonQuests) {
      await supabase
        .from("user_quests")
        .upsert(
          { user_id: user.id, quest_id: q.id, assigned_at: today, progress: lessonsToday },
          { onConflict: "user_id,quest_id,assigned_at" }
        );
    }
  }

  revalidatePath("/learn");
  revalidatePath("/lesson");

  return {
    newXP,
    newLevel,
    leveledUp,
    newMaxHearts,
    coinsEarned,
  };
}

export async function reduceHearts(): Promise<{ hearts: number; error?: string }> {
  const user = await getCurrentUser();
  if (!user) return { hearts: 0, error: "Not authenticated" };

  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("hearts, xp")
    .eq("id", user.id)
    .single();

  if (!profile) return { hearts: 0, error: "Profile not found" };

  const newHearts = Math.max(profile.hearts - 1, 0);

  await supabase
    .from("profiles")
    .update({ hearts: newHearts })
    .eq("id", user.id);

  return { hearts: newHearts };
}

export async function checkAndRefillHearts(): Promise<{ hearts: number; maxHearts: number }> {
  const user = await getCurrentUser();
  if (!user) return { hearts: 5, maxHearts: 5 };

  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("hearts, xp, last_heart_refill_at")
    .eq("id", user.id)
    .single();

  if (!profile) return { hearts: 5, maxHearts: 5 };

  const maxHearts = calculateMaxHearts(profile.xp);
  const heartsToAdd = getHeartsToRefill(profile.last_heart_refill_at, profile.hearts, maxHearts);

  if (heartsToAdd > 0) {
    const newHearts = Math.min(profile.hearts + heartsToAdd, maxHearts);
    await supabase
      .from("profiles")
      .update({
        hearts: newHearts,
        last_heart_refill_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    return { hearts: newHearts, maxHearts };
  }

  return { hearts: profile.hearts, maxHearts };
}
"use server";

import { createClient, getCurrentUser } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { calculateLevel, calculateMaxHearts } from "@/lib/utils";
import { calculateNewStreak } from "@/lib/streak";
import { BASE_HEARTS } from "@/lib/constants";
import { updateQuestProgress } from "@/features/quests/actions";
import type { Challenge, UserProgress } from "@/types/database";

// ── Types ──────────────────────────────────────────────────

export interface LessonInPath {
  id: string;
  title: string;
  order_index: number;
}

export interface UnitWithLessons {
  id: string;
  title: string;
  description: string | null;
  order_index: number;
  color_theme: string;
  tags: string[];
  lessons: LessonInPath[];
}

export interface LearningPathData {
  units: UnitWithLessons[];
  completedLessonIds: string[];
  error?: string;
}

export interface CompleteLessonResult {
  success: boolean;
  xpEarned: number;
  coinsEarned: number;
  didLevelUp: boolean;
  newLevel: number;
  newMaxHearts: number;
  newHearts: number;
  newStreak: number;
  newXp: number;
  newCoins: number;
  error?: string;
}

// ── Tag Mapping untuk Personalisasi ───────────────────────

const GOAL_TAG_MAP: Record<string, string[]> = {
  hutang: ["debt", "basics"],
  investasi: ["investing", "stocks", "property"],
  cashflow: ["budgeting", "banking"],
  darurat: ["basics", "insurance", "risk"],
};

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

export async function getUnitsWithLessons(): Promise<LearningPathData> {
  const user = await getCurrentUser();
  if (!user) return { units: [], completedLessonIds: [], error: "Not authenticated" };

  const supabase = await createClient();

  // 1. Fetch profile untuk personalisasi
  const { data: profile } = await supabase
    .from("profiles")
    .select("financial_goal")
    .eq("id", user.id)
    .maybeSingle();

  // 2. Fetch semua units yang aktif
  const { data: unitsData, error: unitsError } = await supabase
    .from("units")
    .select("id, title, description, order_index, color_theme, tags")
    .eq("is_deleted", false)
    .order("order_index", { ascending: true });

  if (unitsError || !unitsData) {
    console.error("Error fetching units:", unitsError);
    return { units: [], completedLessonIds: [], error: unitsError?.message };
  }

  // 3. Fetch semua lessons yang aktif (semua unit sekaligus)
  const { data: lessonsData, error: lessonsError } = await supabase
    .from("lessons")
    .select("id, title, order_index, unit_id")
    .eq("is_deleted", false)
    .order("order_index", { ascending: true });

  if (lessonsError || !lessonsData) {
    console.error("Error fetching lessons:", lessonsError);
    return { units: [], completedLessonIds: [], error: lessonsError?.message };
  }

  // 4. Fetch completed lessons untuk user ini
  const { data: progressData } = await supabase
    .from("user_progress")
    .select("lesson_id")
    .eq("user_id", user.id);

  const completedLessonIds = progressData?.map((p) => p.lesson_id) ?? [];

  // 5. Gabungkan lessons ke unit masing-masing (max 3 per unit)
  const unitsWithLessons: UnitWithLessons[] = unitsData.map((unit) => {
    const unitLessons = lessonsData
      .filter((l) => l.unit_id === unit.id)
      .slice(0, 3);

    return {
      ...unit,
      tags: unit.tags ?? [],
      lessons: unitLessons,
    };
  });

  // 6. Filter unit yang tidak punya lesson (jangan tampilkan)
  const unitsWithContent = unitsWithLessons.filter(
    (u) => u.lessons.length > 0
  );

  // 7. Personalisasi urutan unit
  const financialGoal = profile?.financial_goal ?? null;
  const relevantTags = financialGoal
    ? (GOAL_TAG_MAP[financialGoal] ?? [])
    : [];

  const fundamentals = unitsWithContent.filter((u) => u.order_index <= 3);
  const rest = unitsWithContent.filter((u) => u.order_index > 3);

  const hasTagOverlap = (unitTags: string[]) =>
    unitTags.some((tag) => relevantTags.includes(tag));

  const sortedRest = [...rest].sort((a, b) => {
    const aMatch = hasTagOverlap(a.tags) ? 0 : 1;
    const bMatch = hasTagOverlap(b.tags) ? 0 : 1;
    if (aMatch !== bMatch) return aMatch - bMatch;
    return a.order_index - b.order_index;
  });

  const sortedUnits = [...fundamentals, ...sortedRest];

  return { units: sortedUnits, completedLessonIds };
}

export async function getLessonById(lessonId: string) {
  const user = await getCurrentUser();
  if (!user) return null;

  const supabase = await createClient();

  const { data: lesson, error } = await supabase
    .from("lessons")
    .select("*")
    .eq("id", lessonId)
    .maybeSingle();

  if (error || !lesson) {
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

  // Normalisasi options: handle JSONB yang tersimpan sebagai escaped string
  const normalized = challenges.map((c) => ({
    ...c,
    options:
      typeof c.options === "string" ? JSON.parse(c.options) : c.options,
  }));

  return { challenges: normalized };
}

export async function completeLesson(
  lessonId: string,
  xpEarned: number,
  coinsEarned: number
): Promise<CompleteLessonResult> {
  const user = await getCurrentUser();
  if (!user) {
    return {
      success: false,
      xpEarned: 0,
      coinsEarned: 0,
      didLevelUp: false,
      newLevel: 1,
      newMaxHearts: 5,
      newHearts: 5,
      newStreak: 0,
      newXp: 0,
      newCoins: 0,
      error: "Not authenticated",
    };
  }

  const supabase = await createClient();

  // 1. Fetch profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("xp, coins, hearts, streak, last_active_at, timezone")
    .eq("id", user.id)
    .single();

  if (!profile) {
    return {
      success: false,
      xpEarned: 0,
      coinsEarned: 0,
      didLevelUp: false,
      newLevel: 1,
      newMaxHearts: 5,
      newHearts: 5,
      newStreak: 0,
      newXp: 0,
      newCoins: 0,
      error: "Profile not found",
    };
  }

  // 2. Idempotency check — jika sudah pernah selesai, skip update stats
  const { data: existingProgress } = await supabase
    .from("user_progress")
    .select("id")
    .eq("user_id", user.id)
    .eq("lesson_id", lessonId)
    .maybeSingle();

  const alreadyCompleted = !!existingProgress;

  // 3. Insert ke user_progress hanya jika belum pernah selesai
  if (!alreadyCompleted) {
    const { error: insertError } = await supabase
      .from("user_progress")
      .insert({
        user_id: user.id,
        lesson_id: lessonId,
        completed_at: new Date().toISOString(),
      });

    if (insertError && insertError.code !== "23505") {
      console.error("Error inserting user_progress:", insertError);
      return {
        success: false,
        xpEarned: 0,
        coinsEarned: 0,
        didLevelUp: false,
        newLevel: calculateLevel(profile.xp),
        newMaxHearts: calculateMaxHearts(profile.xp),
        newHearts: profile.hearts,
        newStreak: profile.streak,
        newXp: profile.xp,
        newCoins: profile.coins,
        error: "Failed to save progress",
      };
    }
  }

  // 4. Kalau sudah pernah selesai, jangan tambah XP/coins lagi
  if (alreadyCompleted) {
    return {
      success: true,
      xpEarned: 0,
      coinsEarned: 0,
      didLevelUp: false,
      newLevel: calculateLevel(profile.xp),
      newMaxHearts: calculateMaxHearts(profile.xp),
      newHearts: profile.hearts,
      newStreak: profile.streak,
      newXp: profile.xp,
      newCoins: profile.coins,
    };
  }

  // 5. Hitung level up & streak
  const oldLevel = calculateLevel(profile.xp);
  const newXP = profile.xp + xpEarned;
  const newLevel = calculateLevel(newXP);
  const leveledUp = newLevel > oldLevel;
  const newMaxHearts = calculateMaxHearts(newXP);

  const streakResult = calculateNewStreak(
    profile.streak,
    profile.last_active_at,
    profile.timezone || "Asia/Jakarta"
  );

  const updateData: Record<string, unknown> = {
    xp: newXP,
    coins: profile.coins + coinsEarned,
    streak: streakResult.newStreak,
    last_active_at: streakResult.lastActiveAt,
    current_unit_id: null,
  };

  if (leveledUp) {
    updateData.hearts = newMaxHearts;
    updateData.last_heart_refill_at = new Date().toISOString();
  }

  const { error: updateError } = await supabase.from("profiles").update(updateData).eq("id", user.id);

  if (updateError) {
    console.error("Error updating profile:", updateError);
    // Compensating action: hapus user_progress yang baru diinsert
    await supabase
      .from("user_progress")
      .delete()
      .eq("user_id", user.id)
      .eq("lesson_id", lessonId);
    return {
      success: false,
      xpEarned: 0,
      coinsEarned: 0,
      didLevelUp: false,
      newLevel: calculateLevel(profile.xp),
      newMaxHearts: calculateMaxHearts(profile.xp),
      newHearts: profile.hearts,
      newStreak: profile.streak,
      newXp: profile.xp,
      newCoins: profile.coins,
      error: "Gagal menyimpan reward",
    };
  }

  // 6. Update quest progress (non-blocking, wrap in try-catch)
  try {
    await updateQuestProgress("LESSON", 1);
    await updateQuestProgress("XP", xpEarned);
  } catch (questErr) {
    console.error("Error updating quest progress:", questErr);
    // Don't fail the whole lesson completion if quests fail
  }

  revalidatePath("/learn");
  revalidatePath("/quests");
  revalidatePath("/leaderboard");
  revalidatePath("/lesson/[id]", "page");

  return {
    success: true,
    xpEarned,
    coinsEarned,
    didLevelUp: leveledUp,
    newLevel,
    newMaxHearts,
    newHearts: leveledUp ? newMaxHearts : profile.hearts,
    newStreak: streakResult.newStreak,
    newXp: newXP,
    newCoins: profile.coins + coinsEarned,
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

  const { error: updateError } = await supabase
    .from("profiles")
    .update({ hearts: newHearts })
    .eq("id", user.id);

  if (updateError) {
    console.error("Error reducing hearts:", updateError);
    return { hearts: profile.hearts, error: "Gagal mengurangi nyawa" };
  }

  revalidatePath("/lesson/[id]", "page");
  return { hearts: newHearts };
}

export async function checkAndRefillHearts(): Promise<{ hearts: number; maxHearts: number; error?: string }> {
  const user = await getCurrentUser();
  if (!user) return { hearts: BASE_HEARTS, maxHearts: BASE_HEARTS };

  const supabase = await createClient();

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("hearts, xp, last_heart_refill_at")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError || !profile) {
    return { hearts: BASE_HEARTS, maxHearts: BASE_HEARTS };
  }

  const maxHearts = calculateMaxHearts(profile.xp);

  // Early return jika sudah penuh
  if (profile.hearts >= maxHearts) {
    return { hearts: profile.hearts, maxHearts };
  }

  // Jika belum pernah refill, lakukan full refill
  if (!profile.last_heart_refill_at) {
    const newHearts = maxHearts;
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        hearts: newHearts,
        last_heart_refill_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (updateError) {
      console.error("Error refilling hearts:", updateError);
      return { hearts: profile.hearts, maxHearts, error: "Gagal mengisi ulang nyawa" };
    }

    return { hearts: newHearts, maxHearts };
  }

  const now = new Date();
  const lastRefill = new Date(profile.last_heart_refill_at);
  const hoursElapsed = Math.floor((now.getTime() - lastRefill.getTime()) / (1000 * 60 * 60));

  // Early return jika belum lewat 1 jam
  if (hoursElapsed === 0) {
    return { hearts: profile.hearts, maxHearts };
  }

  const newHearts = Math.min(maxHearts, profile.hearts + hoursElapsed);

  const { error: updateError } = await supabase
    .from("profiles")
    .update({
      hearts: newHearts,
      last_heart_refill_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (updateError) {
    console.error("Error refilling hearts:", updateError);
    return { hearts: profile.hearts, maxHearts, error: "Gagal mengisi ulang nyawa" };
  }

  return { hearts: newHearts, maxHearts };
}

"use server";

import { createClient } from "@/lib/supabase/server";
import { calculateLevel } from "@/lib/utils";

export async function getLeaderboard() {
  const supabase = await createClient();

  const { data: profiles, error } = await supabase
    .from("profiles")
    .select("id, username, xp")
    .order("xp", { ascending: false })
    .limit(20);

  if (error) return { leaderboard: [], currentUserRank: null, error: error.message };

  const leaderboard = (profiles || []).map((p, idx) => ({
    rank: idx + 1,
    userId: p.id,
    username: p.username || "Learner",
    xp: p.xp,
    level: calculateLevel(p.xp),
  }));

  return { leaderboard, currentUserRank: null };
}
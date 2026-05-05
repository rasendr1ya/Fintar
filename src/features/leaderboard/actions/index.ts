"use server";

import { createClient, getCurrentUser, createServiceClient } from "@/lib/supabase/server";
import { calculateLevel } from "@/lib/utils";

export type LeaderboardEntry = {
  rank: number;
  id: string;
  username: string;
  xp: number;
  level: number;
  isCurrentUser: boolean;
};

export type LeaderboardData = {
  topUsers: LeaderboardEntry[];
  currentUserEntry: LeaderboardEntry | null;
};

export async function getLeaderboard(): Promise<LeaderboardData> {
  const user = await getCurrentUser();
  if (!user) return { topUsers: [], currentUserEntry: null };

  const serviceSupabase = createServiceClient();

  const { data: topUsers, error } = await serviceSupabase
    .from("profiles")
    .select("id, username, xp")
    .order("xp", { ascending: false })
    .limit(20);

  if (error) {
    console.error("[getLeaderboard] Error fetching top users:", error.message);
    return { topUsers: [], currentUserEntry: null };
  }

  if (!topUsers || topUsers.length === 0) {
    return { topUsers: [], currentUserEntry: null };
  }

  const entries: LeaderboardEntry[] = topUsers.map((u, i) => ({
    rank: i + 1,
    id: u.id,
    username: u.username || "Learner",
    xp: u.xp,
    level: calculateLevel(u.xp),
    isCurrentUser: u.id === user.id,
  }));

  const isUserInTop20 = entries.some((e) => e.isCurrentUser);

  let currentUserEntry: LeaderboardEntry | null = null;
  if (!isUserInTop20) {
    const supabase = await createClient();

    const { data: profile } = await supabase
      .from("profiles")
      .select("id, username, xp")
      .eq("id", user.id)
      .single();

    if (profile) {
      const { count } = await serviceSupabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .gt("xp", profile.xp);

      const rank = (count ?? 0) + 1;
      currentUserEntry = {
        rank,
        id: profile.id,
        username: profile.username || "Learner",
        xp: profile.xp,
        level: calculateLevel(profile.xp),
        isCurrentUser: true,
      };
    }
  }

  return { topUsers: entries, currentUserEntry };
}

import { getLeaderboard } from "@/features/leaderboard/actions";
import { getCurrentUser, getCurrentProfile } from "@/lib/supabase/server";
import { calculateLevel } from "@/lib/utils";
import { LeaderboardContent } from "@/features/leaderboard/components/LeaderboardContent";

export default async function LeaderboardPage() {
  const [leaderboardData, user, profile] = await Promise.all([
    getLeaderboard(),
    getCurrentUser(),
    getCurrentProfile(),
  ]);

  const currentUserLevel = profile ? calculateLevel(profile.xp) : 1;

  return (
    <LeaderboardContent
      leaderboard={leaderboardData.leaderboard}
      currentUserXP={profile?.xp ?? 0}
      currentUserLevel={currentUserLevel}
      currentUsername={profile?.username || "Learner"}
      currentUserId={user?.id}
    />
  );
}

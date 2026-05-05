import { getLeaderboard } from "@/features/leaderboard/actions";
import { LeaderboardContent } from "@/features/leaderboard/components/LeaderboardContent";

export default async function LeaderboardPage() {
  const data = await getLeaderboard();
  return <LeaderboardContent data={data} />;
}

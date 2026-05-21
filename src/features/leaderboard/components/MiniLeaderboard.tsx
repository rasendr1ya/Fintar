import Link from "next/link";
import { getLeaderboard, type LeaderboardEntry } from "@/features/leaderboard/actions";

export async function MiniLeaderboard() {
  const { topUsers, currentUserEntry } = await getLeaderboard();
  const top5 = topUsers.slice(0, 5);

  // Highlight current user kalau dia di luar top 5
  // - Rank 6-20: ada di topUsers tapi bukan top5
  // - Rank 21+: pakai currentUserEntry dari leaderboard action
  const userInTop5 = top5.some((e) => e.isCurrentUser);
  const userInRank6To20 = !userInTop5
    ? topUsers.find((e) => e.isCurrentUser) ?? null
    : null;
  const highlightEntry = userInRank6To20 || currentUserEntry;

  return (
    <div className="bg-white rounded-2xl border-2 border-gray-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-700">Leaderboard</h3>
        <Link
          href="/leaderboard"
          className="text-primary text-sm font-bold uppercase hover:text-primary-dark"
        >
          View All
        </Link>
      </div>

      {top5.length === 0 && (
        <p className="text-xs text-muted text-center py-2">
          Belum ada data
        </p>
      )}

      {top5.length > 0 && (
        <div className="space-y-1.5">
          {top5.map((entry) => (
            <MiniRow key={entry.id} entry={entry} />
          ))}
        </div>
      )}

      {highlightEntry && (
        <>
          <div className="my-3 border-t border-dashed border-gray-200" />
          <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs bg-primary/10 border border-primary/30">
            <span className="w-6 text-center font-bold shrink-0 text-primary">
              {highlightEntry.rank}
            </span>
            <span className="flex-1 truncate font-bold text-primary">
              {highlightEntry.username}
              <span className="text-primary/70 font-normal ml-1">(You)</span>
            </span>
            <span className="text-primary font-mono shrink-0">
              {highlightEntry.xp.toLocaleString("id-ID")} XP
            </span>
          </div>
        </>
      )}
    </div>
  );
}

function MiniRow({ entry }: { entry: LeaderboardEntry }) {
  let rankColor = "text-muted";
  if (entry.rank === 1) rankColor = "text-yellow-500";
  if (entry.rank === 2) rankColor = "text-gray-400";
  if (entry.rank === 3) rankColor = "text-orange-400";

  return (
    <div
      className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs transition-colors ${
        entry.isCurrentUser
          ? "bg-primary-50/60 border border-primary/20"
          : "hover:bg-gray-50"
      }`}
    >
      <span className={`w-6 text-center font-bold shrink-0 ${rankColor}`}>
        {entry.rank}
      </span>
      <span
        className={`flex-1 truncate font-medium ${
          entry.isCurrentUser ? "text-primary font-bold" : "text-text"
        }`}
      >
        {entry.username}
      </span>
      <span className="text-muted font-mono shrink-0">
        {entry.xp.toLocaleString("id-ID")} XP
      </span>
    </div>
  );
}

export default MiniLeaderboard;

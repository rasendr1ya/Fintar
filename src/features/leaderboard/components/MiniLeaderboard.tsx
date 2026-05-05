import Link from "next/link";
import { getLeaderboard, type LeaderboardEntry } from "@/features/leaderboard/actions";

export async function MiniLeaderboard() {
  const { topUsers } = await getLeaderboard();
  const top5 = topUsers.slice(0, 5);

  return (
    <div className="bg-white rounded-2xl border border-border/30 p-4">
      <h3 className="text-sm font-bold text-text mb-3">Top Peringkat</h3>

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

      <Link
        href="/leaderboard"
        className="block text-center text-xs text-primary hover:text-primary-dark font-medium mt-3 pt-2 border-t border-border/30 transition-colors"
      >
        Lihat Semua →
      </Link>
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

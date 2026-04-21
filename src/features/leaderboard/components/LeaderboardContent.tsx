"use client";

import { useState } from "react";

interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  xp: number;
  level: number;
}

interface LeaderboardContentProps {
  leaderboard: LeaderboardEntry[];
  currentUserXP: number;
  currentUserLevel: number;
  currentUsername: string;
  currentUserId?: string;
}

const rankEmojis: Record<number, string> = {
  1: "🥇",
  2: "🥈",
  3: "🥉",
};

function getInitials(username: string): string {
  if (!username) return "?";
  const parts = username.replace(/_/g, " ").trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

export function LeaderboardContent({
  leaderboard,
  currentUserXP,
  currentUserLevel,
  currentUsername,
  currentUserId,
}: LeaderboardContentProps) {
  const [isLoading] = useState(false);

  const currentUserEntry = leaderboard.find(
    (e) => e.username === currentUsername || (currentUserId && e.userId === currentUserId)
  );
  const isInTop = currentUserEntry != null;
  const currentUserRank = currentUserEntry?.rank ?? null;

  if (isLoading) {
    return (
      <div className="max-w-lg mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-text mb-6">Leaderboard 🏆</h1>
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white border border-border/30 animate-pulse">
              <div className="w-8 h-8 bg-gray-200 rounded-full" />
              <div className="flex-1">
                <div className="h-4 w-24 bg-gray-200 rounded" />
              </div>
              <div className="h-4 w-16 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-text mb-6">Leaderboard 🏆</h1>

      {leaderboard.length === 0 && (
        <div className="text-center py-16">
          <p className="text-5xl mb-4">🏆</p>
          <p className="text-lg font-medium text-text mb-2">Belum ada data leaderboard</p>
          <p className="text-sm text-muted">Mulai belajar untuk muncul di sini!</p>
        </div>
      )}

      {leaderboard.length > 0 && (
        <div className="space-y-2">
          {leaderboard.map((entry) => {
            const isCurrentUser =
              entry.username === currentUsername ||
              (currentUserId && entry.userId === currentUserId);
            const initials = getInitials(entry.username);

            return (
              <div
                key={entry.userId}
                className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
                  isCurrentUser
                    ? "bg-primary/8 border-2 border-primary/25"
                    : "bg-white border border-border/30"
                }`}
              >
                <span className="w-8 text-center font-bold text-lg shrink-0">
                  {rankEmojis[entry.rank] || (
                    <span className="text-sm text-muted">{entry.rank}</span>
                  )}
                </span>
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-sm font-bold ${
                    isCurrentUser
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-text-secondary"
                  }`}
                >
                  {initials}
                </div>
                <span
                  className={`flex-1 font-medium truncate ${
                    isCurrentUser ? "text-primary font-bold" : "text-text"
                  }`}
                >
                  {entry.username}
                  {isCurrentUser && (
                    <span className="text-xs ml-1.5 text-primary/70">(kamu)</span>
                  )}
                </span>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                    Lv.{entry.level}
                  </span>
                  <span className="text-sm text-muted font-medium">{entry.xp} XP</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!isInTop && currentUserXP > 0 && (
        <>
          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted font-medium">• • •</span>
            <div className="flex-1 h-px bg-border" />
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-primary/8 border-2 border-primary/25">
            <span className="w-8 text-center text-sm text-muted shrink-0">
              #{currentUserRank ?? ">"}
            </span>
            <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-sm font-bold bg-primary text-white">
              {getInitials(currentUsername)}
            </div>
            <span className="flex-1 font-bold text-primary truncate">
              {currentUsername}
              <span className="text-xs ml-1.5 text-primary/70">(kamu)</span>
            </span>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                Lv.{currentUserLevel}
              </span>
              <span className="text-sm text-muted font-medium">{currentUserXP} XP</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { TrophyIcon } from "@heroicons/react/24/solid";
import type { LeaderboardData } from "@/features/leaderboard/actions";

interface LeaderboardContentProps {
  data: LeaderboardData;
}

function getInitials(username: string): string {
  if (!username) return "?";
  const parts = username.replace(/_/g, " ").trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

export function LeaderboardContent({ data }: LeaderboardContentProps) {
  const { topUsers, currentUserEntry } = data;
  const [isLoading] = useState(false);

  if (isLoading) {
    return (
      <div className="max-w-[600px] mx-auto px-4 py-8 pb-24">
        <h1 className="text-2xl font-bold text-text mb-6">Leaderboard</h1>
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
    <div className="max-w-[600px] mx-auto px-4 py-8 pb-24">
      <h1 className="text-2xl font-bold text-text mb-6">Leaderboard</h1>

      {/* League Banner */}
      <div className="bg-yellow-100 border-2 border-yellow-200 rounded-2xl p-6 mb-8 flex items-center gap-4 shadow-sm">
        <div className="bg-yellow-400 p-3 rounded-xl text-white shadow-sm ring-4 ring-yellow-50 shrink-0">
          <TrophyIcon className="w-8 h-8" />
        </div>
        <div>
          <h2 className="font-bold text-lg text-yellow-800">Liga Sultan</h2>
          <p className="text-sm text-yellow-700">20 besar minggu ini</p>
        </div>
      </div>

      {/* Empty state */}
      {topUsers.length === 0 && (
        <div className="bg-white border-2 border-border rounded-2xl overflow-hidden shadow-sm">
          <div className="p-8 text-center text-muted">
            Belum ada pemain. Jadilah yang pertama!
          </div>
        </div>
      )}

      {/* Leaderboard List */}
      {topUsers.length > 0 && (
        <div className="bg-white border-2 border-border rounded-2xl overflow-hidden shadow-sm">
          {topUsers.map((entry) => {
            const initials = getInitials(entry.username);
            let rankColor = "text-muted";
            if (entry.rank === 1) rankColor = "text-yellow-500";
            if (entry.rank === 2) rankColor = "text-gray-400";
            if (entry.rank === 3) rankColor = "text-orange-400";

            return (
              <div
                key={entry.id}
                className={`flex items-center p-4 border-b border-border last:border-0 transition-colors ${
                  entry.isCurrentUser
                    ? "bg-primary-50 hover:bg-primary-50/90"
                    : "hover:bg-gray-50"
                }`}
              >
                <div className={`w-8 text-center font-bold mr-4 text-lg ${
                  entry.isCurrentUser ? "text-primary" : rankColor
                }`}>
                  {entry.rank}
                </div>

                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold mr-4 shrink-0 ${
                  entry.isCurrentUser
                    ? "bg-primary/15 text-primary-dark ring-1 ring-primary/30"
                    : "bg-gray-100 text-text-secondary"
                }`}>
                  {initials}
                </div>

                <div className="flex-1 min-w-0">
                  <p
                    className={`font-bold text-text truncate ${
                      entry.isCurrentUser ? "text-primary" : ""
                    }`}
                  >
                    {entry.username}
                    {entry.isCurrentUser && (
                      <span className="text-xs ml-1 font-medium text-primary/80">
                        (kamu)
                      </span>
                    )}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0 ml-2">
                  <span className={`text-xs ${
                    entry.isCurrentUser ? "text-primary/70" : "text-muted"
                  }`}>
                    Lv.{entry.level}
                  </span>
                  <span className={`font-mono font-bold px-3 py-1.5 rounded-lg text-sm ${
                    entry.isCurrentUser
                      ? "bg-white text-primary ring-1 ring-primary/20"
                      : "bg-gray-100 text-muted"
                  }`}>
                    {entry.xp.toLocaleString("id-ID")} XP
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Enhancement: current user outside top 20 */}
      {currentUserEntry && (
        <>
          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted font-medium">Posisi Kamu</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <div className="bg-white border-2 border-border rounded-2xl overflow-hidden shadow-sm">
            <div className="flex items-center p-4 bg-primary-50">
              <div className="w-8 text-center font-bold mr-4 text-lg text-primary">
                {currentUserEntry.rank}
              </div>

              <div className="w-10 h-10 rounded-full bg-primary/15 text-primary-dark ring-1 ring-primary/30 flex items-center justify-center text-sm font-bold mr-4 shrink-0">
                {getInitials(currentUserEntry.username)}
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-bold text-primary truncate">
                  {currentUserEntry.username}
                  <span className="text-xs ml-1 font-medium text-primary/80">
                    (kamu)
                  </span>
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0 ml-2">
                <span className="text-xs text-primary/70">
                  Lv.{currentUserEntry.level}
                </span>
                <span className="font-mono font-bold bg-white text-primary ring-1 ring-primary/20 px-3 py-1.5 rounded-lg text-sm">
                  {currentUserEntry.xp.toLocaleString("id-ID")} XP
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

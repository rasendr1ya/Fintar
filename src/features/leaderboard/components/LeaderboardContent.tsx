"use client";

import { useRef, useState } from "react";
import {
  TrophyIcon,
  UserCircleIcon,
  ChevronDownIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import type { LeaderboardData, LeaderboardEntry } from "@/features/leaderboard/actions";

interface LeaderboardContentProps {
  data: LeaderboardData;
}

function getInitials(username: string): string {
  if (!username) return "?";
  const parts = username.replace(/_/g, " ").trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

function CrownIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Band bawah */}
      <path d="M3 18h18v3H3z" />
      {/* 3 points */}
      <path d="M3 18L2 7l6.5 4L12 3l3.5 8L22 7l-1 11H3z" />
      {/* Jewel tengah */}
      <circle cx="12" cy="12" r="1.5" fill="white" fillOpacity="0.7" />
    </svg>
  );
}

function MedalIcon({
  rank,
  className,
}: {
  rank: number;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Pita V */}
      <path d="M8 2h8l-3 7h-2L8 2z" />
      {/* Medali lingkaran */}
      <circle cx="12" cy="15" r="7" />
      {/* Highlight ringan */}
      <circle
        cx="12"
        cy="15"
        r="4.5"
        fill="none"
        stroke="white"
        strokeOpacity="0.25"
        strokeWidth="1"
      />
      {/* Angka rank di tengah */}
      <text
        x="12"
        y="18"
        textAnchor="middle"
        fill="white"
        fontSize="9"
        fontWeight="bold"
      >
        {rank}
      </text>
    </svg>
  );
}

type PodiumSlot = {
  entry: LeaderboardEntry | null;
  displayRank: number;
};

const PODIUM_CONFIG: Record<
  number,
  {
    gradient: string;
    height: string;
    rounded: string;
    shadow: string;
    avatarSize: string;
    avatarTextSize: string;
    avatarBg: string;
    avatarText: string;
    ring: string;
    pillBg: string;
    pillText: string;
  }
> = {
  1: {
    gradient: "bg-gradient-to-b from-yellow-300 to-yellow-500",
    height: "h-32 md:h-40",
    rounded: "rounded-t-none",
    shadow: "shadow-lg shadow-yellow-500/25",
    avatarSize: "w-16 h-16",
    avatarTextSize: "text-lg",
    avatarBg: "bg-yellow-100",
    avatarText: "text-yellow-700",
    ring: "ring-yellow-400",
    pillBg: "bg-yellow-100",
    pillText: "text-yellow-700",
  },
  2: {
    gradient: "bg-gradient-to-b from-gray-200 to-gray-400",
    height: "h-24 md:h-32",
    rounded: "rounded-tl-2xl rounded-tr-none",
    shadow: "shadow-md shadow-gray-400/25",
    avatarSize: "w-14 h-14",
    avatarTextSize: "text-base",
    avatarBg: "bg-gray-100",
    avatarText: "text-gray-600",
    ring: "ring-gray-300",
    pillBg: "bg-gray-100",
    pillText: "text-gray-600",
  },
  3: {
    gradient: "bg-gradient-to-b from-orange-300 to-orange-500",
    height: "h-20 md:h-28",
    rounded: "rounded-tr-2xl rounded-tl-none",
    shadow: "shadow-md shadow-orange-500/25",
    avatarSize: "w-14 h-14",
    avatarTextSize: "text-base",
    avatarBg: "bg-orange-100",
    avatarText: "text-orange-700",
    ring: "ring-orange-400",
    pillBg: "bg-orange-100",
    pillText: "text-orange-700",
  },
};

function PodiumBlock({ slot }: { slot: PodiumSlot }) {
  const { entry, displayRank } = slot;

  // Slot kosong: tetap ambil ruang agar layout tidak patah
  if (!entry) {
    return <div className="flex-1 max-w-[120px]" />;
  }

  const config = PODIUM_CONFIG[displayRank];
  const initials = getInitials(entry.username);
  const isCurrentUser = entry.isCurrentUser;

  // Avatar tetap mengikuti warna rank; highlight current user hanya di teks
  const avatarClasses = `${config.avatarBg} ${config.avatarText} ${config.ring}`;

  return (
    <div className="flex flex-col items-center flex-1 max-w-[120px]">
      {/* Avatar & info area */}
      <div className="flex flex-col items-center text-center gap-1 pb-3 px-1">
        {/* Crown untuk rank 1 */}
        {displayRank === 1 && (
          <CrownIcon className="w-9 h-9 md:w-10 md:h-10 text-yellow-500 drop-shadow-sm -mb-1" />
        )}

        {/* Avatar */}
        <div className="relative">
          <div
            className={`${config.avatarSize} ${config.avatarTextSize} rounded-full flex items-center justify-center font-bold shadow-md ring-4 ring-offset-2 ${avatarClasses}`}
          >
            {initials}
          </div>

          {/* Medal untuk rank 2 & 3 */}
          {(displayRank === 2 || displayRank === 3) && (
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full ring-2 ring-white shadow-sm overflow-hidden">
              <MedalIcon
                rank={displayRank}
                className={`w-full h-full ${
                  displayRank === 2 ? "text-gray-400" : "text-orange-400"
                }`}
              />
            </div>
          )}
        </div>

        {/* Username */}
        <p
          className={`font-bold text-xs truncate max-w-[100px] ${
            isCurrentUser ? "text-primary" : "text-text"
          }`}
        >
          {entry.username}
          {isCurrentUser && (
            <span className="text-[10px] ml-1 font-medium text-primary/80">
              (kamu)
            </span>
          )}
        </p>

        {/* Level */}
        <span
          className={`text-[10px] ${
            isCurrentUser ? "text-primary/70" : "text-muted"
          }`}
        >
          Lv.{entry.level}
        </span>

        {/* XP pill tetap mengikuti warna rank */}
        <span
          className={`text-xs font-bold px-3 py-1 rounded-full ${config.pillBg} ${config.pillText}`}
        >
          {entry.xp.toLocaleString("id-ID")} XP
        </span>
      </div>

      {/* Platform blok */}
      <div
        className={`w-full ${config.height} ${config.gradient} ${config.rounded} ${config.shadow} flex items-center justify-center`}
      >
        <span className="text-3xl md:text-4xl font-bold text-white drop-shadow-sm">
          {displayRank}
        </span>
      </div>
    </div>
  );
}

export function LeaderboardContent({ data }: LeaderboardContentProps) {
  const { topUsers, currentUserEntry } = data;
  const [isLoading] = useState(false);
  const [isPulsing, setIsPulsing] = useState(false);

  const currentUserRowRef = useRef<HTMLDivElement>(null);
  const bottomUserSectionRef = useRef<HTMLDivElement>(null);

  if (isLoading) {
    return (
      <div className="max-w-[600px] mx-auto px-4 py-8 pb-24">
        <h1 className="text-2xl font-bold text-text mb-6">Leaderboard</h1>
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3 rounded-xl bg-white border border-border/30 animate-pulse"
            >
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

  const topThree = topUsers.slice(0, 3);

  const podiumSlots: PodiumSlot[] = [
    {
      entry: topThree.length >= 2 ? topThree[1] : null,
      displayRank: 2,
    },
    {
      entry: topThree.length >= 1 ? topThree[0] : null,
      displayRank: 1,
    },
    {
      entry: topThree.length >= 3 ? topThree[2] : null,
      displayRank: 3,
    },
  ];

  const remainingList = topUsers.slice(3);

  const currentUserInTop3 = topThree.find((e) => e.isCurrentUser) ?? null;
  const currentUserInList = remainingList.find((e) => e.isCurrentUser) ?? null;
  const currentUserOutsideTop20 = currentUserEntry;

  const hasCurrentUser =
    currentUserInTop3 || currentUserInList || currentUserOutsideTop20;

  const triggerPulse = () => {
    setIsPulsing(true);
    setTimeout(() => setIsPulsing(false), 1000);
  };

  const handleScrollToUser = () => {
    if (currentUserInList && currentUserRowRef.current) {
      currentUserRowRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      setTimeout(triggerPulse, 600);
    } else if (currentUserOutsideTop20 && bottomUserSectionRef.current) {
      bottomUserSectionRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      setTimeout(triggerPulse, 600);
    }
  };

  return (
    <div className="max-w-[600px] mx-auto px-4 py-8 pb-24">
      <h1 className="text-2xl font-bold text-text mb-6">Leaderboard</h1>

      {/* League Banner */}
      <div className="bg-yellow-100 border-2 border-yellow-200 rounded-2xl p-6 mb-8 flex items-center gap-4 shadow-sm">
        <div className="bg-yellow-400 p-3 rounded-xl text-white shadow-sm ring-4 ring-yellow-50 shrink-0">
          <TrophyIcon className="w-8 h-8" />
        </div>
        <div>
          <h2 className="font-bold text-lg text-yellow-800">Liga Mahasiswa</h2>
          <p className="text-sm text-yellow-700">Ranking 20 besar</p>
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

      {/* Top 3 Podium + List dalam shared card */}
      {topUsers.length > 0 && (
        <div className="bg-white border-2 border-border rounded-2xl overflow-hidden shadow-sm mb-6">
          {/* Podium area */}
          <div className="bg-bg px-4 pt-8 pb-4">
            <div className="flex items-end justify-center gap-0 max-w-[360px] mx-auto">
              {podiumSlots.map((slot) => (
                <PodiumBlock key={slot.displayRank} slot={slot} />
              ))}
            </div>
          </div>

          {/* Bridge: gradient fade dari bg ke white */}
          <div className="h-5 bg-gradient-to-b from-bg to-white" />

          {/* Current User Quick Access Card */}
          {hasCurrentUser && (
            <div className="px-4 pb-3">
              {currentUserInTop3 ? (
                // State A: Current user di top 3
                <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-3 flex items-center justify-center gap-2">
                  <SparklesIcon className="w-5 h-5 text-yellow-600" />
                  <p className="text-sm font-bold text-yellow-800">
                    Kamu masuk 3 besar!
                  </p>
                </div>
              ) : (
                // State B & C: Current user di rank 4-20 atau di luar top 20
                <button
                  type="button"
                  onClick={handleScrollToUser}
                  className="w-full bg-primary-50 border-2 border-primary/20 rounded-2xl p-3 flex items-center justify-between cursor-pointer hover:bg-primary-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                  <div className="flex items-center gap-3">
                    <UserCircleIcon className="w-6 h-6 text-primary" />
                    <div className="text-left">
                      <p className="text-sm font-bold text-text">
                        Lihat posisimu
                      </p>
                      <p className="text-xs text-primary">
                        Kamu di peringkat #
                        {(currentUserInList ?? currentUserOutsideTop20)?.rank} ·{" "}
                        {(currentUserInList ?? currentUserOutsideTop20)?.xp.toLocaleString(
                          "id-ID"
                        )}{" "}
                        XP
                      </p>
                    </div>
                  </div>
                  <ChevronDownIcon className="w-5 h-5 text-primary" />
                </button>
              )}
            </div>
          )}

          {/* Leaderboard List — rank 4-20 */}
          {remainingList.length > 0 && (
            <div className="border-t border-border">
              {remainingList.map((entry) => {
                const initials = getInitials(entry.username);
                const isCurrentUserRow = entry.isCurrentUser;

                return (
                  <div
                    key={entry.id}
                    ref={isCurrentUserRow ? currentUserRowRef : null}
                    className={`flex items-center p-4 border-b border-border last:border-0 transition-all duration-300 ${
                      isCurrentUserRow
                        ? "bg-primary-50 hover:bg-primary-50/90"
                        : "hover:bg-gray-50"
                    } ${
                      isPulsing && isCurrentUserRow
                        ? "ring-2 ring-primary ring-offset-2"
                        : ""
                    }`}
                  >
                    <div
                      className={`w-8 text-center font-bold mr-4 text-lg ${
                        isCurrentUserRow ? "text-primary" : "text-muted"
                      }`}
                    >
                      {entry.rank}
                    </div>

                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold mr-4 shrink-0 ${
                        isCurrentUserRow
                          ? "bg-primary/15 text-primary-dark ring-1 ring-primary/30"
                          : "bg-gray-100 text-text-secondary"
                      }`}
                    >
                      {initials}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p
                        className={`font-bold text-text truncate ${
                          isCurrentUserRow ? "text-primary" : ""
                        }`}
                      >
                        {entry.username}
                        {isCurrentUserRow && (
                          <span className="text-xs ml-1 font-medium text-primary/80">
                            (kamu)
                          </span>
                        )}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 ml-2">
                      <span
                        className={`text-xs ${
                          isCurrentUserRow ? "text-primary/70" : "text-muted"
                        }`}
                      >
                        Lv.{entry.level}
                      </span>
                      <span
                        className={`font-mono font-bold px-3 py-1.5 rounded-lg text-sm ${
                          isCurrentUserRow
                            ? "bg-white text-primary ring-1 ring-primary/20"
                            : "bg-gray-100 text-muted"
                        }`}
                      >
                        {entry.xp.toLocaleString("id-ID")} XP
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Current user outside top 20 */}
      {currentUserOutsideTop20 && (
        <>
          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted font-medium">Posisi Kamu</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <div
            ref={bottomUserSectionRef}
            className={`bg-white border-2 border-border rounded-2xl overflow-hidden shadow-sm transition-all duration-300 ${
              isPulsing ? "ring-2 ring-primary ring-offset-2" : ""
            }`}
          >
            <div className="flex items-center p-4 bg-primary-50">
              <div className="w-8 text-center font-bold mr-4 text-lg text-primary">
                {currentUserOutsideTop20.rank}
              </div>

              <div className="w-10 h-10 rounded-full bg-primary/15 text-primary-dark ring-1 ring-primary/30 flex items-center justify-center text-sm font-bold mr-4 shrink-0">
                {getInitials(currentUserOutsideTop20.username)}
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-bold text-primary truncate">
                  {currentUserOutsideTop20.username}
                  <span className="text-xs ml-1 font-medium text-primary/80">
                    (kamu)
                  </span>
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0 ml-2">
                <span className="text-xs text-primary/70">
                  Lv.{currentUserOutsideTop20.level}
                </span>
                <span className="font-mono font-bold bg-white text-primary ring-1 ring-primary/20 px-3 py-1.5 rounded-lg text-sm">
                  {currentUserOutsideTop20.xp.toLocaleString("id-ID")} XP
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

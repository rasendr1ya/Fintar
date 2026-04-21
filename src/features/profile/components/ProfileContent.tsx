"use client";

import { useState } from "react";
import { logoutUser } from "@/features/auth/actions";
import { useRouter } from "next/navigation";

interface ProfileContentProps {
  username: string;
  level: number;
  xp: number;
  xpProgress: number;
  nextLevelXP: number;
  streak: number;
  coins: number;
  hearts: number;
  maxHearts: number;
  occupation: string | null;
  financialGoal: string | null;
  lessonsCompleted?: number;
}

const occupationLabels: Record<string, string> = {
  pelajar: "Pelajar / Mahasiswa",
  karyawan: "Karyawan",
  freelancer: "Freelancer",
  bisnis: "Pemilik Bisnis",
};

const goalLabels: Record<string, string> = {
  hutang: "Melunasi Hutang",
  investasi: "Mulai Investasi",
  cashflow: "Mengatur Cash Flow",
  darurat: "Dana Darurat",
};

function getInitials(username: string): string {
  if (!username) return "?";
  const parts = username.replace(/_/g, " ").trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

export function ProfileContent({
  username,
  level,
  xp,
  xpProgress,
  nextLevelXP,
  streak,
  coins,
  hearts,
  maxHearts,
  occupation,
  financialGoal,
  lessonsCompleted = 0,
}: ProfileContentProps) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logoutUser();
    router.push("/login");
    router.refresh();
  };

  const initials = getInitials(username);

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <div className="text-center mb-6">
        <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/20">
          <span className="text-3xl font-bold text-white">{initials}</span>
        </div>
        <h1 className="text-2xl font-bold text-text">{username}</h1>
        <div className="flex items-center justify-center gap-2 mt-2">
          <span className="bg-primary text-white text-sm font-bold px-4 py-1.5 rounded-full shadow-sm">
            Level {level}
          </span>
          {occupation && (
            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
              {occupationLabels[occupation] || occupation}
            </span>
          )}
        </div>
        {financialGoal && (
          <p className="text-xs text-muted mt-1.5">
            🎯 {goalLabels[financialGoal] || financialGoal}
          </p>
        )}
      </div>

      <div className="bg-white rounded-2xl border-2 border-border/30 p-4 mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-text">Level {level}</span>
          <span className="text-sm text-muted">{xp} / {nextLevelXP} XP</span>
        </div>
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-primary-light rounded-full transition-all duration-500"
            style={{ width: `${Math.min(xpProgress, 100)}%` }}
          />
        </div>
        <p className="text-xs text-muted mt-1.5 text-center">
          {nextLevelXP - xp} XP menuju Level {level + 1}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-white rounded-2xl border-2 border-border/30 p-4 text-center">
          <span className="text-2xl">🔥</span>
          <p className="text-2xl font-bold text-text">{streak}</p>
          <p className="text-xs text-muted">Streak Harian</p>
        </div>
        <div className="bg-white rounded-2xl border-2 border-border/30 p-4 text-center">
          <span className="text-2xl">❤️</span>
          <p className="text-2xl font-bold text-text">{hearts}/{maxHearts}</p>
          <p className="text-xs text-muted">Hearts</p>
        </div>
        <div className="bg-white rounded-2xl border-2 border-border/30 p-4 text-center">
          <span className="text-2xl">🪙</span>
          <p className="text-2xl font-bold text-text">{coins}</p>
          <p className="text-xs text-muted">Coins</p>
        </div>
        <div className="bg-white rounded-2xl border-2 border-border/30 p-4 text-center">
          <span className="text-2xl">📚</span>
          <p className="text-2xl font-bold text-text">{lessonsCompleted}</p>
          <p className="text-xs text-muted">Pelajaran Selesai</p>
        </div>
      </div>

      <button
        onClick={handleLogout}
        disabled={isLoggingOut}
        className="w-full bg-white text-hearts font-bold py-3 rounded-2xl border-2 border-hearts/30 hover:bg-hearts/5 hover:border-hearts/50 transition-all duration-200 disabled:opacity-50"
      >
        {isLoggingOut ? "Keluar..." : "Keluar"}
      </button>
    </div>
  );
}

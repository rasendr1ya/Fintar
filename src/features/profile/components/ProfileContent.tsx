"use client";

import { useState } from "react";
import { logoutUser } from "@/features/auth/actions";
import { useRouter } from "next/navigation";
import { ShareCard } from "@/components/share/ShareCard";
import { ShareIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { FireIcon, HeartIcon, CurrencyDollarIcon, BookOpenIcon } from "@heroicons/react/24/solid";

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
  lessonsCompleted?: number;
  isAdmin: boolean;
  adminRole: "dev" | "practitioner" | null;
}

const occupationLabels: Record<string, string> = {
  pelajar: "Pelajar / Mahasiswa",
  karyawan: "Karyawan",
  freelancer: "Freelancer",
  bisnis: "Pemilik Bisnis",
};

function getInitials(username: string): string {
  if (!username) return "?";
  const parts = username.replace(/_/g, " ").trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

function getUserRole(
  isAdmin: boolean,
  adminRole: "dev" | "practitioner" | null,
  occupation: string | null
): string {
  if (isAdmin) {
    if (adminRole === "dev") return "Admin / Dev";
    if (adminRole === "practitioner") return "Admin / Praktisi";
    return "Admin";
  }
  return occupationLabels[occupation ?? ""] ?? "Pelajar / Mahasiswa";
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
  lessonsCompleted = 0,
  isAdmin,
  adminRole,
}: ProfileContentProps) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logoutUser();
    router.push("/login");
    router.refresh();
  };

  const initials = getInitials(username);
  const role = getUserRole(isAdmin, adminRole, occupation);

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <div className="text-center mb-6">
        <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/20">
          <span className="text-3xl font-bold text-white">{initials}</span>
        </div>
        <h1 className="text-2xl font-bold text-text">{username}</h1>
        <div className="flex items-center justify-center gap-2 mt-2 flex-wrap">
          <span className="bg-primary text-white text-sm font-bold px-4 py-1.5 rounded-full shadow-sm">
            Level {level}
          </span>
          <span className="bg-primary/10 text-primary text-sm font-bold px-4 py-1.5 rounded-full">
            {role}
          </span>
        </div>
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

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-white rounded-2xl border-2 border-border/30 p-4 text-center">
          <FireIcon className="w-7 h-7 text-orange-500 mx-auto mb-1" />
          <p className="text-2xl font-bold text-text">{streak}</p>
          <p className="text-xs text-muted">Streak Harian</p>
        </div>
        <div className="bg-white rounded-2xl border-2 border-border/30 p-4 text-center">
          <HeartIcon className="w-7 h-7 text-hearts mx-auto mb-1" />
          <p className="text-2xl font-bold text-text">{hearts}/{maxHearts}</p>
          <p className="text-xs text-muted">Hearts</p>
        </div>
        <div className="bg-white rounded-2xl border-2 border-border/30 p-4 text-center">
          <CurrencyDollarIcon className="w-7 h-7 text-yellow-500 mx-auto mb-1" />
          <p className="text-2xl font-bold text-text">{coins}</p>
          <p className="text-xs text-muted">Coins</p>
        </div>
        <div className="bg-white rounded-2xl border-2 border-border/30 p-4 text-center">
          <BookOpenIcon className="w-7 h-7 text-primary mx-auto mb-1" />
          <p className="text-2xl font-bold text-text">{lessonsCompleted}</p>
          <p className="text-xs text-muted">Pelajaran Selesai</p>
        </div>
      </div>

      <button
        onClick={() => setShowShareModal(true)}
        className="w-full flex items-center justify-between px-4 py-3 mb-4 bg-white rounded-2xl border-2 border-border/30 hover:border-primary/30 hover:shadow-md transition-all duration-200 group"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
            <ShareIcon className="w-5 h-5 text-primary" />
          </div>
          <div className="text-left">
            <p className="font-bold text-text text-sm">Share Progress</p>
            <p className="text-xs text-muted">Bagikan pencapaianmu ke teman</p>
          </div>
        </div>
        <ChevronRightIcon className="w-5 h-5 text-muted group-hover:text-primary transition-colors" />
      </button>

      <button
        onClick={handleLogout}
        disabled={isLoggingOut}
        className="w-full bg-white text-hearts font-bold py-3 rounded-2xl border-2 border-hearts/30 hover:bg-hearts/5 hover:border-hearts/50 transition-all duration-200 disabled:opacity-50"
      >
        {isLoggingOut ? "Keluar..." : "Keluar"}
      </button>

      {showShareModal && (
        <ShareCard
          username={username}
          xp={xp}
          streak={streak}
          level={level}
          lessonsCompleted={lessonsCompleted}
          role={role}
          onClose={() => setShowShareModal(false)}
        />
      )}
    </div>
  );
}

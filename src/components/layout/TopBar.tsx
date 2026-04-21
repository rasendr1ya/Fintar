"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { HeartIcon, FireIcon } from "@heroicons/react/24/solid";
import { Logo } from "@/components/branding/Logo";

interface TopBarProps {
  hearts: number;
  streak: number;
  coins: number;
  xp?: number;
  showLogo?: boolean;
  lastHeartRefillAt?: string | null;
}

export function TopBar({ hearts, streak, coins, xp = 0, showLogo = true, lastHeartRefillAt }: TopBarProps) {
  const [timeLeft, setTimeLeft] = useState<string | null>(null);

  // Calculate Max Hearts based on XP
  const level = Math.floor(xp / 100) + 1;
  const maxHearts = Math.min(15, 5 + (level - 1));

  useEffect(() => {
    if (hearts >= maxHearts || !lastHeartRefillAt) {
      setTimeLeft(null);
      return;
    }

    const calculateTimeLeft = () => {
      const lastRefill = new Date(lastHeartRefillAt);
      const nextRefill = new Date(lastRefill.getTime() + 60 * 60 * 1000);
      const now = new Date();
      
      const diff = nextRefill.getTime() - now.getTime();
      
      if (diff <= 0) return "00:00"; 

      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      
      return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, [hearts, lastHeartRefillAt, maxHearts]);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-border">
      <div className="flex items-center justify-between px-4 py-3 md:px-6">
        {/* Logo - visible on mobile, hidden on desktop (sidebar has it) */}
        {showLogo && (
          <Link href="/learn" className="md:hidden flex items-center gap-2">
            <Logo size="sm" />
          </Link>
        )}

        {/* Spacer for desktop */}
        <div className="hidden md:block" />

        {/* Stats */}
        <div className="flex items-center gap-4 md:gap-6">
          {/* Streak */}
          <div className="flex items-center gap-1.5" title="Daily Streak">
            <FireIcon className="w-6 h-6 text-streak" />
            <span className="font-bold text-text">{streak}</span>
          </div>

          {/* Hearts */}
          <div className="group relative flex items-center gap-1.5 cursor-help">
            <HeartIcon className="w-6 h-6 text-hearts" />
            <span className="font-bold text-text">
              {hearts} <span className="text-muted text-sm font-normal">/ {maxHearts}</span>
            </span>
            
            {/* Detailed Tooltip */}
            <div className="absolute top-full right-0 mt-3 w-48 bg-white border border-border rounded-xl shadow-xl p-3 hidden group-hover:block z-50 animate-in fade-in slide-in-from-top-1">
               <p className="text-sm font-bold text-text mb-1">Hearts</p>
               <p className="text-xs text-muted mb-2">
                 Max Capacity: {maxHearts}<br/>
                 (Increases with Level)
               </p>
               {hearts < maxHearts && timeLeft ? (
                 <div className="bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded-lg text-center">
                   Next +1 in: {timeLeft}
                 </div>
               ) : (
                 <div className="text-xs text-success font-semibold">Full Energy!</div>
               )}
            </div>
          </div>

          {/* Coins */}
          <div className="flex items-center gap-1.5" title="Coins">
            <div className="w-6 h-6 rounded-full bg-coins flex items-center justify-center shadow-sm">
              <span className="text-xs font-bold text-amber-800">$</span>
            </div>
            <span className="font-bold text-text">{coins}</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default TopBar;

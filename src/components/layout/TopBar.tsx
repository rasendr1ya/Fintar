"use client";

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

export function TopBar({ hearts, streak, coins, xp = 0, showLogo = true }: TopBarProps) {
  const level = Math.floor(xp / 100) + 1;
  const maxHearts = Math.min(15, 5 + (level - 1));

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-border">
      <div className="flex items-center justify-between px-4 py-3 md:px-6">
        {showLogo && (
          <Link href="/learn" className="md:hidden flex items-center gap-2">
            <Logo size="sm" />
          </Link>
        )}

        <div className="hidden md:block" />

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
            
            {/* Tooltip */}
            <div className="absolute top-full right-0 mt-3 w-48 bg-white border border-border rounded-xl shadow-xl p-3 hidden group-hover:block z-50">
               <p className="text-sm font-bold text-text mb-1">Hearts</p>
               <p className="text-xs text-muted mb-2">
                 Max Capacity: {maxHearts}<br/>
                 (Increases with Level)
               </p>
               {hearts < maxHearts ? (
                 <div className="text-xs text-primary font-semibold">Refills every hour</div>
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

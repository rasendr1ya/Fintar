"use client";

import type { ShopItem } from "@/types/database";
import { HeartIcon, FireIcon, BoltIcon, SparklesIcon } from "@heroicons/react/24/solid";

interface ShopItemCardProps {
  item: ShopItem;
  userCoins: number;
  streakFreezeActive?: boolean;
  heartsFull?: boolean;
  onBuy: () => void;
  isPending?: boolean;
}

const TYPE_META: Record<string, { Icon: React.ComponentType<{ className?: string }>; bg: string; fg: string }> = {
  HEART_REFILL: { Icon: HeartIcon, bg: "bg-hearts/10", fg: "text-hearts" },
  STREAK_FREEZE: { Icon: FireIcon, bg: "bg-blue-100", fg: "text-blue-500" },
  XP_BOOST: { Icon: BoltIcon, bg: "bg-yellow-100", fg: "text-yellow-500" },
  COSMETIC: { Icon: SparklesIcon, bg: "bg-xp/10", fg: "text-xp" },
};

export function ShopItemCard({
  item,
  userCoins,
  streakFreezeActive = false,
  heartsFull = false,
  onBuy,
  isPending = false,
}: ShopItemCardProps) {
  const isComingSoon = !item.is_active;
  const canAfford = userCoins >= item.price_coins;

  const isStreakFreezeActive = item.type === "STREAK_FREEZE" && streakFreezeActive;
  const isHeartRefillActive = item.type === "HEART_REFILL" && heartsFull;

  let state: "available" | "insufficient" | "active" | "coming_soon";

  if (isComingSoon) {
    state = "coming_soon";
  } else if (isStreakFreezeActive || isHeartRefillActive) {
    state = "active";
  } else if (!canAfford) {
    state = "insufficient";
  } else {
    state = "available";
  }

  const isDisabled = state !== "available" || isPending;

  const meta = TYPE_META[item.type] || TYPE_META.COSMETIC;
  const { Icon } = meta;

  return (
    <div className="relative bg-white border-2 border-border rounded-2xl p-5 hover:border-border/80 transition-colors">
      {/* Coming Soon Overlay */}
      {state === "coming_soon" && (
        <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] rounded-2xl z-10 flex items-center justify-center">
          <span className="text-sm font-bold text-muted bg-gray-100 px-4 py-2 rounded-full border border-border/30">
            Segera Hadir
          </span>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 min-w-0 flex-1">
          <div className={`w-16 h-16 rounded-xl flex items-center justify-center shrink-0 ${meta.bg} ${meta.fg}`}>
            <Icon className="w-8 h-8" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-lg text-text">{item.name}</h3>
              {state === "active" && (
                <span className="text-xs bg-success/10 text-success px-2 py-0.5 rounded-full font-medium shrink-0">
                  {item.type === "STREAK_FREEZE" ? "Aktif" : "Penuh"}
                </span>
              )}
            </div>
            {item.description && (
              <p className="text-sm text-muted mt-1">{item.description}</p>
            )}
          </div>
        </div>

        <button
          onClick={onBuy}
          disabled={isDisabled}
          className={`shrink-0 text-sm font-bold px-5 py-2 rounded-xl transition-all duration-200 min-w-[90px] ml-4 ${
            state === "available"
              ? "bg-primary text-white border-b-4 border-primary-dark hover:brightness-110 active:border-b-0 active:translate-y-1"
              : "bg-gray-100 text-muted cursor-not-allowed border-2 border-gray-200"
          }`}
        >
          {isPending
            ? "..."
            : state === "coming_soon"
              ? "Segera Hadir"
              : state === "active"
                ? item.type === "STREAK_FREEZE"
                  ? "Aktif"
                  : "Penuh"
                : (
                    <span className="inline-flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded-full bg-coins flex items-center justify-center shrink-0">
                        <span className="text-[7px] font-bold text-amber-800 leading-none">$</span>
                      </span>
                      <span className="font-extrabold">{item.price_coins}</span>
                    </span>
                  )}
        </button>
      </div>
    </div>
  );
}

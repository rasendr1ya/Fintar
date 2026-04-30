"use client";

import { useState } from "react";
import { buyHeartRefill, buyStreakFreeze } from "@/features/shop/actions";
import type { ShopItem } from "@/types/database";

interface ShopContentProps {
  items: ShopItem[];
  coins: number;
  hearts: number;
  maxHearts: number;
  hasStreakFreeze: boolean;
}

export function ShopContent({ items, coins, hearts, maxHearts, hasStreakFreeze }: ShopContentProps) {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [localHasStreakFreeze, setLocalHasStreakFreeze] = useState(hasStreakFreeze);

  const handleBuy = async (item: ShopItem) => {
    setIsLoading(item.id);
    setMessage(null);

    if (item.type === "STREAK_FREEZE") {
      const result = await buyStreakFreeze();
      if (result.error) {
        setMessage({ text: result.error, type: "error" });
      } else {
        setMessage({ text: "Streak Freeze berhasil dibeli! 🧊", type: "success" });
        setLocalHasStreakFreeze(true);
      }
      setIsLoading(null);
      return;
    }

    if (item.type === "HEART_REFILL") {
      if (hearts >= maxHearts) {
        setMessage({ text: "Hearts kamu sudah penuh! Tidak perlu refill ❤️", type: "error" });
        setIsLoading(null);
        return;
      }
      const result = await buyHeartRefill();
      if (result.error) {
        setMessage({ text: result.error, type: "error" });
      } else {
        setMessage({ text: "Hearts berhasil diisi ulang! ❤️", type: "success" });
      }
    }

    setIsLoading(null);
  };

  const itemIcons: Record<string, string> = {
    HEART_REFILL: "❤️‍🩹",
    STREAK_FREEZE: "🧊",
    XP_BOOST: "⭐",
    COSMETIC: "🎨",
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-text">Shop</h1>
        <div className="flex items-center gap-1.5 bg-coins/10 px-4 py-2 rounded-2xl border border-coins/20">
          <span className="text-lg">🪙</span>
          <span className="font-bold text-text text-lg">{coins}</span>
        </div>
      </div>

      <div className="mb-6 bg-white rounded-2xl border-2 border-border/30 p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted">Hearts kamu</span>
          <div className="flex items-center gap-1">
            <span className="text-hearts">❤️</span>
            <span className="font-bold text-text">{hearts}/{maxHearts}</span>
          </div>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden mt-2">
          <div
            className="h-full bg-hearts rounded-full transition-all duration-500"
            style={{ width: `${(hearts / maxHearts) * 100}%` }}
          />
        </div>
      </div>

      {message && (
        <div className={`mb-4 p-4 rounded-xl text-sm font-medium text-center animate-shake ${
          message.type === "success" ? "bg-success/10 text-success border border-success/20" : "bg-hearts/10 text-hearts border border-hearts/20"
        }`}>
          {message.text}
        </div>
      )}

      <div className="space-y-4">
        {items.map((item) => {
          const isStreakFreeze = item.type === "STREAK_FREEZE";
          const canAfford = coins >= item.price_coins;
          const isAlreadyOwned = isStreakFreeze && localHasStreakFreeze;
          const isDisabled = isLoading === item.id || !canAfford || isAlreadyOwned;

          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl border-2 border-border/30 p-5 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="text-4xl shrink-0">{item.icon || itemIcons[item.type] || "🛒"}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-text">{item.name}</h3>
                    {isAlreadyOwned && (
                      <span className="text-xs bg-success/10 text-success px-2 py-0.5 rounded-full font-medium">
                        Aktif
                      </span>
                    )}
                  </div>
                  {item.description && (
                    <p className="text-sm text-muted mt-1">{item.description}</p>
                  )}
                </div>
                <div className="text-right shrink-0">
                  <div className="flex items-center gap-1 mb-2">
                    <span className="text-sm">🪙</span>
                    <span className={`font-bold ${canAfford ? "text-text" : "text-hearts"}`}>
                      {item.price_coins}
                    </span>
                  </div>
                  <button
                    onClick={() => handleBuy(item)}
                    disabled={isDisabled}
                    title={
                      isAlreadyOwned
                        ? "Sudah aktif"
                        : !canAfford
                        ? `Koin tidak cukup! Kamu butuh ${item.price_coins} koin.`
                        : `Beli ${item.name}`
                    }
                    className={`text-sm font-bold px-5 py-2 rounded-xl transition-all duration-200 ${
                      isAlreadyOwned
                        ? "bg-gray-100 text-muted cursor-not-allowed border-2 border-gray-200"
                        : canAfford
                        ? "bg-primary text-white border-b-4 border-primary-dark hover:brightness-110 active:border-b-0 active:translate-y-1"
                        : "bg-gray-100 text-muted cursor-not-allowed border-2 border-gray-200"
                    }`}
                  >
                    {isLoading === item.id
                      ? "..."
                      : isAlreadyOwned
                      ? "Sudah Aktif"
                      : "Beli"}
                  </button>
                </div>
              </div>
              {!canAfford && !isAlreadyOwned && (
                <p className="text-xs text-hearts mt-2 text-right">
                  Koin kurang {item.price_coins - coins} 🪙
                </p>
              )}
            </div>
          );
        })}

        {items.length === 0 && (
          <div className="text-center py-12">
            <p className="text-4xl mb-3">🛒</p>
            <p className="text-muted">Belum ada item di shop</p>
          </div>
        )}
      </div>
    </div>
  );
}

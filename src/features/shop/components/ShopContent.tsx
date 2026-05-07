"use client";

import { useState, useTransition } from "react";
import { buyHeartRefill, buyStreakFreeze } from "@/features/shop/actions";
import { ShopItemCard } from "@/features/shop/components/ShopItemCard";
import { Finny } from "@/components/mascot/Finny";
import type { ShopItem } from "@/types/database";

interface ShopContentProps {
  items: ShopItem[];
  coins: number;
  hearts: number;
  maxHearts: number;
  streakFreezeActive?: boolean;
}

export function ShopContent({ items, coins, hearts, maxHearts, streakFreezeActive = false }: ShopContentProps) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const handleBuy = (item: ShopItem) => {
    setMessage(null);

    startTransition(async () => {
      if (item.type === "STREAK_FREEZE") {
        const result = await buyStreakFreeze();
        if (result.error) {
          setMessage({ text: result.error, type: "error" });
        } else {
          setMessage({ text: "Streak Freeze aktif! Streak kamu terlindungi. 🛡️", type: "success" });
        }
        return;
      }

      if (item.type === "HEART_REFILL") {
        if (hearts >= maxHearts) {
          setMessage({ text: "Hearts kamu sudah penuh! ❤️", type: "error" });
          return;
        }
        const result = await buyHeartRefill();
        if (result.error) {
          setMessage({ text: result.error, type: "error" });
        } else {
          setMessage({ text: "Hearts berhasil diisi ulang! ❤️", type: "success" });
        }
      }
    });
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-text">Shop</h1>
        <div className="hidden sm:block">
          <Finny pose="waving" size={64} />
        </div>
      </div>

      {/* Coin Balance Banner */}
      <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl p-6 mb-8 text-white flex items-center justify-between shadow-lg">
        <div>
          <p className="font-bold text-yellow-100 uppercase text-xs tracking-wider mb-2">Koin Kamu</p>
          <span className="text-4xl font-extrabold">{coins}</span>
        </div>
        <div className="opacity-80">
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none" className="text-white/20 -rotate-12">
            <circle cx="40" cy="40" r="30" fill="currentColor" />
            <text x="40" y="48" textAnchor="middle" fill="#F97316" fontSize="28" fontWeight="bold">$</text>
          </svg>
        </div>
      </div>

      {streakFreezeActive && (
        <div className="mb-4 p-4 rounded-xl bg-blue-50 border border-blue-100 text-sm text-blue-700 font-medium text-center">
          🛡️ Streak Freeze aktif! Streak kamu aman jika melewatkan 1 hari belajar.
        </div>
      )}

      {message && (
        <div className={`mb-4 p-4 rounded-xl text-sm font-medium text-center ${
          message.type === "success" ? "bg-success/10 text-success border border-success/20" : "bg-hearts/10 text-hearts border border-hearts/20"
        }`}>
          {message.text}
        </div>
      )}

      {/* Power-ups Section */}
      <h2 className="text-xl font-bold text-text mb-4">Power-ups</h2>

      <div className="space-y-4">
        {items.map((item) => (
          <ShopItemCard
            key={item.id}
            item={item}
            userCoins={coins}
            streakFreezeActive={streakFreezeActive}
            heartsFull={hearts >= maxHearts}
            onBuy={() => handleBuy(item)}
            isPending={isPending}
          />
        ))}

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

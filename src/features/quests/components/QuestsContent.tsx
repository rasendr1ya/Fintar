"use client";

import { useState } from "react";
import { claimQuestReward } from "@/features/quests/actions";

interface QuestData {
  quest_id: string;
  title: string;
  description: string | null;
  progress: number;
  target_value: number;
  is_completed: boolean;
  is_claimed: boolean;
  reward_xp: number;
  reward_coins: number;
  type: string;
}

interface QuestsContentProps {
  quests: QuestData[];
}

export function QuestsContent({ quests }: QuestsContentProps) {
  const [claimingId, setClaimingId] = useState<string | null>(null);
  const [claimedIds, setClaimedIds] = useState<Set<string>>(new Set());

  const handleClaim = async (questId: string) => {
    setClaimingId(questId);
    const result = await claimQuestReward(questId);
    if (result.success) {
      setClaimedIds((prev) => new Set(prev).add(questId));
    }
    setClaimingId(null);
  };

  const questIcons: Record<string, string> = {
    LOGIN: "🔔",
    XP: "⭐",
    LESSON: "📚",
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-text mb-2">Quest Harian 🔥</h1>
      <p className="text-muted text-sm mb-6">Selesaikan quest untuk dapatkan XP dan Coins!</p>

      <div className="space-y-3">
        {quests.map((quest) => {
          const progress = quest.is_completed ? quest.target_value : quest.progress;
          const progressPct = Math.min((progress / quest.target_value) * 100, 100);
          const isClaimed = quest.is_claimed || claimedIds.has(quest.quest_id);

          return (
            <div
              key={quest.quest_id}
              className={`bg-white rounded-2xl border-2 p-4 transition-all ${
                isClaimed
                  ? "border-success/30 opacity-60"
                  : quest.is_completed
                  ? "border-success/50 bg-success/5"
                  : "border-border/30"
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{questIcons[quest.type] || "🎯"}</span>
                <div className="flex-1">
                  <h3 className="font-bold text-text text-sm">{quest.title}</h3>
                  {quest.description && (
                    <p className="text-xs text-muted mt-0.5">{quest.description}</p>
                  )}
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-muted">
                        {progress}/{quest.target_value}
                      </span>
                      <span className="text-muted">{Math.round(progressPct)}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-300"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs text-primary font-medium">+{quest.reward_xp} XP</span>
                    <span className="text-xs text-coins font-medium">+{quest.reward_coins} 🪙</span>
                  </div>
                </div>
                {quest.is_completed && !isClaimed && (
                  <button
                    onClick={() => handleClaim(quest.quest_id)}
                    disabled={claimingId === quest.quest_id}
                    className="bg-success text-white text-xs font-bold px-3 py-1.5 rounded-xl border-b-2 border-emerald-600 hover:brightness-110 active:border-b-0 active:translate-y-0.5 transition-all disabled:opacity-50"
                  >
                    {claimingId === quest.quest_id ? "..." : "Klaim"}
                  </button>
                )}
                {isClaimed && (
                  <span className="text-xs text-success font-bold">✓ Klaimed</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {quests.length === 0 && (
        <div className="text-center py-12">
          <p className="text-4xl mb-3">🎯</p>
          <p className="text-muted">Belum ada quest hari ini</p>
        </div>
      )}
    </div>
  );
}
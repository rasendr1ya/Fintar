"use client";

import { useState } from "react";
import { claimQuestReward } from "@/features/quests/actions";
import { QuestList } from "./QuestList";

interface QuestData {
  user_quest_id: string;
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

  const handleClaim = async (userQuestId: string) => {
    setClaimingId(userQuestId);
    const result = await claimQuestReward(userQuestId);
    if (result.success) {
      setClaimedIds((prev) => new Set(prev).add(userQuestId));
    }
    setClaimingId(null);
  };

  return (
    <QuestList
      quests={quests}
      claimingId={claimingId}
      claimedIds={claimedIds}
      onClaim={handleClaim}
    />
  );
}

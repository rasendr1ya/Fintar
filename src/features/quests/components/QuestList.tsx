import { BoltIcon } from "@heroicons/react/24/solid";
import { QuestCard } from "./QuestCard";

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

interface QuestListProps {
  quests: QuestData[];
  claimingId: string | null;
  claimedIds: Set<string>;
  onClaim: (userQuestId: string) => void;
}

export function QuestList({ quests, claimingId, claimedIds, onClaim }: QuestListProps) {
  if (quests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="text-5xl mb-3">🎯</div>
        <p className="text-gray-600 font-medium">Quest hari ini belum tersedia</p>
        <p className="text-sm text-gray-400 mt-1">Coba refresh halaman ini</p>
      </div>
    );
  }

  const isQuestClaimed = (q: QuestData) => q.is_claimed || claimedIds.has(q.user_quest_id);

  const activeQuests = quests.filter((q) => !isQuestClaimed(q));
  const claimedQuests = quests.filter((q) => isQuestClaimed(q));

  const sortByClaimable = (a: QuestData, b: QuestData) => {
    if (a.is_completed && !b.is_completed) return -1;
    if (!a.is_completed && b.is_completed) return 1;
    return 0;
  };

  return (
    <div>
      {/* Banner Motivasi + Countdown */}
      <div className="relative overflow-hidden rounded-2xl bg-orange-500 p-5 text-white mb-4">
        <div className="relative z-10">
          <p className="font-bold text-lg">Raih Reward Hari Ini!</p>
          <p className="text-sm text-white/80 mt-0.5">
            Selesaikan quest untuk dapat XP dan Coins bonus.
          </p>
        </div>
        <BoltIcon className="absolute -right-4 -bottom-4 w-24 h-24 text-white/20 rotate-12" />
      </div>

      {/* Active Quests */}
      <div className="space-y-3">
        {[...activeQuests].sort(sortByClaimable).map((quest) => (
          <QuestCard
            key={quest.user_quest_id}
            userQuestId={quest.user_quest_id}
            title={quest.title}
            description={quest.description}
            type={quest.type as "LOGIN" | "XP" | "LESSON"}
            progress={quest.progress}
            targetValue={quest.target_value}
            isCompleted={quest.is_completed}
            isClaimed={isQuestClaimed(quest)}
            rewardXp={quest.reward_xp}
            rewardCoins={quest.reward_coins}
            onClaim={onClaim}
            claiming={claimingId === quest.user_quest_id}
          />
        ))}
      </div>

      {/* Divider & Claimed Section */}
      {claimedQuests.length > 0 && (
        <>
          <div className="flex items-center gap-2 my-4">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400">Sudah Selesai</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <div className="space-y-3">
            {claimedQuests.map((quest) => (
              <QuestCard
                key={quest.user_quest_id}
                userQuestId={quest.user_quest_id}
                title={quest.title}
                description={quest.description}
                type={quest.type as "LOGIN" | "XP" | "LESSON"}
                progress={quest.progress}
                targetValue={quest.target_value}
                isCompleted={quest.is_completed}
                isClaimed={true}
                rewardXp={quest.reward_xp}
                rewardCoins={quest.reward_coins}
                onClaim={onClaim}
                claiming={false}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default QuestList;

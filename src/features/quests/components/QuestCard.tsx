"use client";

import { BoltIcon, CheckCircleIcon } from "@heroicons/react/24/solid";

interface QuestCardProps {
  userQuestId: string;
  title: string;
  description: string | null;
  type: "LOGIN" | "XP" | "LESSON";
  progress: number;
  targetValue: number;
  isCompleted: boolean;
  isClaimed: boolean;
  rewardXp: number;
  rewardCoins: number;
  onClaim: (userQuestId: string) => void;
  claiming: boolean;
}

export function QuestCard({
  userQuestId,
  title,
  description: _description,
  type: _type,
  progress,
  targetValue,
  isCompleted,
  isClaimed,
  rewardXp,
  rewardCoins: _rewardCoins,
  onClaim,
  claiming,
}: QuestCardProps) {
  const displayProgress = isCompleted || isClaimed ? targetValue : Math.min(progress, targetValue);
  const progressPct = Math.min((displayProgress / targetValue) * 100, 100);

  return (
    <div
      className={`flex items-center gap-4 px-4 py-3 rounded-2xl border-2 transition-all ${
        isClaimed
          ? "bg-gray-50 border-gray-100 opacity-60"
          : isCompleted
          ? "bg-emerald-50 border-emerald-200"
          : "bg-white border-gray-200 hover:border-primary/40"
      }`}
    >
      {/* Icon Square */}
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
          isCompleted || isClaimed
            ? "bg-emerald-500"
            : "bg-orange-100"
        }`}
      >
        {isCompleted || isClaimed ? (
          <CheckCircleIcon className="w-7 h-7 text-white" />
        ) : (
          <BoltIcon className="w-7 h-7 text-orange-500" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p
            className={`text-sm font-semibold truncate ${
              isClaimed ? "text-gray-400" : "text-gray-800"
            }`}
          >
            {title}
          </p>
          {!(isCompleted && !isClaimed) && (
            <p
              className={`text-sm font-bold shrink-0 ${
                isClaimed ? "text-gray-400" : "text-orange-500"
              }`}
            >
              +{rewardXp} XP
            </p>
          )}
        </div>

        {(isCompleted || isClaimed) && (
          <p className="text-xs font-semibold text-emerald-600 mt-0.5 tracking-wide">
            Completed
          </p>
        )}

        <div className="w-full bg-gray-100 rounded-full h-2.5 mt-2">
          <div
            className={`h-2.5 rounded-full transition-all duration-500 ${
              isClaimed
                ? "bg-emerald-300"
                : isCompleted
                ? "bg-emerald-400"
                : "bg-orange-500"
            }`}
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Right side: HANYA Klaim button */}
      {isCompleted && !isClaimed && (
        <button
          onClick={() => onClaim(userQuestId)}
          disabled={claiming}
          className="shrink-0 text-xs font-semibold px-3 py-1.5 rounded-xl bg-emerald-500 text-white border-b-2 border-emerald-700 active:translate-y-0.5 transition-transform disabled:opacity-50"
        >
          {claiming ? "..." : `Klaim +${rewardXp} XP`}
        </button>
      )}
    </div>
  );
}

export default QuestCard;

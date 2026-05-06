import Link from "next/link";
import { BoltIcon } from "@heroicons/react/24/solid";
import { getDailyQuests } from "@/features/quests/actions";

interface QuestWidgetData {
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

export async function QuestSidebarWidget() {
  const { quests } = await getDailyQuests();
  const typedQuests = (quests || []) as QuestWidgetData[];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <p className="font-bold text-gray-800 text-sm">Daily Quests</p>
        <Link
          href="/quests"
          className="text-xs font-semibold text-purple-600 hover:text-purple-700"
        >
          VIEW ALL
        </Link>
      </div>

      {typedQuests.length === 0 ? (
        <p className="text-xs text-gray-400 text-center py-2">Tidak ada quest hari ini</p>
      ) : (
        <div className="space-y-3">
          {typedQuests.slice(0, 3).map((quest) => {
            const progressPct = Math.min(
              (quest.progress / quest.target_value) * 100,
              100
            );

            return (
              <div key={quest.user_quest_id} className="flex items-center gap-3">
                {/* Icon Square */}
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    quest.is_completed ? "bg-emerald-100" : "bg-amber-100"
                  }`}
                >
                  <BoltIcon
                    className={`w-4 h-4 ${
                      quest.is_completed ? "text-emerald-500" : "text-amber-500"
                    }`}
                  />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-gray-700 truncate">
                      {quest.title}
                    </p>
                    <p className="text-xs text-gray-400 ml-2 shrink-0">
                      {quest.progress}/{quest.target_value}
                    </p>
                  </div>
                  {/* Progress Bar */}
                  <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1">
                    <div
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        quest.is_completed ? "bg-emerald-400" : "bg-amber-400"
                      }`}
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default QuestSidebarWidget;

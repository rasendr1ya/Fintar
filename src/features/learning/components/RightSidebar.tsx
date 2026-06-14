import Link from "next/link";
import { BoltIcon } from "@heroicons/react/24/solid";
import { getDailyQuests } from "@/features/quests/actions";
import { MiniLeaderboard } from "@/features/leaderboard/components/MiniLeaderboard";

interface QuestWithDetails {
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

export async function RightSidebar() {
  const { quests: questsData } = await getDailyQuests();
  const typedQuests = questsData as QuestWithDetails[];
  const activeQuest = typedQuests.find(q => !q.is_completed) || typedQuests[0];

  return (
    <div className="hidden lg:block w-80 space-y-6 sticky top-6 self-start">
      
      {/* Daily Quest / Progress */}
      <div className="bg-white rounded-2xl border-2 border-gray-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-700">Daily Quests</h3>
          <Link href="/quests" className="text-primary text-sm font-bold uppercase hover:text-primary-dark">
            View All
          </Link>
        </div>
        
        {activeQuest ? (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-500">
                <BoltIcon className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-bold text-gray-700">{activeQuest.title}</span>
                  <span className="text-gray-500">{activeQuest.progress}/{activeQuest.target_value}</span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-orange-400 rounded-full transition-all"
                    style={{ width: `${Math.min((activeQuest.progress / activeQuest.target_value) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted">No quests available today.</p>
        )}
      </div>

      {/* Mini Leaderboard */}
      <MiniLeaderboard />

      {/* Finny Ad / Tip */}
      <div className="bg-white rounded-2xl border-2 border-gray-200 p-5 relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="font-bold text-gray-700 mb-2">Finny&apos;s Tip</h3>
          <p className="text-sm text-gray-600 leading-relaxed mb-4">
            &quot;Jangan lupa catat pengeluaran kecil. Kopi 20rb sehari = 600rb sebulan lho!&quot;
          </p>
          <Link href="/blog" className="text-primary font-bold text-sm uppercase hover:underline">
            Explore More
          </Link>
        </div>
      </div>
    </div>
  );
}
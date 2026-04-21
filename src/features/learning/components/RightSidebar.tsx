import Link from "next/link";
import { FireIcon, TrophyIcon, BoltIcon } from "@heroicons/react/24/solid";
import { getDailyQuests } from "@/features/quests/actions";

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

      {/* League Widget */}
      <div className="bg-white rounded-2xl border-2 border-gray-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-700">Leaderboard</h3>
          <Link href="/leaderboard" className="text-primary text-sm font-bold uppercase hover:text-primary-dark">
            View League
          </Link>
        </div>
        
        <div className="flex items-center gap-4 mb-4">
          <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
            <TrophyIcon className="w-5 h-5 text-yellow-600" />
          </div>
          <div>
            <p className="font-bold text-gray-800">Silver League</p>
            <p className="text-sm text-gray-500">Top 10 advance</p>
          </div>
        </div>
        
        <div className="border-t border-gray-100 pt-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">
              Y
            </div>
            <span className="font-bold text-sm text-gray-700 flex-1">You</span>
            <span className="text-sm font-medium text-gray-500">#5</span>
          </div>
        </div>
      </div>

      {/* Finny Ad / Tip */}
      <div className="bg-white rounded-2xl border-2 border-gray-200 p-5 relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="font-bold text-gray-700 mb-2">Finny's Tip</h3>
          <p className="text-sm text-gray-600 leading-relaxed mb-4">
            "Jangan lupa catat pengeluaran kecil. Kopi 20rb sehari = 600rb sebulan lho!"
          </p>
          <Link href="/blog" className="text-primary font-bold text-sm uppercase hover:underline">
            Learn More
          </Link>
        </div>
      </div>
    </div>
  );
}
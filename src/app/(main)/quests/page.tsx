import { getDailyQuests } from "@/features/quests/actions";
import { QuestsContent } from "@/features/quests/components/QuestsContent";

export default async function QuestsPage() {
  const { quests, error } = await getDailyQuests();

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Daily Quests</h1>

      <QuestsContent quests={(quests ?? []) as any[]} />

      {error && (
        <p className="text-center text-sm text-red-500 mt-4">{error}</p>
      )}
    </div>
  );
}

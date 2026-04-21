import { getDailyQuests } from "@/features/quests/actions";
import { QuestsContent } from "@/features/quests/components/QuestsContent";

export default async function QuestsPage() {
  const { quests } = await getDailyQuests();

  return <QuestsContent quests={quests || []} />;
}
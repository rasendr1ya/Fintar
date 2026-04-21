import { QuestsSkeleton } from "@/components/ui/skeleton";

export default function QuestsLoading() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <QuestsSkeleton />
    </div>
  );
}
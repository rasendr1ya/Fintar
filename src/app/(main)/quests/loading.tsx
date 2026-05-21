import { QuestsSkeleton } from "@/components/ui/skeleton";

export default function QuestsLoading() {
  return (
    <div className="max-w-[600px] mx-auto px-4 py-6">
      <QuestsSkeleton />
    </div>
  );
}
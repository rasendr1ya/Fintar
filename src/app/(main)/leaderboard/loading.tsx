import { LeaderboardSkeleton } from "@/components/ui/skeleton";

export default function LeaderboardLoading() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="mb-6">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-2" />
        <div className="h-4 w-32 bg-gray-100 rounded animate-pulse" />
      </div>
      <LeaderboardSkeleton />
    </div>
  );
}
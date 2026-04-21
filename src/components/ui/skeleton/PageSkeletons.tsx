import { Skeleton } from "@/components/ui/skeleton";

// Learning Path Skeleton
export function LearningPathSkeleton() {
  return (
    <div className="w-full max-w-[600px] space-y-8">
      {/* Unit skeletons */}
      {[1, 2, 3].map((i) => (
        <div key={i} className="space-y-4">
          {/* Unit header */}
          <div className="bg-gray-100 rounded-2xl p-4">
            <Skeleton className="h-6 w-48 mb-2" />
            <Skeleton className="h-4 w-32" />
          </div>
          
          {/* Lessons */}
          <div className="flex flex-col items-center gap-4 py-4">
            {[1, 2, 3].map((j) => (
              <Skeleton 
                key={j} 
                className="h-16 w-16 rounded-full" 
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// Right Sidebar Skeleton
export function RightSidebarSkeleton() {
  return (
    <div className="hidden lg:block w-[300px] space-y-6">
      {/* Stats card */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 space-y-4">
        <Skeleton className="h-5 w-24" />
        <div className="flex justify-between">
          <Skeleton className="h-12 w-16" />
          <Skeleton className="h-12 w-16" />
          <Skeleton className="h-12 w-16" />
        </div>
      </div>

      {/* Streak card */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 space-y-3">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-8 w-full" />
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <Skeleton key={i} className="h-8 w-8 rounded" />
          ))}
        </div>
      </div>

      {/* Quests preview */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 space-y-3">
        <Skeleton className="h-5 w-28" />
        {[1, 2].map((i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-2 w-full rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Leaderboard Skeleton
export function LeaderboardSkeleton() {
  return (
    <div className="space-y-4">
      {/* Top 3 */}
      <div className="flex justify-center items-end gap-4 py-6">
        <Skeleton className="h-28 w-20 rounded-xl" />
        <Skeleton className="h-36 w-24 rounded-xl" />
        <Skeleton className="h-24 w-20 rounded-xl" />
      </div>

      {/* List */}
      <div className="space-y-3">
        {[4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="flex items-center gap-4 p-3 bg-white rounded-xl">
            <Skeleton className="h-6 w-6" />
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-4 w-32 flex-1" />
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
      </div>
    </div>
  );
}

// Quests Page Skeleton
export function QuestsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="h-6 w-40" />
      </div>

      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white rounded-2xl p-4 space-y-3">
          <div className="flex items-center gap-3">
            <Skeleton className="h-12 w-12 rounded-xl" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-3 w-32" />
            </div>
            <Skeleton className="h-8 w-20 rounded-lg" />
          </div>
          <Skeleton className="h-3 w-full rounded-full" />
        </div>
      ))}
    </div>
  );
}

// Shop Skeleton
export function ShopSkeleton() {
  return (
    <div className="space-y-6">
      {/* Balance */}
      <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl p-4">
        <Skeleton className="h-4 w-20 bg-white/30 mb-2" />
        <Skeleton className="h-8 w-32 bg-white/30" />
      </div>

      {/* Items grid */}
      <div className="grid grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-2xl p-4 space-y-3">
            <Skeleton className="h-16 w-16 rounded-xl mx-auto" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-3 w-20 mx-auto" />
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  );
}

// Profile Skeleton
export function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Skeleton className="h-20 w-20 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-2xl p-4 text-center space-y-2">
            <Skeleton className="h-8 w-12 mx-auto" />
            <Skeleton className="h-3 w-16 mx-auto" />
          </div>
        ))}
      </div>

      {/* Achievements */}
      <div className="space-y-3">
        <Skeleton className="h-5 w-28" />
        <div className="flex gap-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-14 w-14 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}

// Lesson Content Skeleton
export function LessonSkeleton() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="flex items-center gap-4 p-4 border-b">
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-3 flex-1 rounded-full" />
        <Skeleton className="h-6 w-12" />
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto p-6 space-y-8">
        {/* Question */}
        <div className="text-center space-y-4">
          <Skeleton className="h-6 w-3/4 mx-auto" />
          <Skeleton className="h-4 w-1/2 mx-auto" />
        </div>

        {/* Options */}
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-14 w-full rounded-xl" />
          ))}
        </div>

        {/* Button */}
        <Skeleton className="h-14 w-full rounded-2xl" />
      </div>
    </div>
  );
}
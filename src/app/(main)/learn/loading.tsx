import { LearningPathSkeleton, RightSidebarSkeleton } from "@/components/ui/skeleton";

export default function LearnLoading() {
  return (
    <div className="flex justify-center gap-8 px-4 py-6 md:px-8">
      {/* Main Content */}
      <div className="w-full max-w-[600px] flex flex-col">
        <LearningPathSkeleton />
      </div>

      {/* Right Sidebar */}
      <RightSidebarSkeleton />
    </div>
  );
}
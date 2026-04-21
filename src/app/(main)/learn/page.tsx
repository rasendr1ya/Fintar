import { getCurrentUser } from "@/lib/supabase/server";
import { getUnitsWithLessons, getUserProgress } from "@/features/learning/actions";
import { LearningPath } from "@/features/learning/components/LearningPath";
import { RightSidebar } from "@/features/learning/components/RightSidebar";

export const metadata = {
  title: "Learn - Fintar",
  description: "Mulai perjalanan belajar keuanganmu",
};

export default async function LearnPage() {
  const user = await getCurrentUser();

  const { units } = await getUnitsWithLessons();
  const progress = user ? await getUserProgress(user.id) : [];

  return (
    <div className="flex justify-center gap-8 px-4 py-6 md:px-8">
      <div className="w-full max-w-[600px] flex flex-col">
        <LearningPath units={units} userProgress={progress} />
      </div>

      <RightSidebar />
    </div>
  );
}

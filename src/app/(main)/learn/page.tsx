import { getUnitsWithLessons } from "@/features/learning/actions/lessons";
import { LearningPath } from "@/features/learning/components/LearningPath";
import { RightSidebar } from "@/features/learning/components/RightSidebar";

export const metadata = {
  title: "Learn - Fintar",
  description: "Mulai perjalanan belajar keuanganmu",
};

export default async function LearnPage() {
  const { units, completedLessonIds, error } = await getUnitsWithLessons();

  // Konversi array ke Set untuk O(1) lookup di komponen
  const completedSet = new Set(completedLessonIds);

  return (
    <div className="flex justify-center gap-8 px-4 py-6 md:px-8">
      <div className="w-full max-w-[600px] flex flex-col">
        {error ? (
          <div className="text-center py-12">
            <p className="text-gray-500">
              Gagal memuat materi. Coba refresh halaman.
            </p>
          </div>
        ) : units.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">
              Belum ada materi tersedia.
            </p>
          </div>
        ) : (
          <LearningPath
            units={units}
            completedLessonIds={completedSet}
          />
        )}
      </div>

      <RightSidebar />
    </div>
  );
}

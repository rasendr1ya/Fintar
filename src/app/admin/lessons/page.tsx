import { getAllUnitsAdmin } from "@/features/admin/actions";
import { Finny } from "@/components/mascot/Finny";
import { LessonsPageClient } from "./LessonsPageClient";

export const metadata = {
  title: "Lesson CMS — Admin Fintar",
};

export default async function AdminLessonsPage() {
  const result = await getAllUnitsAdmin();

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <div className="shrink-0">
          <Finny pose="teaching" size={56} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-text">Lesson CMS</h1>
          <p className="text-muted">Kelola unit, lesson, dan challenge pembelajaran</p>
        </div>
      </div>

      {result.error ? (
        <div className="bg-white rounded-2xl border border-border p-12 text-center">
          <p className="text-hearts">{result.error}</p>
        </div>
      ) : (
        <LessonsPageClient units={result.data || []} />
      )}
    </div>
  );
}

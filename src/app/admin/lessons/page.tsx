import { getAllUnitsAdmin } from "@/features/admin/actions";
import { AdminHeader } from "@/features/admin/components";
import { LessonsPageClient } from "./LessonsPageClient";

export const metadata = {
  title: "Lesson CMS — Admin Fintar",
};

export default async function AdminLessonsPage() {
  const result = await getAllUnitsAdmin();

  return (
    <div>
      <AdminHeader
        title="Lesson CMS"
        description="Kelola unit, lesson, dan challenge pembelajaran"
      />

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

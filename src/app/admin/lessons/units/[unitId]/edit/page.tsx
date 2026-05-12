import { getUnitById } from "@/features/admin/actions";
import { AdminHeader } from "@/features/admin/components";
import { UnitForm } from "@/features/admin/components/UnitForm";
import Link from "next/link";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Edit Unit — Admin Fintar",
};

export default async function EditUnitPage({
  params,
}: {
  params: Promise<{ unitId: string }>;
}) {
  const { unitId } = await params;
  const result = await getUnitById(unitId);

  if ("error" in result || !result.data) {
    notFound();
  }

  return (
    <div>
      <div className="mb-8">
        <Link href="/admin/lessons" className="text-sm text-primary hover:underline mb-2 inline-block">
          &larr; Kembali ke Lesson CMS
        </Link>
        <AdminHeader
          title="Edit Unit"
          description={result.data.title}
        />
      </div>

      <div className="bg-white rounded-2xl border border-border p-6">
        <UnitForm unit={result.data} />
      </div>
    </div>
  );
}

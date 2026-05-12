import { AdminHeader } from "@/features/admin/components";
import { UnitForm } from "@/features/admin/components/UnitForm";
import Link from "next/link";

export const metadata = {
  title: "Tambah Unit — Admin Fintar",
};

export default function NewUnitPage() {
  return (
    <div>
      <div className="mb-8">
        <Link href="/admin/lessons" className="text-sm text-primary hover:underline mb-2 inline-block">
          &larr; Kembali ke Lesson CMS
        </Link>
        <AdminHeader
          title="Tambah Unit Baru"
          description="Buat unit pembelajaran untuk mengelompokkan lesson"
        />
      </div>

      <div className="bg-white rounded-2xl border border-border p-6">
        <UnitForm />
      </div>
    </div>
  );
}

import { AdminHeader } from "@/features/admin/components";
import { ArticleForm } from "@/features/admin/components/ArticleForm";
import Link from "next/link";

export const metadata = {
  title: "Artikel Baru — Admin Fintar",
};

export default function NewArticlePage() {
  return (
    <div>
      <div className="mb-8">
        <Link href="/admin/blog" className="text-sm text-primary hover:underline mb-2 inline-block">
          &larr; Kembali ke Blog CMS
        </Link>
        <AdminHeader
          title="Artikel Baru"
          description="Buat artikel edukasi untuk Fintar Journal"
        />
      </div>

      <ArticleForm />
    </div>
  );
}

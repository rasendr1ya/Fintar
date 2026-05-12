import { getArticleByIdAdmin } from "@/features/admin/actions";
import { AdminHeader } from "@/features/admin/components";
import { ArticleForm } from "@/features/admin/components/ArticleForm";
import Link from "next/link";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Edit Artikel — Admin Fintar",
};

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getArticleByIdAdmin(id);

  if ("error" in result || !result.data) {
    notFound();
  }

  return (
    <div>
      <div className="mb-8">
        <Link href="/admin/blog" className="text-sm text-primary hover:underline mb-2 inline-block">
          &larr; Kembali ke Blog CMS
        </Link>
        <AdminHeader
          title="Edit Artikel"
          description={result.data.title}
        />
      </div>

      <ArticleForm article={result.data} />
    </div>
  );
}

import { getArticlesAdmin } from "@/features/admin/actions";
import { AdminHeader } from "@/features/admin/components";
import { ArticleList } from "@/features/admin/components/ArticleList";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { PlusIcon } from "@heroicons/react/24/outline";

export const metadata = {
  title: "Blog CMS — Admin Fintar",
};

export default async function AdminBlogPage() {
  const result = await getArticlesAdmin();

  return (
    <div>
      <AdminHeader
        title="Blog CMS"
        description="Kelola artikel dan konten blog"
      >
        <Link href="/admin/blog/new">
          <Button variant="success" size="sm">
            <PlusIcon className="w-5 h-5" />
            Artikel Baru
          </Button>
        </Link>
      </AdminHeader>

      {result.error ? (
        <div className="bg-white rounded-2xl border border-border p-12 text-center">
          <p className="text-hearts">{result.error}</p>
        </div>
      ) : (
        <ArticleList articles={result.data || []} />
      )}
    </div>
  );
}

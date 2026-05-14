import { getArticlesAdmin } from "@/features/admin/actions";
import { ArticleList } from "@/features/admin/components/ArticleList";
import { Finny } from "@/components/mascot/Finny";
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
      <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="shrink-0">
            <Finny pose="writing" size={56} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-text">Blog CMS</h1>
            <p className="text-muted">Kelola artikel dan konten blog</p>
          </div>
        </div>
        <Link href="/admin/blog/new">
          <Button variant="success" size="sm">
            <PlusIcon className="w-5 h-5" />
            Artikel Baru
          </Button>
        </Link>
      </div>

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

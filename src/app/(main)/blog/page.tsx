import { getArticles, getFeaturedArticle } from "@/features/blog/actions";
import { FeaturedPost, ArticleCard } from "@/features/blog/components";

export const metadata = {
  title: "Journal - Fintar",
  description: "Artikel dan panduan keuangan untuk mahasiswa.",
};

export default async function BlogPage() {
  const [articles, featured] = await Promise.all([
    getArticles(),
    getFeaturedArticle(),
  ]);

  const regularArticles = featured
    ? articles.filter((a) => a.id !== featured.id)
    : articles;

  const hasArticles = articles.length > 0;

  return (
    <div className="pb-4">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-text mb-2">Journal 📖</h1>
          <p className="text-muted text-sm">Panduan keuangan yang relevan buat kamu.</p>
        </div>

        {!hasArticles && (
          <div className="text-center py-16 bg-white rounded-2xl border-2 border-border/30">
            <p className="text-4xl mb-3">📝</p>
            <h2 className="text-xl font-bold text-text mb-2">Belum Ada Artikel</h2>
            <p className="text-muted text-sm">
              Tim penulis sedang menyiapkan konten terbaik buat kamu. Cek lagi nanti ya!
            </p>
          </div>
        )}

        {featured && (
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs font-bold text-muted uppercase tracking-wider">Highlight</span>
              <div className="h-px flex-1 bg-border" />
            </div>
            <FeaturedPost article={featured} />
          </section>
        )}

        {regularArticles.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-text mb-4">Artikel Terbaru</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {regularArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

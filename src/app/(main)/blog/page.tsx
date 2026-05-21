import { getArticles, getFeaturedArticle } from "@/features/blog/actions";
import { FeaturedPost, ArticleCard } from "@/features/blog/components";
import { Finny } from "@/components/mascot/Finny";
import { StarIcon, DocumentTextIcon, SparklesIcon } from "@heroicons/react/24/outline";

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
    <div className="min-h-screen pb-8">
      {/* Header Section — inspired by prototype */}
      <div className="bg-white border-b border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />

        <div className="max-w-6xl mx-auto px-6 md:px-12 py-12 md:py-16 flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-bold mb-5">
              <SparklesIcon className="w-4 h-4" />
              <span>Financial Wisdom</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-text mb-4 tracking-tight leading-tight">
              Fintar{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">
                Journal
              </span>
              .
            </h1>
            <p className="text-base md:text-lg text-muted leading-relaxed max-w-lg">
              Kumpulan artikel seputar keuangan yang bisa kamu baca kapan aja. Topiknya bermacam-macam, dari budgeting sampai investasi.
            </p>
          </div>
          <div className="hidden md:block transform hover:scale-105 transition-transform duration-500 shrink-0">
            <Finny pose="reading" size={200} />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 md:px-12 py-10 space-y-12">
        {!hasArticles && (
          <div className="text-center py-16 bg-white rounded-3xl border-2 border-border/30">
            <DocumentTextIcon className="w-16 h-16 text-muted mx-auto mb-3" />
            <h2 className="text-xl font-bold text-text mb-2">Belum Ada Artikel</h2>
            <p className="text-muted text-sm">
              Tim penulis sedang menyiapkan konten terbaik buat kamu. Cek lagi nanti ya!
            </p>
          </div>
        )}

        {featured && (
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px flex-1 bg-border" />
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                <StarIcon className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs font-bold text-primary uppercase tracking-wider">Featured</span>
              </div>
              <div className="h-px flex-1 bg-border" />
            </div>
            <FeaturedPost article={featured} />
          </section>
        )}

        {regularArticles.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-text mb-6">Artikel Terbaru</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
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

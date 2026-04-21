import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getArticleBySlug } from "@/features/blog/actions";
import { ArticleContent } from "@/features/blog/components";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export const dynamic = "force-dynamic";

interface BlogPostProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogPostPage({ params }: BlogPostProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  return (
    <article className="min-h-screen bg-white pb-24">
      <div className="relative h-[50vh] min-h-[300px] w-full bg-gray-900 overflow-hidden">
        {article.cover_image && (
          <Image
            src={article.cover_image}
            alt={article.title}
            fill
            className="object-cover opacity-60"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-black/40" />

        <div className="absolute top-4 left-0 right-0 z-30 px-4">
          <div className="max-w-3xl mx-auto">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 bg-black/20 hover:bg-black/40 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-medium transition-all border border-white/20"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              Kembali
            </Link>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-20 px-4 pb-16 md:pb-20">
          <div className="max-w-3xl mx-auto">
            {article.category && (
              <span className="inline-block bg-primary px-3 py-1 rounded-full text-white text-xs font-bold uppercase tracking-wider mb-4">
                {article.category}
              </span>
            )}
            <h1 className="text-3xl md:text-5xl font-black text-text leading-tight mb-4">
              {article.title}
            </h1>
            <div className="flex items-center gap-4 text-sm text-muted">
              <span>{article.author || "Tim Fintar"}</span>
              <span>•</span>
              <span>{article.read_time_minutes} menit baca</span>
            </div>
          </div>
        </div>
      </div>

      <div className="h-16 md:h-24" />

      <div className="max-w-3xl mx-auto px-4">
        <ArticleContent
          content={article.content || ""}
          className="prose prose-slate max-w-none"
        />

        {article.tags && article.tags.length > 0 && (
          <div className="mt-12 pt-8 border-t border-border">
            <h4 className="text-sm font-bold text-muted uppercase tracking-wider mb-3">Topik Terkait</h4>
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <span key={tag} className="px-3 py-1.5 bg-gray-100 rounded-lg text-sm text-muted font-medium">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}

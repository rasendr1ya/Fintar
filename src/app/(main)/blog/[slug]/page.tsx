import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { getArticleBySlug } from "@/features/blog/actions";
import { ArticlePdfTabs } from "@/features/blog/components";
import { Finny } from "@/components/mascot/Finny";
import { ArrowLeftIcon, CalendarDaysIcon, ClockIcon } from "@heroicons/react/24/outline";
import { getPublisherDisplay } from "@/features/blog/utils";

function getSyllabusPdfUrl(tags: string[] | null): string | undefined {
  const syllabusTag = tags?.find((tag) => tag.startsWith("silabus-"));
  if (!syllabusTag) return undefined;
  const number = syllabusTag.replace("silabus-", "");
  if (!number || Number.isNaN(Number(number))) return undefined;
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  if (!base) return undefined;
  return `${base}/storage/v1/object/public/syllabus/silabus-${number}.pdf`;
}

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
      <div className="relative h-[50vh] min-h-[400px] w-full bg-gray-900 overflow-hidden">
        {article.cover_image && (
          <Image
            src={article.cover_image}
            alt={article.title}
            fill
            unoptimized
            className="object-cover opacity-60"
          />
        )}
        {/* Overlay gelap atas untuk judul putih */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-transparent z-10" />
        {/* Gradient bawah transisi ke background putih */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-white to-transparent z-10" />

        <div className="absolute top-4 left-6 z-30">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 bg-black/20 hover:bg-black/40 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-medium transition-all border border-white/20"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Kembali
          </Link>
        </div>

        <div className="absolute bottom-28 md:bottom-32 left-0 right-0 z-20 px-4 pb-4">
          <div className="max-w-3xl mx-auto">
            {article.category && (
              <span className="inline-block bg-primary px-3 py-1 rounded-full text-white text-xs font-bold uppercase tracking-wider mb-4">
                {article.category}
              </span>
            )}
            <h1 className="text-3xl md:text-5xl font-black text-white leading-tight mb-4">
              {article.title}
            </h1>

          </div>
        </div>
      </div>

      {(() => {
        const display = getPublisherDisplay(article.publisher, article.author);
        const publishDate = format(new Date(article.created_at), "d MMM yyyy", { locale: id });

        return (
          <div className="max-w-2xl mx-auto px-4 -mt-12 md:-mt-16 relative z-30">
            <div className="flex items-center bg-white rounded-2xl shadow-sm border border-gray-100 py-3 px-4 md:px-6 overflow-hidden">
              <div className="flex items-center gap-3 flex-1 justify-center min-w-0">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white shadow-sm shrink-0">
                  <Finny pose="default" size={40} />
                </div>
                <div className="text-left min-w-0">
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Penulis</p>
                  <p className="text-sm font-bold text-gray-900 truncate">{display.label}</p>
                </div>
              </div>

              <div className="w-px h-12 bg-gray-200 flex-shrink-0 mx-2 md:mx-3" />

              <div className="flex items-center gap-3 flex-1 justify-center min-w-0">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                  <CalendarDaysIcon className="w-5 h-5 text-blue-500" />
                </div>
                <div className="text-left min-w-0">
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Tanggal</p>
                  <p className="text-sm font-bold text-gray-900">{publishDate}</p>
                </div>
              </div>

              <div className="w-px h-12 bg-gray-200 flex-shrink-0 mx-2 md:mx-3" />

              <div className="flex items-center gap-3 flex-1 justify-center min-w-0">
                <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
                  <ClockIcon className="w-5 h-5 text-orange-400" />
                </div>
                <div className="text-left min-w-0">
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Waktu Baca</p>
                  <p className="text-sm font-bold text-gray-900">{article.read_time_minutes} Menit</p>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      <div className="max-w-3xl mx-auto px-4 mt-8 md:mt-10">
        <ArticlePdfTabs
          content={article.content || ""}
          pdfUrl={getSyllabusPdfUrl(article.tags)}
          isSyllabus={article.category === "Silabus"}
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

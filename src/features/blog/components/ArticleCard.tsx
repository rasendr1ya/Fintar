"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { ArrowRightIcon, ClockIcon } from "@heroicons/react/24/outline";
import type { ArticleWithPublisher } from "@/types/database";

interface ArticleCardProps {
  article: ArticleWithPublisher;
}

const PLACEHOLDER_IMAGE = "/placeholder-blog.svg";

function getImageUrl(url: string | null | undefined): string {
  if (!url || !url.trim()) return PLACEHOLDER_IMAGE;
  return url.trim();
}

export function ArticleCard({ article }: ArticleCardProps) {
  const [imgSrc, setImgSrc] = useState(getImageUrl(article.cover_image));

  return (
    <article className="group flex flex-col h-full bg-white rounded-2xl border-2 border-border/30 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
      <div className="aspect-[16/9] w-full overflow-hidden relative">
        <Image
          src={imgSrc}
          alt={article.title}
          fill
          unoptimized
          onError={() => setImgSrc(PLACEHOLDER_IMAGE)}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {article.category && (
          <div className="absolute top-3 left-3">
            <span className="bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full text-primary border border-primary/10 max-w-[calc(100%-1rem)] truncate">
              {article.category}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1 p-4">
        <div className="flex items-center gap-1.5 sm:gap-2 text-xs text-muted mb-1.5 min-w-0 flex-wrap">
          <span className="truncate">{format(new Date(article.created_at), "d MMM yyyy", { locale: id })}</span>
          <span className="opacity-60 shrink-0">•</span>
          <span className="inline-flex items-center gap-1 min-w-0 truncate">
            <ClockIcon className="w-3 h-3 shrink-0" />
            {article.read_time_minutes} menit baca
          </span>
        </div>

        <h3 className="text-base font-bold text-text mb-1.5 line-clamp-2 leading-snug group-hover:text-primary transition-colors">
          <Link href={`/blog/${article.slug}`}>
            {article.title}
          </Link>
        </h3>

        {article.summary && (
          <p className="text-xs text-muted mb-3 line-clamp-2 leading-relaxed flex-1">
            {article.summary}
          </p>
        )}

        <Link
          href={`/blog/${article.slug}`}
          className="group/btn inline-flex items-center gap-1 text-xs font-bold text-primary hover:text-primary-dark transition-colors mt-auto"
        >
          Baca Selengkapnya
          <ArrowRightIcon className="w-3.5 h-3.5 transition-transform duration-200 group-hover/btn:translate-x-1" />
        </Link>
      </div>
    </article>
  );
}

"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Article } from "@/types/database";

interface ArticleCardProps {
  article: Article;
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
          onError={() => setImgSrc(PLACEHOLDER_IMAGE)}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {article.category && (
          <div className="absolute top-3 left-3">
            <span className="bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full text-primary border border-primary/10">
              {article.category}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-center gap-2 text-xs text-muted mb-2">
          <span>{article.read_time_minutes} menit baca</span>
        </div>

        <h3 className="text-lg font-bold text-text mb-2 line-clamp-2 leading-tight group-hover:text-primary transition-colors">
          <Link href={`/blog/${article.slug}`}>
            {article.title}
          </Link>
        </h3>

        {article.summary && (
          <p className="text-sm text-muted mb-4 line-clamp-2 leading-relaxed flex-1">
            {article.summary}
          </p>
        )}

        <Link
          href={`/blog/${article.slug}`}
          className="inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:text-primary-dark transition-colors"
        >
          Baca Selengkapnya →
        </Link>
      </div>
    </article>
  );
}

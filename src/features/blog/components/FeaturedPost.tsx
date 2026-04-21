"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Article } from "@/types/database";

interface FeaturedPostProps {
  article: Article;
}

const PLACEHOLDER_IMAGE = "/placeholder-blog.svg";

function getImageUrl(url: string | null | undefined): string {
  if (!url || !url.trim()) return PLACEHOLDER_IMAGE;
  return url.trim();
}

export function FeaturedPost({ article }: FeaturedPostProps) {
  const [imgSrc, setImgSrc] = useState(getImageUrl(article.cover_image));

  return (
    <div className="group relative overflow-hidden rounded-3xl bg-gray-900 text-white">
      <div className="absolute inset-0 z-0">
        <Image
          src={imgSrc}
          alt={article.title}
          fill
          onError={() => setImgSrc(PLACEHOLDER_IMAGE)}
          className="object-cover opacity-60 transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
      </div>

      <div className="relative z-10 flex flex-col justify-end p-6 md:p-10 min-h-[300px] md:min-h-[400px]">
        <div className="flex items-center gap-2 mb-3">
          <span className="bg-primary px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full text-white">
            Featured
          </span>
          {article.category && (
            <span className="bg-white/20 backdrop-blur-md px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full text-white border border-white/10">
              {article.category}
            </span>
          )}
        </div>

        <h2 className="mb-3 text-2xl md:text-4xl font-bold leading-tight">
          <Link href={`/blog/${article.slug}`} className="hover:text-primary-light transition-colors">
            {article.title}
          </Link>
        </h2>

        {article.summary && (
          <p className="mb-6 max-w-2xl text-sm md:text-base text-gray-300 line-clamp-2">
            {article.summary}
          </p>
        )}

        <div className="flex items-center justify-between border-t border-white/20 pt-4">
          <div className="flex items-center gap-3 text-sm text-gray-400">
            <span>{article.author || "Tim Fintar"}</span>
            <span>•</span>
            <span>{article.read_time_minutes} menit baca</span>
          </div>
          <Link
            href={`/blog/${article.slug}`}
            className="flex items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-bold text-black hover:translate-x-1 transition-transform"
          >
            Baca
          </Link>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { ArrowRightIcon, ClockIcon } from "@heroicons/react/24/outline";
import type { ArticleWithPublisher } from "@/types/database";
import { getPublisherDisplay } from "@/features/blog/utils";

interface FeaturedPostProps {
  article: ArticleWithPublisher;
}

const PLACEHOLDER_IMAGE = "/placeholder-blog.svg";

function getImageUrl(url: string | null | undefined): string {
  if (!url || !url.trim()) return PLACEHOLDER_IMAGE;
  return url.trim();
}

export function FeaturedPost({ article }: FeaturedPostProps) {
  const [imgSrc, setImgSrc] = useState(getImageUrl(article.cover_image));
  const display = getPublisherDisplay(article.publisher, article.author);

  return (
    <div className="group relative overflow-hidden rounded-3xl bg-gray-900 text-white">
      <div className="absolute inset-0 z-0">
        <Image
          src={imgSrc}
          alt={article.title}
          fill
          unoptimized
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

        <div className="flex items-center justify-between border-t border-white/20 pt-4 gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                display.isFintarTeam
                  ? "bg-primary text-white border border-white/20"
                  : "bg-slate-200 text-slate-700"
              }`}
            >
              {display.initials}
            </div>
            <div className="flex items-center gap-2 text-xs md:text-sm text-gray-300 min-w-0">
              <span className="font-medium truncate">{display.label}</span>
              <span className="opacity-60">•</span>
              <span className="hidden sm:inline">{format(new Date(article.created_at), "d MMM yyyy", { locale: id })}</span>
              <span className="hidden sm:inline opacity-60">•</span>
              <span className="inline-flex items-center gap-1">
                <ClockIcon className="w-3.5 h-3.5" />
                {article.read_time_minutes} min baca
              </span>
            </div>
          </div>

          <Link
            href={`/blog/${article.slug}`}
            className="flex items-center gap-1 rounded-full bg-white px-4 py-2 text-sm font-bold text-black hover:translate-x-1 transition-transform shrink-0"
          >
            Baca
            <ArrowRightIcon className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

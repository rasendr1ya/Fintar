"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { ArticleContent } from "./ArticleContent";

const SyllabusPdfBookViewer = dynamic(() => import("./SyllabusPdfBookViewer").then((mod) => mod.SyllabusPdfBookViewer), { ssr: false });

interface ArticlePdfTabsProps {
  content: string;
  pdfUrl?: string;
  isSyllabus: boolean;
}

export function ArticlePdfTabs({ content, pdfUrl, isSyllabus }: ArticlePdfTabsProps) {
  const [activeTab, setActiveTab] = useState<"article" | "pdf">("article");

  if (!isSyllabus || !pdfUrl) {
    return <ArticleContent content={content} className="prose prose-slate max-w-none" />;
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-6 border-b border-border overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab("article")}
          className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
            activeTab === "article"
              ? "border-primary text-primary"
              : "border-transparent text-muted hover:text-text"
          }`}
        >
          Artikel
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("pdf")}
          className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
            activeTab === "pdf"
              ? "border-primary text-primary"
              : "border-transparent text-muted hover:text-text"
          }`}
        >
          Baca silabus lengkap
        </button>
      </div>

      {activeTab === "article" && (
        <ArticleContent content={content} className="prose prose-slate max-w-none" />
      )}

      {activeTab === "pdf" && <SyllabusPdfBookViewer pdfUrl={pdfUrl} />}
    </div>
  );
}

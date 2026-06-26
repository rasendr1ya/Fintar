"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import {
  deleteArticle,
  togglePublish,
  toggleFeature,
} from "@/features/admin/actions";
import type { Article } from "@/types/database";
import {
  PencilIcon,
  TrashIcon,
  EyeIcon,
  StarIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";
import { showSuccess, showError } from "@/lib/toast";

interface ArticleListProps {
  articles: Article[];
}

export function ArticleList({ articles: initialArticles }: ArticleListProps) {
  const [articles, setArticles] = useState(initialArticles);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleTogglePublish = async (id: string) => {
    setLoadingId(id);
    const result = await togglePublish(id);
    if ("success" in result) {
      setArticles((prev) =>
        prev.map((a) =>
          a.id === id ? { ...a, is_published: result.is_published ?? false } : a
        )
      );
      showSuccess("Status publikasi berhasil diubah");
    } else {
      showError("Gagal mengubah status publikasi");
    }
    setLoadingId(null);
  };

  const handleToggleFeatured = async (id: string) => {
    setLoadingId(id);
    const result = await toggleFeature(id);
    if ("success" in result) {
      setArticles((prev) =>
        prev.map((a) => ({
          ...a,
          is_featured: a.id === id ? (result.is_featured ?? false) : false,
        }))
      );
      showSuccess("Status unggulan berhasil diubah");
    } else {
      showError("Gagal mengubah status unggulan");
    }
    setLoadingId(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus artikel ini?")) return;
    setLoadingId(id);
    const result = await deleteArticle(id);
    if ("success" in result) {
      setArticles((prev) => prev.filter((a) => a.id !== id));
      showSuccess("Artikel berhasil dihapus");
    } else {
      showError("Gagal menghapus artikel");
    }
    setLoadingId(null);
  };

  if (articles.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-border p-12 text-center">
        <p className="text-muted mb-4">Belum ada artikel</p>
        <Link href="/admin/blog/new">
          <Button variant="primary" size="sm">
            <PlusIcon className="w-5 h-5" />
            Buat Artikel Pertama
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto -mx-4 md:mx-0">
      <div className="min-w-[640px] bg-white rounded-2xl border border-border overflow-hidden">
        <table className="w-full table-fixed">
          <thead className="bg-gray-50 border-b border-border">
            <tr>
              <th className="text-left px-6 py-4 text-xs font-bold text-muted uppercase w-auto">
                Judul
              </th>
              <th className="text-left px-6 py-4 text-xs font-bold text-muted uppercase w-20">
                Kategori
              </th>
              <th className="text-left px-6 py-4 text-xs font-bold text-muted uppercase w-20">
                Status
              </th>
              <th className="text-left px-6 py-4 text-xs font-bold text-muted uppercase w-14">
                Dilihat
              </th>
              <th className="text-right px-6 py-4 text-xs font-bold text-muted uppercase w-48">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {articles.map((article) => (
              <tr
                key={article.id}
                className={`hover:bg-gray-50 transition-colors ${
                  loadingId === article.id ? "opacity-50" : ""
                }`}
              >
                <td className="px-6 py-4 overflow-hidden">
                  <div className="flex items-center gap-3 min-w-0">
                    {article.is_featured && (
                      <StarIconSolid className="w-4 h-4 text-coins shrink-0" />
                    )}
                    <div className="min-w-0 overflow-hidden">
                      <p className="font-medium text-text truncate">{article.title}</p>
                      <p className="text-xs text-muted truncate">{article.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-gray-100 rounded-full text-xs text-muted whitespace-nowrap">
                    {article.category || "-"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleTogglePublish(article.id)}
                    disabled={loadingId === article.id}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${
                      article.is_published
                        ? "bg-success/10 text-success hover:bg-success/20"
                        : "bg-gray-100 text-muted hover:bg-gray-200"
                    }`}
                  >
                    {article.is_published ? "Terbit" : "Draft"}
                  </button>
                </td>
                <td className="px-6 py-4 text-sm text-muted">{article.view_count}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => handleToggleFeatured(article.id)}
                      disabled={loadingId === article.id}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      title={article.is_featured ? "Hapus unggulan" : "Jadikan unggulan"}
                    >
                      {article.is_featured ? (
                        <StarIconSolid className="w-4 h-4 text-coins" />
                      ) : (
                        <StarIcon className="w-4 h-4 text-muted" />
                      )}
                    </button>
                    <Link
                      href={`/blog/${article.slug}`}
                      target="_blank"
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Lihat"
                    >
                      <EyeIcon className="w-4 h-4 text-muted" />
                    </Link>
                    <Link
                      href={`/admin/blog/${article.id}/edit`}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <PencilIcon className="w-4 h-4 text-muted" />
                    </Link>
                    <button
                      onClick={() => handleDelete(article.id)}
                      disabled={loadingId === article.id}
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                      title="Hapus"
                    >
                      <TrashIcon className="w-4 h-4 text-hearts" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

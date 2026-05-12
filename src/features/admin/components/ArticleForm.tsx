"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { createArticle, updateArticle } from "@/features/admin/actions";
import type { Article } from "@/types/database";
import { RichTextEditor } from "./RichTextEditor";

const articleSchema = z.object({
  title: z.string().min(1, "Judul wajib diisi").max(200, "Judul terlalu panjang"),
  slug: z.string().optional(),
  summary: z.string().min(1, "Ringkasan wajib diisi").max(500, "Ringkasan terlalu panjang"),
  category: z.string().min(1, "Kategori wajib dipilih"),
  tags: z.string().optional(),
  is_featured: z.boolean().optional(),
  is_published: z.boolean().optional(),
});

type ArticleFormData = z.infer<typeof articleSchema>;

const CATEGORIES = [
  "Fundamental",
  "Budgeting",
  "Saving",
  "Investing",
  "Debt",
  "Tips",
];

interface ArticleFormProps {
  article?: Article;
}

export function ArticleForm({ article }: ArticleFormProps) {
  const router = useRouter();
  const [content, setContent] = useState(article?.content || "");
  const [coverImage, setCoverImage] = useState(article?.cover_image || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ArticleFormData>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: article?.title || "",
      slug: article?.slug || "",
      summary: article?.summary || "",
      category: article?.category || "",
      tags: article?.tags?.join(", ") || "",
      is_featured: article?.is_featured || false,
      is_published: article?.is_published || false,
    },
  });

  const title = watch("title");

  const generateSlug = useCallback((text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  }, []);

  const onSubmit = async (data: ArticleFormData) => {
    if (!content.trim()) {
      setError("Konten tidak boleh kosong");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const tags = data.tags
        ? data.tags.split(",").map((t) => t.trim()).filter(Boolean)
        : [];

      const payload = {
        title: data.title,
        slug: data.slug || undefined,
        summary: data.summary,
        content,
        cover_image: coverImage || null,
        category: data.category,
        tags,
        is_featured: data.is_featured ?? false,
        is_published: data.is_published ?? false,
      };

      let result;
      if (article) {
        result = await updateArticle(article.id, payload);
      } else {
        result = await createArticle(payload);
      }

      if ("error" in result && result.error) {
        setError(result.error);
        return;
      }

      router.push("/admin/blog");
      router.refresh();
    } catch {
      setError("Terjadi kesalahan saat menyimpan artikel");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-3xl">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-hearts text-sm">
          {error}
        </div>
      )}

      <Card padding="lg">
        <div className="space-y-6">
          <Input
            label="Judul Artikel"
            {...register("title")}
            placeholder="Masukkan judul artikel"
            error={errors.title?.message}
          />

          <Input
            label="Slug"
            {...register("slug")}
            placeholder={title ? generateSlug(title) : "auto-generated-from-title"}
          />
          <p className="text-xs text-muted -mt-4">
            Kosongkan untuk auto-generate dari judul
          </p>

          <div>
            <label className="block text-sm font-medium text-text mb-1.5">
              Ringkasan
            </label>
            <textarea
              {...register("summary")}
              rows={3}
              className="w-full px-4 py-3 rounded-2xl border-2 border-border bg-white focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-muted resize-none"
              placeholder="Deskripsi singkat artikel..."
            />
            {errors.summary && (
              <p className="mt-1.5 text-sm text-hearts">{errors.summary.message}</p>
            )}
          </div>

          <Input
            label="Cover Image URL"
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
            placeholder="https://example.com/image.jpg"
          />

          <div>
            <label className="block text-sm font-medium text-text mb-1.5">
              Kategori
            </label>
            <select
              {...register("category")}
              className="w-full px-4 py-3 rounded-2xl border-2 border-border bg-white focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="">Pilih kategori</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1.5 text-sm text-hearts">{errors.category.message}</p>
            )}
          </div>

          <Input
            label="Tags"
            {...register("tags")}
            placeholder="menabung, dana-darurat, tips (pisahkan dengan koma)"
          />
        </div>
      </Card>

      <Card padding="lg">
        <label className="block text-sm font-medium text-text mb-3">
          Konten Artikel
        </label>
        <RichTextEditor
          content={content}
          onChange={setContent}
          placeholder="Tulis artikel di sini..."
        />
      </Card>

      <Card padding="md">
        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              {...register("is_published")}
              className="w-5 h-5 rounded border-border text-primary focus:ring-primary"
            />
            <span className="text-sm font-medium text-text">Terbitkan</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              {...register("is_featured")}
              className="w-5 h-5 rounded border-border text-primary focus:ring-primary"
            />
            <span className="text-sm font-medium text-text">Jadikan Unggulan</span>
          </label>
        </div>
      </Card>

      <div className="flex items-center gap-4">
        <Button type="submit" isLoading={isSubmitting}>
          {article ? "Simpan Perubahan" : "Buat Artikel"}
        </Button>
        <Button type="button" variant="ghost" onClick={() => router.push("/admin/blog")}>
          Batal
        </Button>
      </div>
    </form>
  );
}

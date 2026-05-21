"use server";

import { createClient, getCurrentProfile } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { MAX_IMAGE_UPLOAD_BYTES, WORDS_PER_MINUTE } from "@/lib/constants";
import type { Article } from "@/types/database";

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

function calculateReadTime(content: string): number {
  const wordCount = content.split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE));
}

export async function getArticlesAdmin(): Promise<{ data?: Article[]; error?: string }> {
  const profile = await getCurrentProfile();
  if (!profile?.is_admin) return { error: "Unauthorized" };

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("is_deleted", false)
    .order("created_at", { ascending: false });

  if (error) return { error: "Gagal memuat artikel" };

  return { data: data as Article[] };
}

export async function getArticleByIdAdmin(id: string): Promise<{ data?: Article; error?: string }> {
  const profile = await getCurrentProfile();
  if (!profile?.is_admin) return { error: "Unauthorized" };

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return { error: "Artikel tidak ditemukan" };

  return { data: data as Article };
}

export interface CreateArticleInput {
  title: string;
  slug?: string;
  summary: string;
  content: string;
  cover_image?: string | null;
  category: string;
  tags: string[];
  is_featured?: boolean;
  is_published?: boolean;
}

export async function createArticle(input: CreateArticleInput): Promise<{ success?: boolean; data?: Article; error?: string }> {
  const profile = await getCurrentProfile();
  if (!profile?.is_admin) return { error: "Unauthorized" };

  if (!input.title.trim()) return { error: "Judul artikel tidak boleh kosong" };
  if (!input.summary.trim()) return { error: "Ringkasan tidak boleh kosong" };
  if (!input.content.trim()) return { error: "Konten tidak boleh kosong" };
  if (!input.category) return { error: "Kategori wajib dipilih" };

  const supabase = await createClient();

  const slug = input.slug?.trim() || generateSlug(input.title);
  const readTime = calculateReadTime(input.content);

  const { data: existing } = await supabase
    .from("articles")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();

  if (existing) return { error: "Slug sudah digunakan, gunakan judul yang berbeda" };

  if (input.is_featured) {
    await supabase
      .from("articles")
      .update({ is_featured: false })
      .eq("is_featured", true);
  }

  const { data, error } = await supabase
    .from("articles")
    .insert({
      title: input.title.trim(),
      slug,
      summary: input.summary.trim(),
      content: input.content.trim(),
      cover_image: input.cover_image || null,
      category: input.category,
      tags: input.tags || [],
      read_time_minutes: readTime,
      author: profile.username || "Admin",
      published_by: profile.id,
      is_featured: input.is_featured || false,
      is_published: input.is_published || false,
      view_count: 0,
    })
    .select()
    .single();

  if (error) return { error: "Gagal membuat artikel" };

  revalidatePath("/admin/blog");
  revalidatePath("/admin");
  revalidatePath("/blog");

  return { success: true, data: data as Article };
}

export interface UpdateArticleInput {
  title?: string;
  slug?: string;
  summary?: string;
  content?: string;
  cover_image?: string | null;
  category?: string;
  tags?: string[];
  is_featured?: boolean;
  is_published?: boolean;
}

export async function updateArticle(id: string, input: UpdateArticleInput): Promise<{ success?: boolean; data?: Article; error?: string }> {
  const profile = await getCurrentProfile();
  if (!profile?.is_admin) return { error: "Unauthorized" };

  const supabase = await createClient();

  const updateData: Record<string, unknown> = {};

  if (input.title !== undefined) {
    if (!input.title.trim()) return { error: "Judul artikel tidak boleh kosong" };
    updateData.title = input.title.trim();
  }
  if (input.slug !== undefined) {
    const slug = input.slug.trim() || generateSlug(input.title || "");
    const { data: existing } = await supabase
      .from("articles")
      .select("id")
      .eq("slug", slug)
      .neq("id", id)
      .maybeSingle();
    if (existing) return { error: "Slug sudah digunakan" };
    updateData.slug = slug;
  }
  if (input.summary !== undefined) {
    if (!input.summary.trim()) return { error: "Ringkasan tidak boleh kosong" };
    updateData.summary = input.summary.trim();
  }
  if (input.content !== undefined) {
    if (!input.content.trim()) return { error: "Konten tidak boleh kosong" };
    updateData.content = input.content.trim();
    updateData.read_time_minutes = calculateReadTime(input.content);
  }
  if (input.cover_image !== undefined) updateData.cover_image = input.cover_image;
  if (input.category !== undefined) updateData.category = input.category;
  if (input.tags !== undefined) updateData.tags = input.tags;

  if (input.is_featured) {
    await supabase
      .from("articles")
      .update({ is_featured: false })
      .eq("is_featured", true);
    updateData.is_featured = true;
  } else if (input.is_featured === false) {
    updateData.is_featured = false;
  }

  if (input.is_published !== undefined) updateData.is_published = input.is_published;

  const { data, error } = await supabase
    .from("articles")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error) return { error: "Gagal mengubah artikel" };

  revalidatePath("/admin/blog");
  revalidatePath("/admin");
  revalidatePath("/blog");
  if (data) revalidatePath(`/blog/${(data as Article).slug}`);

  return { success: true, data: data as Article };
}

export async function deleteArticle(id: string): Promise<{ success?: boolean; error?: string }> {
  const profile = await getCurrentProfile();
  if (!profile?.is_admin) return { error: "Unauthorized" };

  const supabase = await createClient();

  const { error } = await supabase
    .from("articles")
    .update({ is_deleted: true })
    .eq("id", id);

  if (error) return { error: "Gagal menghapus artikel" };

  revalidatePath("/admin/blog");
  revalidatePath("/admin");
  revalidatePath("/blog");

  return { success: true };
}

export async function togglePublish(id: string): Promise<{ success?: boolean; is_published?: boolean; error?: string }> {
  const profile = await getCurrentProfile();
  if (!profile?.is_admin) return { error: "Unauthorized" };

  const supabase = await createClient();

  const { data: article, error: fetchError } = await supabase
    .from("articles")
    .select("is_published, slug")
    .eq("id", id)
    .single();

  if (fetchError || !article) return { error: "Artikel tidak ditemukan" };

  const newStatus = !article.is_published;

  const updateData: Record<string, unknown> = { is_published: newStatus };
  if (newStatus) {
    updateData.published_by = profile.id;
  }

  const { error } = await supabase
    .from("articles")
    .update(updateData)
    .eq("id", id);

  if (error) return { error: "Gagal mengubah status publikasi" };

  revalidatePath("/admin/blog");
  revalidatePath("/admin");
  revalidatePath("/blog");
  revalidatePath(`/blog/${article.slug}`);

  return { success: true, is_published: newStatus };
}

export async function toggleFeature(id: string): Promise<{ success?: boolean; is_featured?: boolean; error?: string }> {
  const profile = await getCurrentProfile();
  if (!profile?.is_admin) return { error: "Unauthorized" };

  const supabase = await createClient();

  const { data: article, error: fetchError } = await supabase
    .from("articles")
    .select("is_featured")
    .eq("id", id)
    .single();

  if (fetchError || !article) return { error: "Artikel tidak ditemukan" };

  const newStatus = !article.is_featured;

  if (newStatus) {
    await supabase
      .from("articles")
      .update({ is_featured: false })
      .eq("is_featured", true);
  }

  const { error } = await supabase
    .from("articles")
    .update({ is_featured: newStatus })
    .eq("id", id);

  if (error) return { error: "Gagal mengubah status unggulan" };

  revalidatePath("/admin/blog");
  revalidatePath("/admin");
  revalidatePath("/blog");

  return { success: true, is_featured: newStatus };
}

export async function uploadBlogImage(formData: FormData): Promise<{ success?: boolean; url?: string; error?: string }> {
  const profile = await getCurrentProfile();
  if (!profile?.is_admin) return { error: "Unauthorized" };

  const file = formData.get("file") as File | null;
  if (!file) return { error: "File tidak ditemukan" };

  if (!file.type.startsWith("image/")) return { error: "File harus berupa gambar" };

  if (file.size > MAX_IMAGE_UPLOAD_BYTES) return { error: "Ukuran file maksimal 5MB" };

  const supabase = await createClient();

  const fileExt = file.name.split(".").pop() || "jpg";
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
  const filePath = `covers/${fileName}`;

  const { error } = await supabase.storage
    .from("blog-images")
    .upload(filePath, file, {
      contentType: file.type,
      upsert: false,
    });

  if (error) return { error: "Gagal mengupload gambar" };

  const { data: urlData } = supabase.storage
    .from("blog-images")
    .getPublicUrl(filePath);

  return { success: true, url: urlData.publicUrl };
}

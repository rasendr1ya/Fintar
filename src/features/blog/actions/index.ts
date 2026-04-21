"use server";

import { createClient } from "@/lib/supabase/server";
import type { Article } from "@/types/database";

export async function getArticles() {
  const supabase = await createClient();

  const { data: articles, error } = await supabase
    .from("articles")
    .select("*")
    .eq("is_published", true)
    .eq("is_deleted", false)
    .order("created_at", { ascending: false });

  if (error) return [];

  return articles as Article[];
}

export async function getFeaturedArticle() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("is_published", true)
    .eq("is_featured", true)
    .eq("is_deleted", false)
    .limit(1)
    .maybeSingle();

  if (error) return null;

  return data as Article | null;
}

export async function getArticleBySlug(slug: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .eq("is_deleted", false)
    .single();

  if (error) return null;

  return data as Article | null;
}

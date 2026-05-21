"use server";

import { createClient } from "@/lib/supabase/server";
import type { ArticleWithPublisher } from "@/types/database";

const ARTICLE_SELECT = `
  *,
  publisher:published_by (
    id,
    username,
    admin_role
  )
`;

export async function getArticles(): Promise<ArticleWithPublisher[]> {
  const supabase = await createClient();

  const { data: articles, error } = await supabase
    .from("articles")
    .select(ARTICLE_SELECT)
    .eq("is_published", true)
    .eq("is_deleted", false)
    .order("created_at", { ascending: false });

  if (error) return [];

  return articles as ArticleWithPublisher[];
}

export async function getFeaturedArticle(): Promise<ArticleWithPublisher | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("articles")
    .select(ARTICLE_SELECT)
    .eq("is_published", true)
    .eq("is_featured", true)
    .eq("is_deleted", false)
    .limit(1)
    .maybeSingle();

  if (error) return null;

  return data as ArticleWithPublisher | null;
}

export async function getArticleBySlug(slug: string): Promise<ArticleWithPublisher | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("articles")
    .select(ARTICLE_SELECT)
    .eq("slug", slug)
    .eq("is_published", true)
    .eq("is_deleted", false)
    .maybeSingle();

  if (error || !data) return null;

  return data as ArticleWithPublisher | null;
}

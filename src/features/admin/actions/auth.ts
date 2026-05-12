"use server";

import { createClient, getCurrentProfile } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function requireAdmin() {
  const profile = await getCurrentProfile();

  if (!profile) {
    redirect("/login");
  }

  if (!profile.is_admin) {
    redirect("/learn");
  }

  return profile;
}

export async function getAdminStats() {
  const profile = await getCurrentProfile();

  if (!profile?.is_admin) {
    return { error: "Unauthorized" };
  }

  const supabase = await createClient();

  const [
    { count: userCount },
    { count: articleCount },
    { count: lessonCount },
    { count: challengeCount },
    { count: unitCount },
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase
      .from("articles")
      .select("*", { count: "exact", head: true })
      .eq("is_deleted", false),
    supabase
      .from("lessons")
      .select("*", { count: "exact", head: true })
      .eq("is_deleted", false),
    supabase
      .from("challenges")
      .select("*", { count: "exact", head: true })
      .eq("is_deleted", false),
    supabase
      .from("units")
      .select("*", { count: "exact", head: true })
      .eq("is_deleted", false),
  ]);

  return {
    users: userCount ?? 0,
    articles: articleCount ?? 0,
    lessons: lessonCount ?? 0,
    challenges: challengeCount ?? 0,
    units: unitCount ?? 0,
  };
}

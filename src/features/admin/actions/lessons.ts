"use server";

import { createClient, getCurrentProfile } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { Lesson, LessonWithChallenges, Challenge } from "@/types/database";

export async function getLessonsByUnit(unitId: string): Promise<{ data?: Lesson[]; error?: string }> {
  const profile = await getCurrentProfile();
  if (!profile?.is_admin) return { error: "Unauthorized" };

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("lessons")
    .select("*")
    .eq("unit_id", unitId)
    .eq("is_deleted", false)
    .order("order_index", { ascending: true });

  if (error) return { error: "Gagal memuat lesson" };

  return { data: data as Lesson[] };
}

export async function getLessonById(id: string): Promise<{ data?: LessonWithChallenges; error?: string }> {
  const profile = await getCurrentProfile();
  if (!profile?.is_admin) return { error: "Unauthorized" };

  const supabase = await createClient();

  const { data: lesson, error: lessonError } = await supabase
    .from("lessons")
    .select("*")
    .eq("id", id)
    .single();

  if (lessonError || !lesson) return { error: "Lesson tidak ditemukan" };

  const { data: challenges, error: challengesError } = await supabase
    .from("challenges")
    .select("*")
    .eq("lesson_id", id)
    .eq("is_deleted", false)
    .order("order_index", { ascending: true });

  if (challengesError) return { error: "Gagal memuat challenge" };

  return {
    data: {
      ...(lesson as Lesson),
      challenges: (challenges as Challenge[]) || [],
    },
  };
}

export interface CreateLessonInput {
  unit_id: string;
  title: string;
}

export async function createLesson(input: CreateLessonInput): Promise<{ success?: boolean; data?: Lesson; error?: string }> {
  const profile = await getCurrentProfile();
  if (!profile?.is_admin) return { error: "Unauthorized" };

  if (!input.title.trim()) return { error: "Judul lesson tidak boleh kosong" };
  if (!input.unit_id) return { error: "Unit wajib dipilih" };

  const supabase = await createClient();

  const { data: maxOrder } = await supabase
    .from("lessons")
    .select("order_index")
    .eq("unit_id", input.unit_id)
    .eq("is_deleted", false)
    .order("order_index", { ascending: false })
    .limit(1)
    .maybeSingle();

  const orderIndex = maxOrder ? maxOrder.order_index + 1 : 0;

  const { data, error } = await supabase
    .from("lessons")
    .insert({
      unit_id: input.unit_id,
      title: input.title.trim(),
      order_index: orderIndex,
    })
    .select()
    .single();

  if (error) return { error: "Gagal membuat lesson" };

  revalidatePath("/admin/lessons");
  revalidatePath("/admin");
  revalidatePath("/learn");

  return { success: true, data: data as Lesson };
}

export interface UpdateLessonInput {
  title?: string;
  order_index?: number;
}

export async function updateLesson(id: string, input: UpdateLessonInput): Promise<{ success?: boolean; data?: Lesson; error?: string }> {
  const profile = await getCurrentProfile();
  if (!profile?.is_admin) return { error: "Unauthorized" };

  const supabase = await createClient();

  const updateData: Record<string, unknown> = {};

  if (input.title !== undefined) {
    if (!input.title.trim()) return { error: "Judul lesson tidak boleh kosong" };
    updateData.title = input.title.trim();
  }
  if (input.order_index !== undefined) updateData.order_index = input.order_index;

  const { data, error } = await supabase
    .from("lessons")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error) return { error: "Gagal mengubah lesson" };

  revalidatePath("/admin/lessons");
  revalidatePath("/admin");
  revalidatePath("/learn");

  return { success: true, data: data as Lesson };
}

export async function deleteLesson(id: string): Promise<{ success?: boolean; error?: string }> {
  const profile = await getCurrentProfile();
  if (!profile?.is_admin) return { error: "Unauthorized" };

  const supabase = await createClient();

  await supabase
    .from("challenges")
    .update({ is_deleted: true })
    .eq("lesson_id", id);

  const { error } = await supabase
    .from("lessons")
    .update({ is_deleted: true })
    .eq("id", id);

  if (error) return { error: "Gagal menghapus lesson" };

  revalidatePath("/admin/lessons");
  revalidatePath("/admin");
  revalidatePath("/learn");

  return { success: true };
}

export async function reorderLessons(orderedIds: string[]): Promise<{ success?: boolean; error?: string }> {
  const profile = await getCurrentProfile();
  if (!profile?.is_admin) return { error: "Unauthorized" };

  const supabase = await createClient();

  const updates = orderedIds.map((id, index) =>
    supabase.from("lessons").update({ order_index: index }).eq("id", id)
  );

  const results = await Promise.all(updates);
  const firstError = results.find((r) => r.error);
  if (firstError?.error) return { error: "Gagal mengurutkan lesson" };

  revalidatePath("/admin/lessons");
  revalidatePath("/admin");
  revalidatePath("/learn");

  return { success: true };
}

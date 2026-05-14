"use server";

import { createClient, getCurrentProfile } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { Challenge } from "@/types/database";

export async function getChallengesByLesson(lessonId: string): Promise<{ data?: Challenge[]; error?: string }> {
  const profile = await getCurrentProfile();
  if (!profile?.is_admin) return { error: "Unauthorized" };

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("challenges")
    .select("*")
    .eq("lesson_id", lessonId)
    .eq("is_deleted", false)
    .order("order_index", { ascending: true });

  if (error) return { error: "Gagal memuat challenge" };

  const normalized = (data as Challenge[]).map((c) => ({
    ...c,
    options: typeof c.options === "string" ? JSON.parse(c.options) : c.options,
  }));

  return { data: normalized };
}

export async function getChallengeById(id: string): Promise<{ data?: Challenge; error?: string }> {
  const profile = await getCurrentProfile();
  if (!profile?.is_admin) return { error: "Unauthorized" };

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("challenges")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return { error: "Challenge tidak ditemukan" };

  const normalized = {
    ...data,
    options: typeof data.options === "string" ? JSON.parse(data.options) : data.options,
  };

  return { data: normalized as Challenge };
}

export interface CreateChallengeInput {
  lesson_id: string;
  type: "SELECT" | "ASSIST";
  question: string;
  options: string[];
  correct_answer: string;
  order_index?: number;
}

export async function createChallenge(input: CreateChallengeInput): Promise<{ success?: boolean; data?: Challenge; error?: string }> {
  const profile = await getCurrentProfile();
  if (!profile?.is_admin) return { error: "Unauthorized" };

  if (!input.question.trim()) return { error: "Pertanyaan tidak boleh kosong" };
  if (!input.lesson_id) return { error: "Lesson wajib dipilih" };
  if (!input.options || input.options.filter((o) => o.trim()).length < 2) return { error: "Minimal 2 pilihan jawaban" };
  if (!input.correct_answer.trim()) return { error: "Jawaban benar wajib diisi" };

  const validOptions = input.options.filter((o) => o.trim());
  if (!validOptions.includes(input.correct_answer.trim())) {
    return { error: "Jawaban benar harus cocok dengan salah satu pilihan" };
  }

  const supabase = await createClient();

  const orderIndex = input.order_index ?? 0;
  if (input.order_index === undefined) {
    const { data: maxOrder } = await supabase
      .from("challenges")
      .select("order_index")
      .eq("lesson_id", input.lesson_id)
      .eq("is_deleted", false)
      .order("order_index", { ascending: false })
      .limit(1)
      .maybeSingle();

    const nextOrder = maxOrder ? maxOrder.order_index + 1 : 0;
    const { data, error } = await supabase
      .from("challenges")
      .insert({
        lesson_id: input.lesson_id,
        type: input.type,
        question: input.question.trim(),
        options: validOptions,
        correct_answer: input.correct_answer.trim(),
        order_index: nextOrder,
      })
      .select()
      .single();

    if (error) return { error: "Gagal membuat challenge" };

    revalidatePath("/admin/lessons");
    revalidatePath("/admin");
    revalidatePath("/learn");

    return { success: true, data: data as Challenge };
  }

  const { data, error } = await supabase
    .from("challenges")
    .insert({
      lesson_id: input.lesson_id,
      type: input.type,
      question: input.question.trim(),
      options: validOptions,
      correct_answer: input.correct_answer.trim(),
      order_index: orderIndex,
    })
    .select()
    .single();

  if (error) return { error: "Gagal membuat challenge" };

  revalidatePath("/admin/lessons");
  revalidatePath("/admin");
  revalidatePath("/learn");

  return { success: true, data: data as Challenge };
}

export interface UpdateChallengeInput {
  type?: "SELECT" | "ASSIST";
  question?: string;
  options?: string[];
  correct_answer?: string;
  order_index?: number;
}

export async function updateChallenge(id: string, input: UpdateChallengeInput): Promise<{ success?: boolean; data?: Challenge; error?: string }> {
  const profile = await getCurrentProfile();
  if (!profile?.is_admin) return { error: "Unauthorized" };

  const supabase = await createClient();

  const updateData: Record<string, unknown> = {};

  if (input.type !== undefined) updateData.type = input.type;
  if (input.question !== undefined) {
    if (!input.question.trim()) return { error: "Pertanyaan tidak boleh kosong" };
    updateData.question = input.question.trim();
  }
  if (input.options !== undefined) {
    const validOptions = input.options.filter((o) => o.trim());
    if (validOptions.length < 2) return { error: "Minimal 2 pilihan jawaban" };
    updateData.options = validOptions;
  }
  if (input.correct_answer !== undefined) {
    if (!input.correct_answer.trim()) return { error: "Jawaban benar wajib diisi" };
    updateData.correct_answer = input.correct_answer.trim();
  }
  if (input.order_index !== undefined) updateData.order_index = input.order_index;

  const { data, error } = await supabase
    .from("challenges")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error) return { error: "Gagal mengubah challenge" };

  revalidatePath("/admin/lessons");
  revalidatePath("/admin");
  revalidatePath("/learn");

  return { success: true, data: data as Challenge };
}

export async function deleteChallenge(id: string): Promise<{ success?: boolean; error?: string }> {
  const profile = await getCurrentProfile();
  if (!profile?.is_admin) return { error: "Unauthorized" };

  const supabase = await createClient();

  const { error } = await supabase
    .from("challenges")
    .update({ is_deleted: true })
    .eq("id", id);

  if (error) return { error: "Gagal menghapus challenge" };

  revalidatePath("/admin/lessons");
  revalidatePath("/admin");
  revalidatePath("/learn");

  return { success: true };
}

export async function reorderChallenges(orderedIds: string[]): Promise<{ success?: boolean; error?: string }> {
  const profile = await getCurrentProfile();
  if (!profile?.is_admin) return { error: "Unauthorized" };

  const supabase = await createClient();

  const updates = orderedIds.map((id, index) =>
    supabase.from("challenges").update({ order_index: index }).eq("id", id)
  );

  const results = await Promise.all(updates);
  const firstError = results.find((r) => r.error);
  if (firstError?.error) return { error: "Gagal mengurutkan challenge" };

  revalidatePath("/admin/lessons");
  revalidatePath("/admin");
  revalidatePath("/learn");

  return { success: true };
}

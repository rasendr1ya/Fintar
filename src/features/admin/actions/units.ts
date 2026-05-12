"use server";

import { createClient, getCurrentProfile } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { Unit, UnitWithLessons, Lesson } from "@/types/database";

export async function getAllUnitsAdmin(): Promise<{ data?: UnitWithLessons[]; error?: string }> {
  const profile = await getCurrentProfile();
  if (!profile?.is_admin) return { error: "Unauthorized" };

  const supabase = await createClient();

  const { data: units, error: unitsError } = await supabase
    .from("units")
    .select("*")
    .eq("is_deleted", false)
    .order("order_index", { ascending: true });

  if (unitsError) return { error: "Gagal memuat unit" };

  const { data: lessons, error: lessonsError } = await supabase
    .from("lessons")
    .select("*")
    .eq("is_deleted", false)
    .order("order_index", { ascending: true });

  if (lessonsError) return { error: "Gagal memuat lesson" };

  const unitsWithLessons: UnitWithLessons[] = (units as Unit[]).map((unit) => ({
    ...unit,
    lessons: (lessons as Lesson[]).filter((l) => l.unit_id === unit.id),
  }));

  return { data: unitsWithLessons };
}

export async function getUnitById(id: string): Promise<{ data?: Unit; error?: string }> {
  const profile = await getCurrentProfile();
  if (!profile?.is_admin) return { error: "Unauthorized" };

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("units")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return { error: "Unit tidak ditemukan" };

  return { data: data as Unit };
}

export interface CreateUnitInput {
  title: string;
  description?: string | null;
  color_theme: string;
}

export async function createUnit(input: CreateUnitInput): Promise<{ success?: boolean; data?: Unit; error?: string }> {
  const profile = await getCurrentProfile();
  if (!profile?.is_admin) return { error: "Unauthorized" };

  if (!input.title.trim()) return { error: "Judul unit tidak boleh kosong" };

  const supabase = await createClient();

  const { data: maxOrder } = await supabase
    .from("units")
    .select("order_index")
    .eq("is_deleted", false)
    .order("order_index", { ascending: false })
    .limit(1)
    .maybeSingle();

  const orderIndex = maxOrder ? maxOrder.order_index + 1 : 0;

  const { data, error } = await supabase
    .from("units")
    .insert({
      title: input.title.trim(),
      description: input.description || null,
      color_theme: input.color_theme,
      order_index: orderIndex,
    })
    .select()
    .single();

  if (error) return { error: "Gagal membuat unit" };

  revalidatePath("/admin/lessons");
  revalidatePath("/admin");
  revalidatePath("/learn");

  return { success: true, data: data as Unit };
}

export interface UpdateUnitInput {
  title?: string;
  description?: string | null;
  color_theme?: string;
  order_index?: number;
}

export async function updateUnit(id: string, input: UpdateUnitInput): Promise<{ success?: boolean; data?: Unit; error?: string }> {
  const profile = await getCurrentProfile();
  if (!profile?.is_admin) return { error: "Unauthorized" };

  const supabase = await createClient();

  const updateData: Record<string, unknown> = {};

  if (input.title !== undefined) {
    if (!input.title.trim()) return { error: "Judul unit tidak boleh kosong" };
    updateData.title = input.title.trim();
  }
  if (input.description !== undefined) updateData.description = input.description;
  if (input.color_theme !== undefined) updateData.color_theme = input.color_theme;
  if (input.order_index !== undefined) updateData.order_index = input.order_index;

  const { data, error } = await supabase
    .from("units")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error) return { error: "Gagal mengubah unit" };

  revalidatePath("/admin/lessons");
  revalidatePath("/admin");
  revalidatePath("/learn");

  return { success: true, data: data as Unit };
}

export async function deleteUnit(id: string): Promise<{ success?: boolean; error?: string }> {
  const profile = await getCurrentProfile();
  if (!profile?.is_admin) return { error: "Unauthorized" };

  const supabase = await createClient();

  await supabase
    .from("lessons")
    .update({ is_deleted: true })
    .eq("unit_id", id);

  const { error } = await supabase
    .from("units")
    .update({ is_deleted: true })
    .eq("id", id);

  if (error) return { error: "Gagal menghapus unit" };

  revalidatePath("/admin/lessons");
  revalidatePath("/admin");
  revalidatePath("/learn");

  return { success: true };
}

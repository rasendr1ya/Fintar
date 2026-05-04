"use server";

import { createClient, getCurrentUser } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { calculateMaxHearts } from "@/lib/utils";

export async function refillHearts() {
  const user = await getCurrentUser();
  if (!user) return { error: "Not authenticated" };

  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("xp")
    .eq("id", user.id)
    .single();

  if (!profile) return { error: "Profile not found" };

  const maxHearts = calculateMaxHearts(profile.xp || 0);

  await supabase
    .from("profiles")
    .update({ hearts: maxHearts, last_heart_refill_at: new Date().toISOString() })
    .eq("id", user.id);

  revalidatePath("/learn");
  revalidatePath("/lesson/[id]", "page");
  return { success: true };
}
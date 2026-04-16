"use server";

import { createClient, getCurrentUser } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function completeOnboarding(
  occupation: string,
  financialGoal: string
) {
  const user = await getCurrentUser();
  if (!user) {
    return { error: "Not authenticated" };
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("profiles")
    .update({
      occupation: occupation,
      financial_goal: financialGoal,
      onboarding_done: true,
      last_active_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) {
    return { error: "Failed to save onboarding data" };
  }

  revalidatePath("/learn");
  return { success: true };
}

export async function getOnboardingStatus() {
  const user = await getCurrentUser();
  if (!user) {
    return { error: "Not authenticated" };
  }

  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("onboarding_done, occupation, financial_goal")
    .eq("id", user.id)
    .single();

  return { profile };
}

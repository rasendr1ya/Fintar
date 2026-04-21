"use server";

import { createClient, getCurrentUser } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const VALID_OCCUPATIONS = ["pelajar", "karyawan", "freelancer", "bisnis"] as const;
const VALID_GOALS = ["hutang", "investasi", "cashflow", "darurat"] as const;

export async function completeOnboarding(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) {
    return { error: "Not authenticated" };
  }

  const occupation = formData.get("occupation") as string;
  const financialGoal = formData.get("financialGoal") as string;

  if (!occupation || !financialGoal) {
    return { error: "Pilih okupasi dan tujuan keuangan" };
  }

  if (!VALID_OCCUPATIONS.includes(occupation as typeof VALID_OCCUPATIONS[number])) {
    return { error: "Okupasi tidak valid" };
  }

  if (!VALID_GOALS.includes(financialGoal as typeof VALID_GOALS[number])) {
    return { error: "Tujuan keuangan tidak valid" };
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("profiles")
    .update({
      occupation,
      financial_goal: financialGoal,
      onboarding_done: true,
      last_active_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) {
    return { error: "Failed to save onboarding data" };
  }

  revalidatePath("/learn");
  redirect("/learn");
}
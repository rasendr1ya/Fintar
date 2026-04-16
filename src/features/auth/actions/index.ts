"use server";

import { createClient, getCurrentUser } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function registerUser(email: string, password: string, username: string) {
  const trimmedUsername = username.trim();
  const trimmedEmail = email.trim().toLowerCase();

  if (!trimmedUsername || trimmedUsername.length < 2) {
    return { error: "Nama panggilan minimal 2 karakter" };
  }
  if (trimmedUsername.length > 30) {
    return { error: "Nama panggilan maksimal 30 karakter" };
  }
  if (!/^[a-zA-Z0-9_ ]+$/.test(trimmedUsername)) {
    return { error: "Nama panggilan hanya boleh huruf, angka, dan underscore" };
  }
  if (password.length < 6) {
    return { error: "Password minimal 6 karakter" };
  }

  const supabase = await createClient();

  // Sign out any existing session first to prevent stale sessions
  // from interfering with registration
  await supabase.auth.signOut({ scope: "global" });

  const { data, error: signUpError } = await supabase.auth.signUp({
    email: trimmedEmail,
    password,
    options: {
      data: {
        username: trimmedUsername,
      },
    },
  });

  if (signUpError) {
    return { error: signUpError.message };
  }

  revalidatePath("/");
  return { success: true, user: data.user };
}

export async function loginUser(email: string, password: string) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/learn");
  return { success: true, user: data.user };
}

export async function verifyOtp(email: string, token: string) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: "email",
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/onboarding");
  return { success: true, user: data.user };
}

export async function resendOtp(email: string) {
  const supabase = await createClient();

  const { error } = await supabase.auth.resend({
    type: "signup",
    email,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

export async function logoutUser() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut({ scope: "global" });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/");
  return { success: true };
}

export async function getSession() {
  const user = await getCurrentUser();
  return { user };
}

export async function resetPassword(email: string) {
  const supabase = await createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=/reset-password`,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

export async function updatePassword(newPassword: string) {
  const user = await getCurrentUser();
  if (!user) {
    return { error: "Not authenticated" };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

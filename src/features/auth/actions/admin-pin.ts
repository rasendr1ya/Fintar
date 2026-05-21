"use server";

import { createClient, createServiceClient, getCurrentUser } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import crypto from "crypto";

const ADMIN_PIN_COOKIE = "admin_pin_verified";

function hashPin(pin: string): string {
  return crypto.createHash("sha256").update(pin).digest("hex");
}

export async function setAdminPin(targetUserId: string, pin: string) {
  const user = await getCurrentUser();
  if (!user) return { error: "Not authenticated" };
  if (!/^\d{6}$/.test(pin)) return { error: "PIN harus 6 digit angka" };

  const supabase = await createClient();
  const { data: callerProfile } = await supabase
    .from("profiles")
    .select("admin_role, is_admin")
    .eq("id", user.id)
    .single();

  if (!callerProfile?.is_admin || callerProfile.admin_role !== "dev") {
    return { error: "Unauthorized" };
  }

  const service = createServiceClient();
  const { error } = await service
    .from("profiles")
    .update({ admin_pin: hashPin(pin) })
    .eq("id", targetUserId);

  if (error) return { error: "Failed to set admin pin" };
  return { success: true };
}

export async function verifyAdminPin(pin: string) {
  const user = await getCurrentUser();
  if (!user) return { error: "Not authenticated", verified: false };
  if (!/^\d{6}$/.test(pin)) return { error: "PIN harus 6 digit angka", verified: false };

  const service = createServiceClient();
  const { data: profile, error } = await service
    .from("profiles")
    .select("admin_pin, is_admin, admin_role")
    .eq("id", user.id)
    .single();

  if (error || !profile) return { error: "Profile not found", verified: false };
  if (!profile.is_admin) return { error: "Not an admin", verified: false };
  if (!profile.admin_pin) return { error: "Admin pin belum di-set", verified: false };

  if (hashPin(pin) !== profile.admin_pin) {
    return { error: "PIN salah", verified: false };
  }

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_PIN_COOKIE, "true", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  return { success: true, verified: true, adminRole: profile.admin_role };
}

export async function checkAdminPinSession(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.get(ADMIN_PIN_COOKIE)?.value === "true";
}

export async function clearAdminPinSession() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_PIN_COOKIE);
}

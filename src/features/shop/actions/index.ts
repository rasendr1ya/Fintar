"use server";

import { createClient, getCurrentUser } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { calculateMaxHearts } from "@/lib/utils";

export async function buyHeartRefill() {
  const user = await getCurrentUser();
  if (!user) return { error: "Not authenticated" };

  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("coins, xp, hearts")
    .eq("id", user.id)
    .single();

  if (!profile) return { error: "Profile not found" };

  if (profile.coins < 50) {
    return { error: "Koin tidak cukup! Kamu butuh 50 koin." };
  }

  const maxHearts = calculateMaxHearts(profile.xp);

  const { error: updateError } = await supabase
    .from("profiles")
    .update({
      coins: profile.coins - 50,
      hearts: maxHearts,
    })
    .eq("id", user.id);

  if (updateError) return { error: "Gagal membeli heart refill" };

  const { data: heartRefillItem } = await supabase
    .from("shop_items")
    .select("id")
    .eq("type", "HEART_REFILL")
    .eq("is_active", true)
    .single();

  if (heartRefillItem) {
    await supabase
      .from("user_inventory")
      .insert({
        user_id: user.id,
        item_id: heartRefillItem.id,
        quantity: 1,
      });
  }

  revalidatePath("/shop");
  revalidatePath("/learn");

  return {
    success: true,
    newCoins: profile.coins - 50,
    newHearts: maxHearts,
  };
}

export async function getShopItems() {
  const supabase = await createClient();

  const { data: items, error } = await supabase
    .from("shop_items")
    .select("*")
    .eq("is_active", true);

  if (error) return { items: [], error: error.message };

  return { items: items || [] };
}
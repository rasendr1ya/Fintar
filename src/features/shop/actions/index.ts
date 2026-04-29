"use server";

import { createClient, getCurrentUser } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { calculateMaxHearts } from "@/lib/utils";
import { HEART_REFILL_PRICE } from "@/lib/constants";

export async function buyHeartRefill() {
  const user = await getCurrentUser();
  if (!user) return { error: "Not authenticated" };

  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("coins, xp, hearts")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile) return { error: "Profile not found" };

  if (profile.coins < HEART_REFILL_PRICE) {
    return { error: `Koin tidak cukup! Kamu butuh ${HEART_REFILL_PRICE} koin.` };
  }

  const maxHearts = calculateMaxHearts(profile.xp);

  const { data: updatedProfiles, error: updateError } = await supabase
    .from("profiles")
    .update({
      coins: profile.coins - HEART_REFILL_PRICE,
      hearts: maxHearts,
      last_heart_refill_at: new Date().toISOString(),
    })
    .eq("id", user.id)
    .gte("coins", HEART_REFILL_PRICE)
    .select();

  if (updateError || !updatedProfiles || updatedProfiles.length === 0) {
    return { error: "Coins tidak cukup atau transaksi duplikat." };
  }

  const { data: heartRefillItem } = await supabase
    .from("shop_items")
    .select("id")
    .eq("type", "HEART_REFILL")
    .eq("is_active", true)
    .maybeSingle();

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
    newCoins: profile.coins - HEART_REFILL_PRICE,
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
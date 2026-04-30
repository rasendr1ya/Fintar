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
        purchased_at: new Date().toISOString(),
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

export async function buyStreakFreeze() {
  const user = await getCurrentUser();
  if (!user) return { error: "Not authenticated" };

  const supabase = await createClient();

  // 1. Fetch profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("coins")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile) return { error: "Profile not found" };

  // 2. Fetch Streak Freeze item
  const { data: item } = await supabase
    .from("shop_items")
    .select("id, price_coins")
    .eq("type", "STREAK_FREEZE")
    .eq("is_active", true)
    .maybeSingle();

  if (!item) return { error: "Item tidak tersedia" };

  if (profile.coins < item.price_coins) {
    return { error: `Koin tidak cukup! Kamu butuh ${item.price_coins} koin.` };
  }

  // 3. Cek apakah sudah punya di inventory
  const { data: existingInventory } = await supabase
    .from("user_inventory")
    .select("id, quantity")
    .eq("user_id", user.id)
    .eq("item_id", item.id)
    .maybeSingle();

  if (existingInventory && existingInventory.quantity > 0) {
    return { error: "Streak Freeze sudah aktif" };
  }

  // 4. Deduct coins dengan guard konkurensi
  const { data: updatedProfiles, error: updateError } = await supabase
    .from("profiles")
    .update({ coins: profile.coins - item.price_coins })
    .eq("id", user.id)
    .gte("coins", item.price_coins)
    .select();

  if (updateError || !updatedProfiles || updatedProfiles.length === 0) {
    return { error: "Coins tidak cukup atau transaksi duplikat." };
  }

  // 5. Upsert inventory
  const { error: inventoryError } = await supabase
    .from("user_inventory")
    .upsert(
      {
        user_id: user.id,
        item_id: item.id,
        quantity: 1,
        purchased_at: new Date().toISOString(),
      },
      { onConflict: "user_id,item_id" }
    );

  if (inventoryError) {
    console.error("Error upserting inventory:", inventoryError);
    return { error: "Gagal menambahkan item ke inventory" };
  }

  revalidatePath("/shop");
  revalidatePath("/learn");

  return {
    success: true,
    newCoins: profile.coins - item.price_coins,
  };
}

export async function getUserInventory() {
  const user = await getCurrentUser();
  if (!user) return { items: [], error: "Not authenticated" };

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("user_inventory")
    .select("*")
    .eq("user_id", user.id);

  if (error) return { items: [], error: error.message };

  return { items: data || [] };
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
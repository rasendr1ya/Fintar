"use server";

import { createClient, getCurrentUser } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { HEART_REFILL_PRICE } from "@/lib/constants";

export async function buyHeartRefill() {
  const user = await getCurrentUser();
  if (!user) return { error: "Not authenticated" };

  const supabase = await createClient();

  const { data: rpcResult, error: rpcError } = await supabase.rpc(
    "buy_heart_refill",
    {
      p_user_id: user.id,
      p_price: HEART_REFILL_PRICE,
    }
  );

  if (rpcError || !rpcResult || rpcResult.length === 0) {
    return { error: "Gagal memproses pembelian" };
  }

  const result = rpcResult[0];

  if (!result.success) {
    return { error: result.error_msg ?? "Pembelian gagal" };
  }

  const { data: heartRefillItem, error: itemError } = await supabase
    .from("shop_items")
    .select("id")
    .eq("type", "HEART_REFILL")
    .eq("is_active", true)
    .maybeSingle();

  if (itemError) {
    console.error("[buyHeartRefill] Item fetch error:", itemError);
    return { error: "Gagal memuat item toko" };
  }

  if (heartRefillItem) {
    const { error: inventoryError } = await supabase
      .from("user_inventory")
      .insert({
        user_id: user.id,
        item_id: heartRefillItem.id,
        quantity: 1,
        purchased_at: new Date().toISOString(),
      });

    if (inventoryError) {
      console.error("[buyHeartRefill] Inventory insert error:", inventoryError);
      return { error: "Refill berhasil, tapi inventory gagal dicatat" };
    }
  }

  revalidatePath("/shop");
  revalidatePath("/learn");
  revalidatePath("/profile");
  revalidatePath("/quests");
  revalidatePath("/lesson", "layout");

  return {
    success: true,
    newCoins: result.new_coins,
    newHearts: result.new_hearts,
  };
}

export async function buyStreakFreeze() {
  const user = await getCurrentUser();
  if (!user) return { error: "Not authenticated" };

  const supabase = await createClient();

  // 1. Fetch profile
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("coins, streak_freeze_active")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError || !profile) return { error: "Profile not found" };

  // 2. Fetch Streak Freeze item
  const { data: item, error: itemError } = await supabase
    .from("shop_items")
    .select("id, price_coins")
    .eq("type", "STREAK_FREEZE")
    .eq("is_active", true)
    .maybeSingle();

  if (itemError || !item) return { error: "Item tidak tersedia" };

  // 3. Guard: sudah aktif
  if (profile.streak_freeze_active) {
    return { error: "Streak Freeze sudah aktif! Tidak perlu beli lagi." };
  }

  // 4. Guard: coins tidak cukup
  if (profile.coins < item.price_coins) {
    return { error: `Koin tidak cukup! Kamu butuh ${item.price_coins} koin.` };
  }

  // 5. Deduct coins & activate freeze dengan guard konkurensi
  const { data: updatedProfiles, error: updateError } = await supabase
    .from("profiles")
    .update({
      coins: profile.coins - item.price_coins,
      streak_freeze_active: true,
    })
    .eq("id", user.id)
    .gte("coins", item.price_coins)
    .select();

  if (updateError || !updatedProfiles || updatedProfiles.length === 0) {
    return { error: "Coins tidak cukup atau transaksi duplikat." };
  }

  // 6. Insert ke user_inventory
  const { error: inventoryError } = await supabase
    .from("user_inventory")
    .insert({
      user_id: user.id,
      item_id: item.id,
      quantity: 1,
      purchased_at: new Date().toISOString(),
    });

  if (inventoryError) {
    console.error("[buyStreakFreeze] Inventory insert error:", inventoryError);
    return { error: "Streak Freeze aktif, tapi inventory gagal dicatat" };
  }

  revalidatePath("/shop");
  revalidatePath("/learn");
  revalidatePath("/profile");

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
    .order("is_active", { ascending: false })
    .order("type");

  if (error) return { items: [], error: error.message };

  return { items: items || [] };
}

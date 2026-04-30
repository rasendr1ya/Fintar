import { getShopItems, getUserInventory } from "@/features/shop/actions";
import { getCurrentProfile } from "@/lib/supabase/server";
import { ShopContent } from "@/features/shop/components/ShopContent";
import { BASE_HEARTS } from "@/lib/constants";
import { calculateMaxHearts } from "@/lib/utils";

export default async function ShopPage() {
  const [itemsData, profile, inventoryData] = await Promise.all([
    getShopItems(),
    getCurrentProfile(),
    getUserInventory(),
  ]);

  const streakFreezeItem = itemsData.items?.find(
    (i) => i.type === "STREAK_FREEZE"
  );
  const hasStreakFreeze = streakFreezeItem
    ? (inventoryData.items?.some(
        (inv) =>
          inv.item_id === streakFreezeItem.id && (inv.quantity ?? 0) > 0
      ) ?? false)
    : false;

  return (
    <ShopContent
      items={itemsData.items || []}
      coins={profile?.coins ?? 0}
      hearts={profile?.hearts ?? BASE_HEARTS}
      maxHearts={profile ? calculateMaxHearts(profile.xp || 0) : BASE_HEARTS}
      hasStreakFreeze={hasStreakFreeze}
    />
  );
}
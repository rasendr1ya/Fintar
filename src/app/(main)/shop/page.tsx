import { getShopItems } from "@/features/shop/actions";
import { getCurrentProfile } from "@/lib/supabase/server";
import { ShopContent } from "@/features/shop/components/ShopContent";
import { BASE_HEARTS } from "@/lib/constants";
import { calculateMaxHearts } from "@/lib/utils";

export default async function ShopPage() {
  const [itemsData, profile] = await Promise.all([
    getShopItems(),
    getCurrentProfile(),
  ]);

  const streakFreezeActive = profile?.streak_freeze_active ?? false;

  return (
    <ShopContent
      items={itemsData.items || []}
      coins={profile?.coins ?? 0}
      hearts={profile?.hearts ?? BASE_HEARTS}
      maxHearts={profile ? calculateMaxHearts(profile.xp || 0) : BASE_HEARTS}
      streakFreezeActive={streakFreezeActive}
    />
  );
}

export const metadata = {
  title: "Shop - Fintar",
  description: "Tukar koin hasil belajarmu dengan power-up!",
};
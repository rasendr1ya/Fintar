import { getShopItems } from "@/features/shop/actions";
import { getCurrentProfile } from "@/lib/supabase/server";
import { ShopContent } from "@/features/shop/components/ShopContent";
import { BASE_HEARTS, MAX_HEARTS_CAP, XP_PER_LEVEL } from "@/lib/constants";

export default async function ShopPage() {
  const [itemsData, profile] = await Promise.all([
    getShopItems(),
    getCurrentProfile(),
  ]);

  return (
    <ShopContent
      items={itemsData.items || []}
      coins={profile?.coins ?? 0}
      hearts={profile?.hearts ?? BASE_HEARTS}
      maxHearts={profile ? Math.min(MAX_HEARTS_CAP, BASE_HEARTS + Math.floor((profile.xp || 0) / XP_PER_LEVEL)) : BASE_HEARTS}
    />
  );
}
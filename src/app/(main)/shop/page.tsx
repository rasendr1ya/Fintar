import { getShopItems } from "@/features/shop/actions";
import { getCurrentProfile } from "@/lib/supabase/server";
import { ShopContent } from "@/features/shop/components/ShopContent";

export default async function ShopPage() {
  const [itemsData, profile] = await Promise.all([
    getShopItems(),
    getCurrentProfile(),
  ]);

  return (
    <ShopContent
      items={itemsData.items || []}
      coins={profile?.coins ?? 0}
      hearts={profile?.hearts ?? 5}
      maxHearts={profile ? Math.min(15, 5 + Math.floor((profile.xp || 0) / 100)) : 5}
    />
  );
}
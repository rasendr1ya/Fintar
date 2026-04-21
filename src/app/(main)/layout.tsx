import { redirect } from "next/navigation";
import { getCurrentUser, getCurrentProfile } from "@/lib/supabase/server";
import { AppShell } from "@/components/layout/AppShell";
import { checkAndRefillHearts } from "@/features/learning/actions/lessons";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const profile = await getCurrentProfile();

  if (!profile?.onboarding_done) {
    redirect("/onboarding");
  }

  await checkAndRefillHearts();

  return (
    <AppShell
      hearts={profile?.hearts ?? 5}
      streak={profile?.streak ?? 0}
      coins={profile?.coins ?? 0}
      xp={profile?.xp ?? 0}
      lastHeartRefillAt={profile?.last_heart_refill_at}
      isAdmin={profile?.is_admin ?? false}
    >
      {children}
    </AppShell>
  );
}
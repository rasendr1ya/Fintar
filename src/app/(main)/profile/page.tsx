import { getCurrentProfile } from "@/lib/supabase/server";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { calculateLevel, calculateXPForLevel } from "@/lib/utils";
import { BASE_HEARTS, MAX_HEARTS_CAP, XP_PER_LEVEL } from "@/lib/constants";
import { ProfileContent } from "@/features/profile/components/ProfileContent";

export default async function ProfilePage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");

  const supabase = await createClient();

  const { count: lessonsCompleted } = await supabase
    .from("user_progress")
    .select("*", { count: "exact", head: true })
    .eq("user_id", profile.id);

  const level = calculateLevel(profile.xp);
  const nextLevelXP = calculateXPForLevel(level + 1);
  const xpProgress = ((profile.xp % XP_PER_LEVEL) / XP_PER_LEVEL) * 100;

  return (
    <ProfileContent
      username={profile.username || "Learner"}
      level={level}
      xp={profile.xp}
      xpProgress={xpProgress}
      nextLevelXP={nextLevelXP}
      streak={profile.streak}
      coins={profile.coins}
      hearts={profile.hearts}
      maxHearts={Math.min(MAX_HEARTS_CAP, BASE_HEARTS + (level - 1))}
      occupation={profile.occupation}
      financialGoal={profile.financial_goal}
      lessonsCompleted={lessonsCompleted || 0}
    />
  );
}

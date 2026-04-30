import { getLessonById, getChallengesByLessonId } from "@/features/learning/actions/lessons";
import { LessonContent } from "@/features/learning/components/LessonContent";
import { getCurrentUser, createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { Finny } from "@/components/mascot/Finny";
import { calculateMaxHearts } from "@/lib/utils";
import { BASE_HEARTS } from "@/lib/constants";

interface LessonPageProps {
  params: Promise<{ id: string }>;
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { id } = await params;

  // 1. Auth check
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login?redirect=/lesson/" + id);
  }

  // 2. Fetch lesson + challenges + profile in parallel
  const [lesson, { challenges }, profile] = await Promise.all([
    getLessonById(id),
    getChallengesByLessonId(id),
    (async () => {
      const supabase = await createClient();
      const { data } = await supabase
        .from("profiles")
        .select("hearts, xp, streak")
        .eq("id", user.id)
        .maybeSingle();
      return data;
    })(),
  ]);

  // 3. Not found
  if (!lesson) {
    notFound();
  }

  // 4. No challenges
  if (!challenges || challenges.length === 0) {
    return (
      <div className="min-h-screen bg-bg flex flex-col items-center justify-center px-4">
        <Finny pose="sad" size={120} />
        <p className="text-muted mt-4 text-center">Belum ada soal untuk pelajaran ini.</p>
      </div>
    );
  }

  const initialHearts = profile?.hearts ?? BASE_HEARTS;
  const maxHearts = calculateMaxHearts(profile?.xp ?? 0);
  const userXp = profile?.xp ?? 0;
  const initialStreak = profile?.streak ?? 0;

  return (
    <LessonContent
      lesson={lesson}
      challenges={challenges}
      initialHearts={initialHearts}
      maxHearts={maxHearts}
      userXp={userXp}
      initialStreak={initialStreak}
    />
  );
}

import { getLessonById, getChallengesByLessonId } from "@/features/learning/actions/lessons";
import { LessonContent } from "@/features/learning/components/LessonContent";
import { getCurrentProfile } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Finny } from "@/components/mascot/Finny";
import type { Challenge } from "@/types/database";

interface LessonPageProps {
  params: Promise<{ id: string }>;
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { id } = await params;
  const profile = await getCurrentProfile();
  const lesson = await getLessonById(id);
  const { challenges } = await getChallengesByLessonId(id);

  if (!lesson) {
    return (
      <div className="min-h-screen bg-bg flex flex-col items-center justify-center px-4">
        <Finny pose="sad" size={120} />
        <p className="text-muted mt-4 text-center">Lesson not found</p>
      </div>
    );
  }

  if (!challenges || challenges.length === 0) {
    redirect("/learn");
  }

  return (
    <LessonContent
      lesson={lesson}
      challenges={challenges as Challenge[]}
      initialHearts={profile?.hearts ?? 5}
    />
  );
}
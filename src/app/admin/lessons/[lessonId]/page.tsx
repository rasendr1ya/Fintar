import { getLessonById } from "@/features/admin/actions";
import { AdminHeader } from "@/features/admin/components";
import { LessonForm } from "@/features/admin/components/LessonForm";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/Button";

export const metadata = {
  title: "Edit Lesson — Admin Fintar",
};

export default async function EditLessonPage({
  params,
}: {
  params: Promise<{ lessonId: string }>;
}) {
  const { lessonId } = await params;
  const result = await getLessonById(lessonId);

  if ("error" in result || !result.data) {
    notFound();
  }

  const lesson = result.data;

  return (
    <div>
      <div className="mb-8">
        <Link href="/admin/lessons" className="text-sm text-primary hover:underline mb-2 inline-block">
          &larr; Kembali ke Lesson CMS
        </Link>
        <AdminHeader
          title="Edit Lesson"
          description={lesson.title}
        />
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-2xl border border-border p-6">
          <LessonForm unitId={lesson.unit_id} lesson={lesson} />
        </div>

        <div className="bg-white rounded-2xl border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-text">
              Challenge ({lesson.challenges?.length || 0})
            </h2>
          </div>

          {!lesson.challenges || lesson.challenges.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted mb-4">Belum ada challenge untuk lesson ini</p>
              <p className="text-sm text-muted">
                Buka halaman Lesson CMS utama untuk menambah challenge.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {lesson.challenges.map((challenge, idx) => (
                <div
                  key={challenge.id}
                  className="flex items-start gap-3 bg-gray-50 p-3 rounded-xl"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          challenge.type === "SELECT"
                            ? "bg-xp/10 text-xp"
                            : "bg-primary-50 text-primary"
                        }`}
                      >
                        {challenge.type}
                      </span>
                      <span className="text-xs text-muted">Q{idx + 1}</span>
                    </div>
                    <p className="text-sm font-medium text-text mb-2">{challenge.question}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {(Array.isArray(challenge.options) ? challenge.options : []).map(
                        (opt: string, i: number) => (
                          <span
                            key={i}
                            className={`px-2 py-0.5 rounded-lg text-xs ${
                              opt === challenge.correct_answer
                                ? "bg-success/10 text-success font-medium"
                                : "bg-gray-200 text-muted"
                            }`}
                          >
                            {opt}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-4 pt-4 border-t border-border">
            <Link href={`/admin/lessons`}>
              <Button variant="ghost" size="sm">
                &larr; Kembali ke Daftar Lesson
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

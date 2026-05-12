"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  createLesson,
  updateLesson,
  deleteLesson,
} from "@/features/admin/actions";
import type { Lesson } from "@/types/database";

const lessonSchema = z.object({
  title: z.string().min(1, "Judul wajib diisi").max(100, "Judul terlalu panjang"),
});

type LessonFormData = z.infer<typeof lessonSchema>;

interface LessonFormProps {
  unitId: string;
  lesson?: Lesson;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function LessonForm({ unitId, lesson, onSuccess, onCancel }: LessonFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LessonFormData>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      title: lesson?.title || "",
    },
  });

  const onSubmit = async (data: LessonFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      let result;
      if (lesson) {
        result = await updateLesson(lesson.id, { title: data.title });
      } else {
        result = await createLesson({ unit_id: unitId, title: data.title });
      }

      if ("error" in result && result.error) {
        setError(result.error);
        return;
      }

      router.refresh();
      if (onSuccess) onSuccess();
    } catch {
      setError("Terjadi kesalahan");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!lesson) return;
    if (!confirm("Yakin ingin menghapus lesson ini? Semua challenge di dalamnya juga akan dihapus.")) return;

    setIsDeleting(true);
    const result = await deleteLesson(lesson.id);

    if ("error" in result && result.error) {
      setError(result.error);
      setIsDeleting(false);
      return;
    }

    router.refresh();
    if (onSuccess) onSuccess();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-hearts text-sm">
          {error}
        </div>
      )}

      <Input
        label="Judul Lesson"
        {...register("title")}
        placeholder="Contoh: Mengenal Budgeting"
        error={errors.title?.message}
      />

      <div className="flex items-center gap-3">
        <Button type="submit" isLoading={isSubmitting} size="sm">
          {lesson ? "Simpan" : "Tambah Lesson"}
        </Button>
        {lesson && (
          <Button
            type="button"
            variant="danger"
            size="sm"
            isLoading={isDeleting}
            onClick={handleDelete}
          >
            Hapus
          </Button>
        )}
        {onCancel && (
          <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
            Batal
          </Button>
        )}
      </div>
    </form>
  );
}

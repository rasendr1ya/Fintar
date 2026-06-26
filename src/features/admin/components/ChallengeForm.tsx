"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { createChallenge, updateChallenge, uploadChallengeImage } from "@/features/admin/actions";
import type { Challenge } from "@/types/database";
import { XMarkIcon, CheckIcon, PhotoIcon } from "@heroicons/react/24/outline";
import { showSuccess, showError } from "@/lib/toast";

const challengeSchema = z.object({
  type: z.enum(["SELECT", "ASSIST"]),
  question: z.string().min(1, "Pertanyaan wajib diisi"),
  correct_answer: z.string().min(1, "Pilih jawaban benar"),
});

type ChallengeFormData = z.infer<typeof challengeSchema>;

interface ChallengeFormProps {
  lessonId: string;
  challenge?: Challenge;
  onClose: () => void;
  onSave: (challenge: Challenge) => void;
}

export function ChallengeForm({ lessonId, challenge, onClose, onSave }: ChallengeFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(challenge?.image_url ?? null);
  const [imagePreview, setImagePreview] = useState<string | null>(challenge?.image_url ?? null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [options, setOptions] = useState<string[]>(
    challenge?.options && Array.isArray(challenge.options) && challenge.options.length >= 2
      ? challenge.options
      : ["", "", "", ""]
  );

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ChallengeFormData>({
    resolver: zodResolver(challengeSchema),
    defaultValues: {
      type: challenge?.type || "SELECT",
      question: challenge?.question || "",
      correct_answer: challenge?.correct_answer || "",
    },
  });

  const selectedType = watch("type");
  const correctAnswer = watch("correct_answer");

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const addOption = () => {
    setOptions([...options, ""]);
  };

  const removeOption = (index: number) => {
    if (options.length <= 2) return;
    setOptions(options.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: ChallengeFormData) => {
    const validOptions = options.filter((o) => o.trim());
    if (validOptions.length < 2) {
      setError("Minimal 2 pilihan jawaban");
      return;
    }
    if (!validOptions.includes(data.correct_answer.trim())) {
      setError("Jawaban benar harus cocok dengan salah satu pilihan");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      let result;
      if (challenge) {
        result = await updateChallenge(challenge.id, {
          type: data.type,
          question: data.question,
          options: validOptions,
          correct_answer: data.correct_answer.trim(),
          image_url: imageUrl,
        });
      } else {
        result = await createChallenge({
          lesson_id: lessonId,
          type: data.type,
          question: data.question,
          options: validOptions,
          correct_answer: data.correct_answer.trim(),
          image_url: imageUrl,
        });
      }

      if ("error" in result && result.error) {
        setError(result.error);
        showError("Gagal menyimpan challenge");
        return;
      }

      showSuccess(challenge ? "Challenge berhasil disimpan!" : "Challenge berhasil ditambahkan!");
      if ("data" in result && result.data) {
        onSave(result.data);
      }
    } catch {
      setError("Terjadi kesalahan");
      showError("Terjadi kesalahan. Coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-bold text-text">
            {challenge ? "Edit Challenge" : "Tambah Challenge"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-hearts text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-text mb-2">
              Tipe Pertanyaan
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setValue("type", "SELECT")}
                className={`flex-1 px-4 py-3 rounded-xl border-2 font-medium transition-all text-sm ${
                  selectedType === "SELECT"
                    ? "border-primary bg-primary-50 text-primary"
                    : "border-border hover:border-gray-300"
                }`}
              >
                SELECT
                <p className="text-xs font-normal text-muted mt-1">
                  Pilihan ganda
                </p>
              </button>
              <button
                type="button"
                onClick={() => setValue("type", "ASSIST")}
                className={`flex-1 px-4 py-3 rounded-xl border-2 font-medium transition-all text-sm ${
                  selectedType === "ASSIST"
                    ? "border-primary bg-primary-50 text-primary"
                    : "border-border hover:border-gray-300"
                }`}
              >
                ASSIST
                <p className="text-xs font-normal text-muted mt-1">
                  Isi titik-titik
                </p>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-1.5">
              Pertanyaan
            </label>
            <textarea
              {...register("question")}
              rows={2}
              className="w-full px-4 py-3 rounded-2xl border-2 border-border bg-white focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-muted resize-none"
              placeholder="Tulis pertanyaan..."
            />
            {errors.question && (
              <p className="mt-1.5 text-sm text-hearts">{errors.question.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-1.5">
              Gambar Soal (opsional)
            </label>

            {imagePreview ? (
              <div className="relative w-full max-w-xs h-40 rounded-2xl overflow-hidden border-2 border-border mb-3">
                <Image
                  src={imagePreview}
                  alt="Preview gambar soal"
                  fill
                  unoptimized
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImageUrl(null);
                    setImagePreview(null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  className="absolute top-2 right-2 p-1.5 bg-white/90 hover:bg-white rounded-lg shadow-sm transition-colors"
                >
                  <XMarkIcon className="w-4 h-4 text-hearts" />
                </button>
              </div>
            ) : null}

            <div className="flex gap-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setImagePreview(URL.createObjectURL(file));
                  setIsUploadingImage(true);
                  const formData = new FormData();
                  formData.append("file", file);
                  const result = await uploadChallengeImage(formData);
                  if (result.success && result.url) {
                    setImageUrl(result.url);
                    setImagePreview(result.url);
                  } else {
                    setError(result.error || "Gagal mengupload gambar");
                    setImagePreview(null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }
                  setIsUploadingImage(false);
                }}
                className="hidden"
                id="challenge-image-upload"
              />
              <label
                htmlFor="challenge-image-upload"
                className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl border-2 border-dashed border-border hover:border-primary hover:bg-primary-50/30 cursor-pointer transition-colors text-sm font-medium text-muted hover:text-primary"
              >
                <PhotoIcon className="w-5 h-5" />
                {imagePreview ? "Ganti Gambar" : "Pilih Gambar"}
              </label>
            </div>

            {isUploadingImage && (
              <p className="mt-2 text-sm text-primary flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Mengupload...
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-2">
              Pilihan Jawaban
            </label>
            <div className="space-y-2">
              {options.map((opt, index) => (
                <div key={index} className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setValue("correct_answer", opt.trim())}
                    className={`shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                      correctAnswer === opt.trim() && opt.trim() !== ""
                        ? "border-success bg-success"
                        : "border-border hover:border-gray-400"
                    }`}
                    title="Jadikan jawaban benar"
                  >
                    {correctAnswer === opt.trim() && opt.trim() !== "" && (
                      <CheckIcon className="w-4 h-4 text-white" />
                    )}
                  </button>
                  <input
                    type="text"
                    value={opt}
                    onChange={(e) => updateOption(index, e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded-xl border-2 border-border bg-white focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-muted text-sm"
                    placeholder={`Pilihan ${index + 1}`}
                  />
                  {options.length > 2 && (
                    <button
                      type="button"
                      onClick={() => removeOption(index)}
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                    >
                      <XMarkIcon className="w-4 h-4 text-hearts" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addOption}
              className="mt-2 text-sm text-primary font-medium hover:underline"
            >
              + Tambah Pilihan
            </button>
            {errors.correct_answer && (
              <p className="mt-1.5 text-sm text-hearts">Pilih jawaban benar</p>
            )}
          </div>

          <div className="flex items-center gap-4 pt-4 border-t border-border">
            <Button type="submit" isLoading={isSubmitting}>
              {challenge ? "Simpan Perubahan" : "Tambah Challenge"}
            </Button>
            <Button type="button" variant="ghost" onClick={onClose}>
              Batal
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

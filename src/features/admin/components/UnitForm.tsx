"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { createUnit, updateUnit } from "@/features/admin/actions";
import type { Unit } from "@/types/database";
import { showSuccess, showError } from "@/lib/toast";

const unitSchema = z.object({
  title: z.string().min(1, "Judul wajib diisi").max(100, "Judul terlalu panjang"),
  description: z.string().max(500, "Deskripsi terlalu panjang").optional(),
  color_theme: z.string().min(1, "Tema warna wajib dipilih"),
});

type UnitFormData = z.infer<typeof unitSchema>;

const colorThemes = [
  { value: "purple", label: "Ungu", class: "bg-purple-500" },
  { value: "blue", label: "Biru", class: "bg-blue-500" },
  { value: "green", label: "Hijau", class: "bg-green-500" },
  { value: "yellow", label: "Kuning", class: "bg-yellow-500" },
  { value: "red", label: "Merah", class: "bg-red-500" },
  { value: "pink", label: "Pink", class: "bg-pink-500" },
  { value: "indigo", label: "Indigo", class: "bg-indigo-500" },
  { value: "teal", label: "Teal", class: "bg-teal-500" },
];

interface UnitFormProps {
  unit?: Unit;
}

export function UnitForm({ unit }: UnitFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<UnitFormData>({
    resolver: zodResolver(unitSchema),
    defaultValues: {
      title: unit?.title || "",
      description: unit?.description || "",
      color_theme: unit?.color_theme || "purple",
    },
  });

  const selectedColor = watch("color_theme");

  const onSubmit = async (data: UnitFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      let result;
      if (unit) {
        result = await updateUnit(unit.id, {
          title: data.title,
          description: data.description || null,
          color_theme: data.color_theme,
        });
      } else {
        result = await createUnit({
          title: data.title,
          description: data.description || null,
          color_theme: data.color_theme,
        });
      }

      if ("error" in result && result.error) {
        setError(result.error);
        showError("Gagal menyimpan unit");
        return;
      }

      showSuccess(unit ? "Perubahan berhasil disimpan!" : "Unit berhasil dibuat!");
      router.push("/admin/lessons");
      router.refresh();
    } catch {
      setError("Terjadi kesalahan");
      showError("Terjadi kesalahan. Coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-xl">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-hearts text-sm">
          {error}
        </div>
      )}

      <Input
        label="Judul Unit"
        {...register("title")}
        placeholder="Contoh: Budgeting Basics"
        error={errors.title?.message}
      />

      <div>
        <label className="block text-sm font-medium text-text mb-1.5">
          Deskripsi
        </label>
        <textarea
          {...register("description")}
          rows={3}
          className="w-full px-4 py-3 rounded-2xl border-2 border-border bg-white focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-muted resize-none"
          placeholder="Deskripsi singkat tentang unit ini..."
        />
        {errors.description && (
          <p className="mt-1.5 text-sm text-hearts">{errors.description.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-text mb-3">
          Tema Warna
        </label>
        <div className="flex flex-wrap gap-3">
          {colorThemes.map((color) => (
            <button
              key={color.value}
              type="button"
              onClick={() => setValue("color_theme", color.value)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 transition-all ${
                selectedColor === color.value
                  ? "border-primary bg-primary-50"
                  : "border-border hover:border-gray-300"
              }`}
            >
              <div className={`w-5 h-5 rounded-full ${color.class}`} />
              <span className="text-sm font-medium">{color.label}</span>
            </button>
          ))}
        </div>
        {errors.color_theme && (
          <p className="mt-1.5 text-sm text-hearts">{errors.color_theme.message}</p>
        )}
      </div>

      <div className="flex items-center gap-4 pt-4">
        <Button type="submit" isLoading={isSubmitting}>
          {unit ? "Simpan Perubahan" : "Buat Unit"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.push("/admin/lessons")}
        >
          Batal
        </Button>
      </div>
    </form>
  );
}

"use client";

import { Button } from "@/components/ui/Button";
import { Finny } from "@/components/mascot/Finny";
import { useRouter } from "next/navigation";

interface LessonErrorFallbackProps {
  error?: Error;
  reset?: () => void;
}

export function LessonErrorFallback({ error, reset }: LessonErrorFallbackProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-8 text-center">
      <Finny size={150} pose="sad" className="mb-8" />
      <h1 className="text-3xl font-bold text-gray-800 mb-3">
        Lesson Tidak Dapat Dimuat
      </h1>
      <p className="text-gray-600 mb-8 max-w-md">
        Terjadi kesalahan saat memuat pelajaran ini. 
        Jangan khawatir, hearts kamu tidak berkurang!
      </p>
      <div className="flex gap-4">
        {reset && (
          <Button onClick={reset} variant="primary" size="lg">
            Coba Lagi
          </Button>
        )}
        <Button onClick={() => router.push("/learn")} variant="outline" size="lg">
          Kembali ke Beranda
        </Button>
      </div>
      {process.env.NODE_ENV === "development" && error && (
        <div className="mt-8 w-full max-w-2xl">
          <details className="text-left">
            <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
              Detail Error (Development Only)
            </summary>
            <pre className="mt-2 p-4 bg-red-50 text-red-800 text-xs rounded-lg overflow-auto">
              {error.message}
              {"\n\n"}
              {error.stack}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
}
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Finny } from "@/components/mascot/Finny";

export default function LessonError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    console.error("Lesson error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col items-center justify-center p-8 text-center">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-20 h-20 bg-red-100 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-40 right-20 w-32 h-32 bg-orange-100 rounded-full blur-3xl opacity-40" />
      </div>

      <div className="relative z-10">
        {/* Finny with distress indicators */}
        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-40 h-40 bg-red-500/5 rounded-full blur-2xl animate-pulse" />
          </div>
          <Finny size={160} pose="sad" className="relative drop-shadow-xl" />
          
          {/* Little bandage */}
          <div className="absolute top-3 right-8 w-5 h-2 bg-white rounded-sm rotate-[-25deg] shadow border border-gray-200" />
          
          {/* Speech bubble */}
          <div className="absolute -top-4 -right-4 bg-white rounded-xl px-3 py-1.5 shadow-lg border border-gray-100">
            <span className="text-sm">Aduh...</span>
          </div>
        </div>

        {/* Warning icon */}
        <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center shadow-inner">
          <span className="text-3xl">💔</span>
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-3">
          Lesson Gagal Dimuat
        </h1>
        <p className="text-gray-600 mb-2 max-w-md mx-auto">
          Ada masalah saat memuat pelajaran ini.
        </p>
        <p className="text-sm text-green-600 font-medium mb-8">
          Jangan khawatir — hearts kamu tidak berkurang!
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={reset}
            size="lg"
            className="bg-[#22C55E] hover:bg-[#16A34A] border-b-4 border-[#166534] text-white rounded-2xl"
          >
            Coba Lagi
          </Button>
          <Button
            onClick={() => router.push("/learn")}
            variant="outline"
            size="lg"
            className="rounded-2xl"
          >
            Kembali ke Belajar
          </Button>
        </div>

        {process.env.NODE_ENV === "development" && (
          <details className="mt-10 text-left max-w-xl w-full mx-auto">
            <summary className="cursor-pointer text-sm text-gray-400 hover:text-gray-600">
              Error Details (Dev Only)
            </summary>
            <pre className="mt-2 p-4 bg-red-50 text-red-800 text-xs rounded-xl overflow-auto border border-red-100">
              {error.message}
              {"\n\n"}
              {error.stack}
              {error.digest && `\n\nDigest: ${error.digest}`}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}
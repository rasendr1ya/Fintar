"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Finny } from "@/components/mascot/Finny";

export default function LearnError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    console.error("Learn page error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-orange-500/10 rounded-full blur-2xl" />
        <Finny size={140} pose="sad" className="relative drop-shadow-lg" />
      </div>
      
      <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-orange-100 flex items-center justify-center">
        <span className="text-2xl">📚</span>
      </div>

      <h2 className="text-2xl font-bold text-gray-800 mb-2">
        Gagal Memuat Learning Path
      </h2>
      <p className="text-gray-600 mb-6 max-w-md">
        Tenang, progress belajarmu tetap tersimpan! 
        Coba refresh halaman atau kembali nanti.
      </p>
      
      <div className="flex gap-3">
        <Button
          onClick={reset}
          className="bg-[#22C55E] hover:bg-[#16A34A] border-b-4 border-[#166534] text-white rounded-xl"
        >
          Coba Lagi
        </Button>
        <Button
          onClick={() => router.push("/")}
          variant="outline"
          className="rounded-xl"
        >
          Ke Home
        </Button>
      </div>

      {process.env.NODE_ENV === "development" && (
        <details className="mt-8 text-left max-w-lg w-full">
          <summary className="cursor-pointer text-sm text-gray-400 hover:text-gray-600">
            Debug Info
          </summary>
          <pre className="mt-2 p-3 bg-gray-100 text-xs rounded-lg overflow-auto text-gray-700">
            {error.message}
            {error.digest && `\nDigest: ${error.digest}`}
          </pre>
        </details>
      )}
    </div>
  );
}
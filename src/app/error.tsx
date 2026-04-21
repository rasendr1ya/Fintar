"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Finny } from "@/components/mascot/Finny";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 flex flex-col items-center justify-center relative overflow-hidden px-4">
      
      {/* Glitch/static background effect */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,255,255,0.03)_2px,rgba(255,255,255,0.03)_4px)]" />
      </div>

      {/* Broken/glitchy elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Scattered broken pieces */}
        <div className="absolute top-[20%] left-[10%] w-8 h-8 border-2 border-red-500/30 rotate-45 animate-pulse" />
        <div className="absolute top-[30%] right-[15%] w-6 h-6 border-2 border-orange-500/20 rotate-12" />
        <div className="absolute bottom-[35%] left-[20%] w-4 h-4 bg-red-500/10 rotate-45" />
        <div className="absolute top-[40%] right-[25%] w-10 h-1 bg-yellow-500/20 rotate-[-20deg]" />
        <div className="absolute bottom-[40%] right-[10%] w-1 h-8 bg-orange-500/15 rotate-[30deg]" />
        
        {/* Warning stripes */}
        <div className="absolute bottom-0 left-0 right-0 h-2 bg-[repeating-linear-gradient(90deg,#EF4444,#EF4444_20px,#1F2937_20px,#1F2937_40px)] opacity-30" />
      </div>

      {/* Smoke/steam particles */}
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="absolute w-4 h-4 bg-gray-400/20 rounded-full blur-sm animate-float"
          style={{
            bottom: `${30 + Math.random() * 20}%`,
            left: `${40 + Math.random() * 20}%`,
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${3 + Math.random() * 2}s`,
          }}
        />
      ))}

      {/* Main content */}
      <div className="relative z-10 text-center max-w-md">
        
        {/* Finny looking sad/broken with warning signs */}
        <div className="relative mb-8">
          {/* Warning glow */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-48 h-48 bg-red-500/10 rounded-full blur-3xl animate-pulse" />
          </div>
          
          {/* Broken gear icons around Finny */}
          <div className="absolute -left-4 top-1/2 -translate-y-1/2 text-4xl opacity-30 animate-spin" style={{ animationDuration: '8s' }}>
            ⚙️
          </div>
          <div className="absolute -right-2 top-1/3 text-2xl opacity-20 animate-spin" style={{ animationDuration: '6s', animationDirection: 'reverse' }}>
            ⚙️
          </div>
          
          {/* Finny */}
          <div className="relative">
            <Finny size={150} pose="sad" className="drop-shadow-2xl mx-auto" />
            
            {/* Bandage on Finny */}
            <div className="absolute top-4 right-12 w-6 h-2 bg-white rounded-sm rotate-[-30deg] shadow-sm" />
          </div>
          
          {/* Speech bubble */}
          <div className="absolute -top-2 -right-2 sm:right-4 bg-white rounded-2xl px-4 py-2 shadow-lg">
            <span className="text-gray-700 font-semibold text-sm">Ada yang rusak...</span>
            <div className="absolute -bottom-2 left-6 w-4 h-4 bg-white rotate-45" />
          </div>
        </div>

        {/* Error icon */}
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
          <span className="text-3xl">⚠️</span>
        </div>

        {/* Message */}
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
          Oops! Ada Kesalahan
        </h2>
        <p className="text-gray-400 mb-8 leading-relaxed">
          Maaf, sepertinya ada yang tidak beres di server kami. Tim teknis Finny sedang bekerja keras untuk memperbaikinya!
        </p>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={() => reset()}
            size="lg"
            className="bg-[#22C55E] hover:bg-[#16A34A] border-b-4 border-[#166534] text-white rounded-2xl"
          >
            Coba Lagi
          </Button>
          <Button
            href="/"
            variant="outline"
            size="lg"
            className="border-gray-600 text-white hover:bg-white/10 rounded-2xl"
          >
            Kembali ke Home
          </Button>
        </div>

        {/* Error code */}
        <p className="mt-8 text-gray-600 text-sm font-mono">
          Error Code: 500 | {error.digest || "INTERNAL_SERVER_ERROR"}
        </p>
      </div>
    </div>
  );
}
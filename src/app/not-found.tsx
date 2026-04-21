import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Finny } from "@/components/mascot/Finny";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1e1b4b] via-[#312e81] to-[#3730a3] flex flex-col items-center justify-center relative overflow-hidden px-4">
      
      {/* Stars in the sky */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(40)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              top: `${Math.random() * 60}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              opacity: Math.random() * 0.7 + 0.3,
            }}
          />
        ))}
      </div>

      {/* Moon */}
      <div className="absolute top-8 right-8 sm:top-12 sm:right-16">
        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-yellow-100 to-yellow-200 shadow-lg shadow-yellow-200/20 relative">
          <div className="absolute top-1.5 right-1.5 w-3 h-3 rounded-full bg-yellow-300/30" />
          <div className="absolute bottom-3 left-2 w-1.5 h-1.5 rounded-full bg-yellow-300/20" />
        </div>
      </div>

      {/* Main content - centered */}
      <div className="relative z-10 text-center max-w-lg mx-auto">
        
        {/* Finny with speech bubble */}
        <div className="relative inline-block mb-6">
          {/* Speech bubble - positioned relative to Finny */}
          <div className="absolute -top-2 left-full ml-2 bg-white rounded-2xl px-4 py-2 shadow-lg whitespace-nowrap">
            <span className="text-gray-700 font-semibold text-sm">Aku tersesat...</span>
            {/* Bubble tail */}
            <div className="absolute top-1/2 -left-2 -translate-y-1/2 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-white" />
          </div>
          
          {/* Finny */}
          <div className="animate-float">
            <Finny size={140} pose="sad" className="drop-shadow-2xl" />
          </div>
        </div>

        {/* 404 Text - Big and behind */}
        <div className="relative">
          <h1 className="text-[120px] sm:text-[160px] font-black text-white/5 leading-none select-none">
            404
          </h1>
          
          {/* Message - overlaid on 404 */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              Halaman Tidak Ditemukan
            </h2>
            <p className="text-white/70 mb-8 leading-relaxed max-w-sm">
              Sepertinya kamu tersesat di hutan. Jangan khawatir, Finny akan membantumu kembali ke jalan yang benar!
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-4">
          <Button
            href="/"
            size="lg"
            className="bg-[#22C55E] hover:bg-[#16A34A] border-b-4 border-[#166534] text-white rounded-2xl"
          >
            Kembali ke Home
          </Button>
          <Button
            href="/learn"
            variant="outline"
            size="lg"
            className="border-white/30 text-white hover:bg-white/10 rounded-2xl"
          >
            Mulai Belajar
          </Button>
        </div>
      </div>

      {/* Forest scene at bottom */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
        {/* Back forest layer */}
        <svg className="w-full h-32 sm:h-40" viewBox="0 0 1440 160" preserveAspectRatio="none">
          <path
            d="M0 160 L0 100 
               Q60 60 120 100 Q180 50 240 100 Q300 70 360 100 Q420 40 480 100 
               Q540 60 600 100 Q660 50 720 100 Q780 70 840 100 Q900 40 960 100 
               Q1020 60 1080 100 Q1140 50 1200 100 Q1260 70 1320 100 Q1380 55 1440 100 
               L1440 160 Z"
            fill="#1e1b4b"
          />
        </svg>
        
        {/* Front forest layer */}
        <svg className="w-full h-24 sm:h-32 -mt-16 sm:-mt-20" viewBox="0 0 1440 130" preserveAspectRatio="none">
          <path
            d="M0 130 L0 80 
               Q80 40 160 80 Q240 30 320 80 Q400 50 480 80 Q560 20 640 80 
               Q720 45 800 80 Q880 35 960 80 Q1040 55 1120 80 Q1200 25 1280 80 Q1360 50 1440 80 
               L1440 130 Z"
            fill="#312e81"
          />
        </svg>
        
        {/* Ground */}
        <div className="h-12 sm:h-16 bg-gradient-to-t from-[#166534] to-[#15803d] -mt-8 sm:-mt-10" />
        
        {/* Grass details */}
        <div className="absolute bottom-2 left-[10%]">
          <svg width="40" height="24" viewBox="0 0 40 24" fill="none">
            <path d="M5 24 Q7 14 4 4 Q10 14 12 24" fill="#22C55E" opacity="0.8"/>
            <path d="M18 24 Q20 10 16 2 Q24 12 26 24" fill="#4ADE80" opacity="0.7"/>
            <path d="M32 24 Q34 16 30 8 Q38 18 40 24" fill="#22C55E" opacity="0.8"/>
          </svg>
        </div>
        <div className="absolute bottom-2 right-[15%]">
          <svg width="32" height="20" viewBox="0 0 32 20" fill="none">
            <path d="M4 20 Q6 12 3 4 Q9 12 11 20" fill="#4ADE80" opacity="0.7"/>
            <path d="M18 20 Q20 8 16 1 Q24 10 26 20" fill="#22C55E" opacity="0.8"/>
          </svg>
        </div>
      </div>

      {/* Fireflies */}
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 bg-yellow-200 rounded-full animate-pulse"
          style={{
            bottom: `${15 + Math.random() * 25}%`,
            left: `${10 + Math.random() * 80}%`,
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${1.5 + Math.random()}s`,
            opacity: 0.7,
            boxShadow: '0 0 10px 3px rgba(254, 240, 138, 0.6)',
          }}
        />
      ))}

      {/* Floating question marks */}
      <div className="absolute top-[15%] left-[10%] text-3xl text-white/10 animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }}>?</div>
      <div className="absolute top-[20%] right-[12%] text-2xl text-white/10 animate-bounce" style={{ animationDelay: '1s', animationDuration: '3.5s' }}>?</div>
      <div className="absolute top-[30%] left-[20%] text-xl text-white/5 animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '4s' }}>?</div>
    </div>
  );
}
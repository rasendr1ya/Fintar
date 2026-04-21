"use client";

import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { Finny } from "@/components/mascot/Finny";
import { Button } from "@/components/ui/Button";
import { HeartIcon, SparklesIcon, StarIcon } from "@heroicons/react/24/solid";
import { useFintarSound } from "@/hooks/use-fintar-sound";

interface LevelUpModalProps {
  newLevel: number;
  onClose: () => void;
}

export function LevelUpModal({ newLevel, onClose }: LevelUpModalProps) {
  const [showContent, setShowContent] = useState(false);
  const [showRewards, setShowRewards] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const { playLevelUp, playSound, playCoin } = useFintarSound();

  // Staggered animations and sounds
  useEffect(() => {
    // Play level up sound immediately
    playLevelUp();
    
    // Fire epic confetti burst
    fireConfetti();
    
    // Stagger content appearance for dramatic effect
    const contentTimer = setTimeout(() => {
      setShowContent(true);
      playSound("fanfare");
    }, 300);
    
    const rewardsTimer = setTimeout(() => {
      setShowRewards(true);
      playCoin();
    }, 800);
    
    const buttonTimer = setTimeout(() => {
      setShowButton(true);
    }, 1200);

    return () => {
      clearTimeout(contentTimer);
      clearTimeout(rewardsTimer);
      clearTimeout(buttonTimer);
    };
  }, [playLevelUp, playCoin]);

  const fireConfetti = () => {
    const duration = 4000;
    const end = Date.now() + duration;

    // Initial big burst
    confetti({
      particleCount: 100,
      spread: 100,
      origin: { y: 0.6 },
      colors: ["#FFD700", "#FFA500", "#FF6B35", "#22C55E", "#3B82F6"],
    });

    // Continuous side cannons
    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors: ["#FFD700", "#FFA500", "#FF4500"],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: ["#FFD700", "#FFA500", "#FF4500"],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();

    // Bonus firework bursts
    setTimeout(() => {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { x: 0.3, y: 0.5 },
        colors: ["#22C55E", "#4ADE80"],
      });
    }, 500);

    setTimeout(() => {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { x: 0.7, y: 0.5 },
        colors: ["#3B82F6", "#60A5FA"],
      });
    }, 1000);

    // Star shower
    setTimeout(() => {
      confetti({
        particleCount: 30,
        spread: 180,
        origin: { y: 0 },
        gravity: 0.8,
        scalar: 1.2,
        shapes: ["star"],
        colors: ["#FFD700", "#FFC107"],
      });
    }, 1500);
  };

  const oldMaxHearts = Math.min(15, 5 + (newLevel - 2));
  const newMaxHearts = Math.min(15, 5 + (newLevel - 1));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      {/* Background glow effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-yellow-500/30 via-orange-500/20 to-transparent rounded-full animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-radial from-xp/40 to-transparent rounded-full animate-ping" style={{ animationDuration: "2s" }} />
      </div>

      {/* Modal card */}
      <div 
        className={`
          bg-gradient-to-b from-white via-white to-amber-50/50 
          rounded-[2rem] w-full max-w-sm p-8 text-center relative overflow-hidden 
          shadow-[0_0_60px_rgba(255,215,0,0.3)] 
          border-4 border-yellow-400/50
          transform transition-all duration-500 ease-out
          ${showContent ? "scale-100 opacity-100" : "scale-90 opacity-0"}
        `}
      >
        {/* Decorative sparkles */}
        <div className="absolute top-4 left-4 text-yellow-400 animate-bounce" style={{ animationDelay: "0.1s" }}>
          <SparklesIcon className="w-6 h-6" />
        </div>
        <div className="absolute top-6 right-6 text-yellow-500 animate-bounce" style={{ animationDelay: "0.3s" }}>
          <StarIcon className="w-5 h-5" />
        </div>
        <div className="absolute bottom-20 left-6 text-orange-400 animate-bounce" style={{ animationDelay: "0.5s" }}>
          <StarIcon className="w-4 h-4" />
        </div>
        <div className="absolute bottom-32 right-4 text-yellow-400 animate-bounce" style={{ animationDelay: "0.2s" }}>
          <SparklesIcon className="w-5 h-5" />
        </div>

        {/* Decorative Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 bg-gradient-to-b from-yellow-400/30 via-orange-400/20 to-transparent rounded-full blur-3xl -z-10" />

        {/* Finny celebrating with bounce animation */}
        <div className={`
          mb-4 flex justify-center transform transition-all duration-700
          ${showContent ? "translate-y-0 opacity-100" : "-translate-y-10 opacity-0"}
        `}>
          <div className="animate-bounce" style={{ animationDuration: "1s" }}>
            <Finny pose="celebrate" size={130} />
          </div>
        </div>

        {/* Level Up text with gradient and glow */}
        <h2 className={`
          text-lg font-bold uppercase tracking-[0.3em] mb-2
          bg-gradient-to-r from-yellow-600 via-orange-500 to-yellow-600 bg-clip-text text-transparent
          transform transition-all duration-500 delay-100
          ${showContent ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}
        `}>
          Level Up!
        </h2>

        {/* Big level number with epic styling */}
        <div className={`
          mb-6 transform transition-all duration-700 delay-200
          ${showContent ? "scale-100 opacity-100" : "scale-50 opacity-0"}
        `}>
          <div className="relative inline-block">
            {/* Glow behind number */}
            <div className="absolute inset-0 text-8xl font-black text-yellow-400 blur-xl opacity-50">
              {newLevel}
            </div>
            {/* Main number */}
            <span className="relative text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 drop-shadow-lg">
              {newLevel}
            </span>
          </div>
        </div>

        {/* Rewards Section with slide-in animation */}
        <div className={`
          bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-4 mb-6 
          border border-slate-200 shadow-inner
          transform transition-all duration-500
          ${showRewards ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}
        `}>
          <p className="text-xs font-bold text-slate-500 mb-3 uppercase tracking-wider flex items-center justify-center gap-2">
            <SparklesIcon className="w-4 h-4 text-yellow-500" />
            Rewards Unlocked
            <SparklesIcon className="w-4 h-4 text-yellow-500" />
          </p>

          {/* Heart capacity increase */}
          <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-red-100 to-pink-100 p-2.5 rounded-xl shadow-sm">
                <HeartIcon className="w-6 h-6 text-red-500" />
              </div>
              <div className="text-left">
                <p className="font-bold text-gray-800 text-sm">Max Hearts</p>
                <p className="text-xs text-gray-500">Capacity Increased!</p>
              </div>
            </div>
            <div className="flex items-center gap-2 font-bold">
              <span className="text-gray-400 line-through text-sm">{oldMaxHearts}</span>
              <span className="text-xl">→</span>
              <span className="text-red-500 text-2xl animate-pulse">{newMaxHearts}</span>
            </div>
          </div>

          {/* XP Bonus indicator */}
          <div className="mt-3 flex items-center justify-center gap-2 text-sm text-green-600 font-medium bg-green-50 py-2 rounded-lg">
            <span className="text-lg">✨</span>
            Hearts fully restored!
            <span className="text-lg">✨</span>
          </div>
        </div>

        {/* CTA Button with animation */}
        <div className={`
          transform transition-all duration-500
          ${showButton ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}
        `}>
          <Button 
            fullWidth 
            size="lg" 
            onClick={onClose} 
            className="bg-gradient-to-r from-yellow-500 via-orange-500 to-yellow-500 hover:from-yellow-600 hover:via-orange-600 hover:to-yellow-600 border-b-4 border-orange-700 text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all"
          >
            <span className="flex items-center gap-2">
              <SparklesIcon className="w-5 h-5" />
              Awesome!
              <SparklesIcon className="w-5 h-5" />
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
}
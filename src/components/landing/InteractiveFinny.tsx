"use client";

import { useState } from "react";
import { Finny } from "@/components/mascot/Finny";

type FinnyPose = "default" | "celebrate" | "thinking" | "sad" | "waving";

interface InteractiveFinnyProps {
  size?: number;
  defaultPose?: FinnyPose;
  hoverPose?: FinnyPose;
  className?: string;
}

export function InteractiveFinny({
  size = 100,
  defaultPose = "default",
  hoverPose = "celebrate",
  className = "",
}: InteractiveFinnyProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked(true);
    // Reset after animation
    setTimeout(() => setIsClicked(false), 600);
  };

  const currentPose = isClicked ? "celebrate" : isHovered ? hoverPose : defaultPose;

  return (
    <div
      className={`relative cursor-pointer transition-transform duration-300 ${
        isHovered ? "scale-110" : "scale-100"
      } ${isClicked ? "animate-bounce" : ""} ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      {/* Sparkles that appear on hover */}
      <div
        className={`absolute inset-0 pointer-events-none transition-opacity duration-300 ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Sparkle 1 */}
        <div className="absolute -top-2 -left-2 animate-sparkle">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"
              fill="#FBBF24"
            />
          </svg>
        </div>
        {/* Sparkle 2 */}
        <div
          className="absolute -top-1 -right-3 animate-sparkle"
          style={{ animationDelay: "0.2s" }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"
              fill="#FDE047"
            />
          </svg>
        </div>
        {/* Sparkle 3 */}
        <div
          className="absolute -bottom-1 -right-2 animate-sparkle"
          style={{ animationDelay: "0.4s" }}
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"
              fill="#FBBF24"
            />
          </svg>
        </div>
        {/* Sparkle 4 */}
        <div
          className="absolute -bottom-2 -left-1 animate-sparkle"
          style={{ animationDelay: "0.6s" }}
        >
          <svg width="8" height="8" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"
              fill="#FDE047"
            />
          </svg>
        </div>
      </div>

      {/* Glow effect on hover */}
      <div
        className={`absolute inset-0 rounded-full bg-yellow-300/30 blur-xl transition-opacity duration-300 ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}
        style={{ transform: "scale(1.5)" }}
      />

      {/* Finny with floating animation */}
      <div className="relative animate-float">
        <Finny size={size} pose={currentPose} className="drop-shadow-xl" />
      </div>

      {/* Speech bubble on hover */}
      <div
        className={`absolute -top-12 left-1/2 -translate-x-1/2 transition-all duration-300 ${
          isHovered
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-2"
        }`}
      >
        <div className="bg-white px-3 py-1.5 rounded-full shadow-lg whitespace-nowrap">
          <span className="text-sm font-bold text-primary">Yuk mulai! 🚀</span>
        </div>
        {/* Speech bubble tail */}
        <div className="absolute left-1/2 -translate-x-1/2 -bottom-1.5">
          <div className="w-3 h-3 bg-white rotate-45 shadow-lg" />
        </div>
      </div>
    </div>
  );
}

export default InteractiveFinny;

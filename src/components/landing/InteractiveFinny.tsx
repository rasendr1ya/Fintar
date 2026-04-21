"use client";

import { useState, useRef, useEffect } from "react";
import { Finny } from "@/components/mascot/Finny";

type FinnyPose = "default" | "celebrate" | "thinking" | "sad" | "waving" | "reading";

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
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = () => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    hoverTimerRef.current = setTimeout(() => setIsHovered(false), 100);
  };

  const handleClick = () => {
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 600);
  };

  useEffect(() => {
    return () => {
      if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    };
  }, []);

  const currentPose = isClicked ? "celebrate" : isHovered ? hoverPose : defaultPose;

  return (
    <div
      className={`relative cursor-pointer transition-transform duration-300 ${
        isHovered ? "scale-110" : "scale-100"
      } ${isClicked ? "animate-bounce" : ""} ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={() => setIsHovered(true)}
      onTouchEnd={() => {
        setIsHovered(false);
        handleClick();
      }}
      onClick={handleClick}
    >
      <div
        className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="absolute -top-2 -left-2 animate-sparkle">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"
              fill="#FBBF24"
            />
          </svg>
        </div>
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

      <div
        className={`absolute inset-0 rounded-full bg-yellow-300/30 blur-xl transition-opacity duration-500 ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}
        style={{ transform: "scale(1.5)" }}
      />

      <div className="relative animate-float">
        <Finny size={size} pose={currentPose} className="drop-shadow-xl transition-all duration-300" />
      </div>

      <div
        className={`absolute -top-12 left-1/2 -translate-x-1/2 transition-all duration-300 ${
          isHovered
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-2 pointer-events-none"
        }`}
      >
        <div className="bg-white px-3 py-1.5 rounded-full shadow-lg whitespace-nowrap">
          <span className="text-sm font-bold text-primary">Yuk mulai! 🚀</span>
        </div>
        <div className="absolute left-1/2 -translate-x-1/2 -bottom-1.5">
          <div className="w-3 h-3 bg-white rotate-45 shadow-lg" />
        </div>
      </div>
    </div>
  );
}

export default InteractiveFinny;
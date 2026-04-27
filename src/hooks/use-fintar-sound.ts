"use client";

import { useCallback, useRef, useEffect } from "react";

type SoundType = "correct" | "wrong" | "complete" | "levelup" | "fanfare" | "coin" | "pop" | "click";

const soundFiles: Record<SoundType, string> = {
  correct: "/sounds/correct.mp3",
  wrong: "/sounds/wrong.mp3",
  complete: "/sounds/complete.mp3",
  levelup: "/sounds/levelup.mp3",
  fanfare: "/sounds/fanfare.mp3",
  coin: "/sounds/coin.mp3",
  pop: "/sounds/pop.mp3",
  click: "/sounds/click.mp3",
};

export function useFintarSound() {
  const timeoutIdsRef = useRef<number[]>([]);

  useEffect(() => {
    return () => {
      timeoutIdsRef.current.forEach((id) => clearTimeout(id));
      timeoutIdsRef.current = [];
    };
  }, []);

  const playSound = useCallback((type: SoundType) => {
    // Buat Audio element fresh setiap kali — paling reliable
    // Hindari masalah stale element, loading state, atau interrupted play
    const audio = new Audio(soundFiles[type]);
    audio.addEventListener("ended", () => {
      audio.src = "";
      audio.load();
    });
    audio.play().catch(() => {
      // Ignore autoplay errors atau network hiccup
    });
  }, []);

  const playSequence = useCallback((types: SoundType[], delayMs: number = 300) => {
    types.forEach((type, index) => {
      const id = window.setTimeout(() => {
        playSound(type);
      }, index * delayMs);
      timeoutIdsRef.current.push(id);
    });
  }, [playSound]);

  const triggerHaptic = useCallback((pattern: number | number[] = 50) => {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  }, []);

  const playWithHaptic = useCallback((type: SoundType, pattern?: number | number[]) => {
    playSound(type);
    triggerHaptic(pattern);
  }, [playSound, triggerHaptic]);

  return {
    playSound,
    playSequence,
    triggerHaptic,
    playWithHaptic,
    playCorrect: () => playWithHaptic("correct", 100),
    playWrong: () => playWithHaptic("wrong", [100, 50, 100]),
    playComplete: () => playSound("complete"),
    playLevelUp: () => playSequence(["levelup", "fanfare"], 400),
    playCoin: () => playSound("coin"),
    playPop: () => playSound("pop"),
    playClick: () => playSound("click"),
  };
}

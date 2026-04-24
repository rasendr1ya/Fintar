"use client";

import { useCallback } from "react";

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
  const playSound = useCallback((type: SoundType) => {
    // Buat Audio element fresh setiap kali — paling reliable
    // Hindari masalah stale element, loading state, atau interrupted play
    const audio = new Audio(soundFiles[type]);
    audio.play().catch(() => {
      // Ignore autoplay errors atau network hiccup
    });
  }, []);

  const playSequence = useCallback((types: SoundType[], delayMs: number = 300) => {
    types.forEach((type, index) => {
      setTimeout(() => {
        playSound(type);
      }, index * delayMs);
    });
  }, [playSound]);

  const triggerHaptic = useCallback(() => {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(50);
    }
  }, []);

  const playWithHaptic = useCallback((type: SoundType) => {
    playSound(type);
    triggerHaptic();
  }, [playSound, triggerHaptic]);

  return {
    playSound,
    playSequence,
    triggerHaptic,
    playWithHaptic,
    playCorrect: () => playWithHaptic("correct"),
    playWrong: () => playWithHaptic("wrong"),
    playComplete: () => playSound("complete"),
    playLevelUp: () => playSequence(["levelup", "fanfare"], 400),
    playCoin: () => playSound("coin"),
    playPop: () => playSound("pop"),
    playClick: () => playSound("click"),
  };
}

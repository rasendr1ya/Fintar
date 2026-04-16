"use client";

import { useCallback, useEffect, useRef } from "react";

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
  const audioRefs = useRef<Record<SoundType, HTMLAudioElement | null>>({
    correct: null,
    wrong: null,
    complete: null,
    levelup: null,
    fanfare: null,
    coin: null,
    pop: null,
    click: null,
  });

  useEffect(() => {
    Object.entries(soundFiles).forEach(([key, src]) => {
      const audio = new Audio(src);
      audio.preload = "auto";
      audioRefs.current[key as SoundType] = audio;
    });

    const currentRefs = { ...audioRefs.current };

    return () => {
      Object.values(currentRefs).forEach((audio) => {
        if (audio) {
          audio.pause();
          audio.src = "";
        }
      });
    };
  }, []);

  const playSound = useCallback((type: SoundType) => {
    const audio = audioRefs.current[type];
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(() => {
        // Ignore autoplay errors
      });
    }
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

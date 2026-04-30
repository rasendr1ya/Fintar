"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";
import { useFintarSound } from "@/hooks/use-fintar-sound";
import { Button } from "@/components/ui/Button";
import { Finny } from "@/components/mascot/Finny";
import { LevelUpModal } from "@/components/gamification/LevelUpModal";
import { completeLesson, reduceHearts } from "@/features/learning/actions";
import { XP_PER_CHALLENGE, COINS_PER_LESSON } from "@/lib/constants";
import type { Lesson, Challenge } from "@/types/database";
import {
  HeartIcon,
  XMarkIcon,
  CheckCircleIcon,
  XCircleIcon,
  SparklesIcon,
  ShoppingBagIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/solid";

type Phase = "IDLE" | "CORRECT" | "WRONG" | "GAME_OVER" | "COMPLETE";

interface LessonContentProps {
  lesson: Lesson;
  challenges: Challenge[];
  initialHearts: number;
  maxHearts: number;
  userXp: number;
  initialStreak: number;
}

export function LessonContent({
  lesson,
  challenges,
  initialHearts,
  maxHearts,
  userXp,
  initialStreak,
}: LessonContentProps) {
  const router = useRouter();
  const { playSound, playWithHaptic, triggerHaptic } = useFintarSound();

  // ── Shuffle challenges on client (QA-014) ─────────────────
  const [shuffledChallenges] = useState(() => {
    const shuffled = [...challenges].sort(() => Math.random() - 0.5);
    return shuffled.map((c) => {
      const options = Array.isArray(c.options) ? c.options : [];
      const shuffledOpts = [...options].sort(() => Math.random() - 0.5);
      return { ...c, options: shuffledOpts };
    });
  });

  // ── Core State ────────────────────────────────────────────
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answeredCorrectly, setAnsweredCorrectly] = useState<Set<string>>(new Set());
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>(initialHearts <= 0 ? "GAME_OVER" : "IDLE");
  const [hearts, setHearts] = useState(initialHearts);
  const [isCompleting, setIsCompleting] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [showErrorRetry, setShowErrorRetry] = useState(false);
  const [heartAnimKey, setHeartAnimKey] = useState(0);

  // Level up & completion rewards
  const [levelUpData, setLevelUpData] = useState<{
    newLevel: number;
    oldMaxHearts: number;
    newMaxHearts: number;
  } | null>(null);
  const [completionRewards, setCompletionRewards] = useState<{
    newStreak: number;
    newCoins: number;
  } | null>(null);

  // Refs
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasCompletedRef = useRef(false);
  const isProcessingRef = useRef(false);

  const currentChallenge = shuffledChallenges[currentIndex];
  const totalChallenges = shuffledChallenges.length;
  const progress =
    totalChallenges > 0
      ? (answeredCorrectly.size / totalChallenges) * 100
      : 0;

  // Cleanup timeouts and refs on unmount (QA-012)
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      isProcessingRef.current = false;
    };
  }, []);

  // ── Handlers ──────────────────────────────────────────────

  const handleSelectAnswer = (answer: string) => {
    if (phase !== "IDLE" || isProcessingRef.current) return;
    setSelectedAnswer(answer);
  };

  const handleCheckAnswer = async () => {
    if (
      !selectedAnswer ||
      !currentChallenge ||
      phase !== "IDLE" ||
      isProcessingRef.current
    )
      return;

    isProcessingRef.current = true;
    const isCorrect = selectedAnswer === currentChallenge.correct_answer;

    if (isCorrect) {
      playWithHaptic("correct");
      setPhase("CORRECT");
      setAnsweredCorrectly((prev) => new Set(prev).add(currentChallenge.id));

      // Auto-advance setelah 300ms
      timeoutRef.current = setTimeout(() => {
        const nextIndex = currentIndex + 1;
        if (nextIndex >= totalChallenges) {
          setPhase("COMPLETE");
          playSound("complete");
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ["#7C3AED", "#FBBF24", "#10B981"],
          });
        } else {
          setCurrentIndex(nextIndex);
          setSelectedAnswer(null);
          setPhase("IDLE");
        }
        isProcessingRef.current = false;
      }, 300);
    } else {
      playWithHaptic("wrong");
      setPhase("WRONG");

      // Reduce hearts via server action, lalu sync ke UI
      const result = await reduceHearts();
      const newHearts = result.error ? Math.max(hearts - 1, 0) : result.hearts;
      setHearts(newHearts);
      setHeartAnimKey((k) => k + 1);

      if (newHearts <= 0) {
        timeoutRef.current = setTimeout(() => {
          setPhase("GAME_OVER");
          isProcessingRef.current = false;
        }, 800);
      } else {
        // Auto-reset setelah 800ms
        timeoutRef.current = setTimeout(() => {
          setSelectedAnswer(null);
          setPhase("IDLE");
          isProcessingRef.current = false;
        }, 800);
      }
    }
  };

  const handleFinishLesson = async () => {
    if (hasCompletedRef.current) return;
    hasCompletedRef.current = true;
    setIsCompleting(true);
    setShowErrorRetry(false);

    const xpEarned = answeredCorrectly.size * XP_PER_CHALLENGE;
    const result = await completeLesson(lesson.id, xpEarned, COINS_PER_LESSON);

    if (!result.success) {
      hasCompletedRef.current = false;
      setIsCompleting(false);
      setShowErrorRetry(true);
      return;
    }

    setCompletionRewards({
      newStreak: result.newStreak,
      newCoins: result.newCoins,
    });

    if (result.didLevelUp) {
      setLevelUpData({
        newLevel: result.newLevel,
        oldMaxHearts: maxHearts,
        newMaxHearts: result.newMaxHearts,
      });
      triggerHaptic(300);
      // Sound levelup + fanfare di-handle oleh LevelUpModal sendiri
    }

    setIsCompleting(false);
  };

  const handleLevelUpClose = () => {
    router.push("/learn");
  };

  const handleContinue = () => {
    router.push("/learn");
  };

  const handleExit = () => {
    if (answeredCorrectly.size === 0 && phase === "IDLE") {
      router.push("/learn");
    } else {
      setShowExitConfirm(true);
    }
  };

  // ── Render Helpers ────────────────────────────────────────

  // Game Over Screen
  if (phase === "GAME_OVER") {
    return (
      <div className="min-h-screen bg-bg flex flex-col items-center justify-center px-6 py-8">
        <div className="text-center max-w-sm w-full">
          <div className="flex justify-center mb-6">
            <Finny pose="sad" size={140} />
          </div>
          <h1 className="text-3xl font-extrabold text-text mb-3">
            Nyawa habis! 💔
          </h1>
          <p className="text-muted mb-8 leading-relaxed">
            Tunggu 1 jam untuk +1 nyawa, atau beli di Toko
          </p>

          <div className="space-y-3">
            <Button onClick={() => router.push("/shop")} fullWidth>
              <span className="flex items-center justify-center gap-2">
                <ShoppingBagIcon className="w-5 h-5" />
                Ke Toko
              </span>
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push("/learn")}
              fullWidth
            >
              <span className="flex items-center justify-center gap-2">
                <ArrowLeftIcon className="w-5 h-5" />
                Kembali
              </span>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Lesson Complete Screen
  if (phase === "COMPLETE") {
    const isPerfect = answeredCorrectly.size === totalChallenges;
    const xpEarned = answeredCorrectly.size * XP_PER_CHALLENGE;

    return (
      <div className="min-h-screen bg-bg flex flex-col items-center justify-center px-6 py-8">
        <div className="text-center max-w-sm w-full">
          <div className="flex justify-center mb-6">
            <Finny pose={isPerfect ? "celebrate" : "default"} size={140} />
          </div>

          <h1 className="text-3xl font-extrabold text-text mb-2">
            {isPerfect ? "Sempurna!" : "Lesson Selesai! 🎉"}
          </h1>
          <p className="text-muted mb-8">
            {isPerfect
              ? "Semua benar di percobaan pertama! Keren banget!"
              : `Kamu menyelesaikan pelajaran dengan ${totalChallenges - answeredCorrectly.size} kesalahan.`}
          </p>

          {/* Rewards */}
          <div className="bg-white rounded-3xl border-2 border-border p-6 mb-4 shadow-card">
            <div className="flex items-center justify-center gap-6">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-xp mb-1">
                  <SparklesIcon className="w-6 h-6" />
                  <span className="text-2xl font-extrabold">+{xpEarned}</span>
                </div>
                <span className="text-xs font-semibold text-muted uppercase tracking-wide">
                  XP
                </span>
              </div>
              <div className="w-px h-12 bg-border" />
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-coins mb-1">
                  <SparklesIcon className="w-6 h-6" />
                  <span className="text-2xl font-extrabold">+{COINS_PER_LESSON}</span>
                </div>
                <span className="text-xs font-semibold text-muted uppercase tracking-wide">
                  Koin
                </span>
              </div>
            </div>
          </div>

          {/* Streak feedback */}
          {completionRewards && (
            <div className={`rounded-2xl border-2 p-4 mb-4 text-center ${
              completionRewards.newStreak > initialStreak
                ? "bg-streak/10 border-streak/30"
                : "bg-border/20 border-border/30"
            }`}>
              <p className="text-2xl mb-1">🔥</p>
              <p className="font-bold text-text">
                {completionRewards.newStreak > initialStreak
                  ? `Streak hari ke-${completionRewards.newStreak}!`
                  : "Streak terjaga!"}
              </p>
              <p className="text-xs text-muted mt-0.5">
                {completionRewards.newStreak > initialStreak
                  ? "Luar biasa! Besok lanjut lagi ya."
                  : "Kamu sudah belajar hari ini. Terus semangat!"}
              </p>
            </div>
          )}

          {showErrorRetry && (
            <div className="bg-hearts/10 border border-hearts/20 rounded-2xl p-4 mb-4 text-sm text-hearts font-medium">
              Gagal menyimpan progress. Silakan coba lagi.
            </div>
          )}

          <Button
            onClick={completionRewards ? handleContinue : handleFinishLesson}
            disabled={isCompleting}
            fullWidth
            size="lg"
          >
            {isCompleting
              ? "Menyimpan..."
              : completionRewards
              ? "Lanjutkan"
              : "Kembali ke Jalur Belajar"}
          </Button>
        </div>

        {/* Level Up Modal */}
        {levelUpData && (
          <LevelUpModal
            newLevel={levelUpData.newLevel}
            oldMaxHearts={levelUpData.oldMaxHearts}
            newMaxHearts={levelUpData.newMaxHearts}
            onClose={handleLevelUpClose}
          />
        )}
      </div>
    );
  }

  // ── Main Quiz UI ──────────────────────────────────────────

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      {/* ── Top Bar ───────────────────────────────────────── */}
      <header className="sticky top-0 z-30 bg-white border-b border-border px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          {/* Close Button */}
          <button
            onClick={handleExit}
            className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-100 transition-colors shrink-0"
            aria-label="Tutup kuis"
          >
            <XMarkIcon className="w-6 h-6 text-text-secondary" />
          </button>

          {/* Progress Bar */}
          <div className="flex-1 h-3 bg-border rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-primary-light rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Hearts */}
          <div
            key={heartAnimKey}
            className={`flex items-center gap-1.5 shrink-0 ${phase === "WRONG" ? "animate-wiggle" : ""}`}
          >
            <HeartIcon className="w-6 h-6 text-hearts" />
            <span className="font-bold text-text">
              {hearts}
              <span className="text-muted font-medium text-sm">
                /{maxHearts}
              </span>
            </span>
          </div>
        </div>
      </header>

      {/* ── Main Content ──────────────────────────────────── */}
      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-6 pb-32">
        {/* Question Number */}
        <p className="text-sm font-semibold text-muted mb-3">
          Pertanyaan {currentIndex + 1} dari {totalChallenges}
        </p>

        {/* Question */}
        <h2 className="text-xl font-bold text-text leading-relaxed mb-8">
          {currentChallenge?.question}
        </h2>

        {/* Options */}
        <div className="space-y-3">
          {currentChallenge?.options.map((option, index) => {
            const isSelected = selectedAnswer === option;
            const isCorrectOption = option === currentChallenge.correct_answer;

            let borderColor = "border-border";
            let bgColor = "bg-white";
            let textColor = "text-text";
            let ringBadge = "bg-primary-50 text-text";
            let icon = null;
            let shakeClass = "";

            if (phase === "CORRECT") {
              if (isCorrectOption) {
                borderColor = "border-success";
                bgColor = "bg-success/10";
                textColor = "text-success";
                ringBadge = "bg-success text-white";
                icon = <CheckCircleIcon className="w-6 h-6 text-success shrink-0" />;
              } else {
                borderColor = "border-border";
                bgColor = "bg-white";
                textColor = "text-muted";
              }
            } else if (phase === "WRONG") {
              if (isSelected) {
                borderColor = "border-hearts";
                bgColor = "bg-hearts/10";
                textColor = "text-hearts";
                ringBadge = "bg-hearts text-white";
                icon = <XCircleIcon className="w-6 h-6 text-hearts shrink-0" />;
                shakeClass = "animate-shake";
              } else if (isCorrectOption) {
                // Reveal correct answer
                borderColor = "border-success/40";
                bgColor = "bg-success/5";
                textColor = "text-success";
                ringBadge = "bg-success/20 text-success";
              } else {
                borderColor = "border-border";
                bgColor = "bg-white/60";
                textColor = "text-muted";
                ringBadge = "bg-slate-100 text-muted";
              }
            } else {
              // IDLE
              if (isSelected) {
                borderColor = "border-primary";
                bgColor = "bg-primary-50";
                ringBadge = "bg-primary text-white";
              }
            }

            return (
              <button
                key={`${currentChallenge.id}-${index}`}
                onClick={() => handleSelectAnswer(option)}
                disabled={phase !== "IDLE"}
                className={`
                  w-full p-4 rounded-2xl border-2 text-left transition-all duration-200
                  ${borderColor} ${bgColor} ${textColor} ${shakeClass}
                  ${
                    phase === "IDLE"
                      ? "hover:border-primary/50 hover:shadow-card-hover active:scale-[0.98]"
                      : ""
                  }
                  disabled:cursor-not-allowed
                `}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`
                      w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 transition-colors
                      ${ringBadge}
                    `}
                  >
                    {String.fromCharCode(65 + index)}
                  </div>
                  <span className="font-medium flex-1 leading-snug">
                    {option}
                  </span>
                  {icon}
                </div>
              </button>
            );
          })}
        </div>

        {/* Feedback Banner */}
        {phase !== "IDLE" && (
          <div
            className={`
              mt-6 p-4 rounded-2xl flex items-center gap-4 animate-bounce-subtle
              ${
                phase === "CORRECT"
                  ? "bg-success/10 border border-success/20"
                  : "bg-hearts/10 border border-hearts/20"
              }
            `}
          >
            <Finny
              pose={phase === "CORRECT" ? "celebrate" : "sad"}
              size={56}
            />
            <div className="flex-1">
              <p
                className={`font-bold ${
                  phase === "CORRECT" ? "text-success" : "text-hearts"
                }`}
              >
                {phase === "CORRECT"
                  ? "✓ Benar!"
                  : "✗ Jawaban salah. Coba lagi!"}
              </p>
              <p className="text-sm text-muted">
                {phase === "CORRECT"
                  ? `+${XP_PER_CHALLENGE} XP`
                  : "Nyawa berkurang 1"}
              </p>
            </div>
          </div>
        )}
      </main>

      {/* ── Bottom Action Bar ─────────────────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border safe-bottom z-20">
        <div className="max-w-lg mx-auto px-4 py-4">
          {phase === "IDLE" ? (
            <Button
              fullWidth
              size="lg"
              disabled={!selectedAnswer}
              onClick={handleCheckAnswer}
            >
              Periksa
            </Button>
          ) : phase === "CORRECT" ? (
            <Button
              fullWidth
              size="lg"
              variant="success"
              onClick={() => {
                // Manual advance (fallback jika user klik sebelum timeout)
                if (timeoutRef.current) clearTimeout(timeoutRef.current);
                const nextIndex = currentIndex + 1;
                if (nextIndex >= totalChallenges) {
                  setPhase("COMPLETE");
                  playSound("complete");
                  confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: ["#7C3AED", "#FBBF24", "#10B981"],
                  });
                } else {
                  setCurrentIndex(nextIndex);
                  setSelectedAnswer(null);
                  setPhase("IDLE");
                }
                isProcessingRef.current = false;
              }}
            >
              Lanjut
            </Button>
          ) : (
            <Button fullWidth size="lg" variant="danger" disabled>
              Coba Lagi...
            </Button>
          )}
        </div>
      </div>

      {/* ── Exit Confirmation Modal ───────────────────────── */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="text-xl font-bold text-text mb-2">
              Yakin mau keluar?
            </h3>
            <p className="text-muted mb-6">
              Progress kamu di pelajaran ini tidak akan disimpan.
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                fullWidth
                onClick={() => setShowExitConfirm(false)}
              >
                Lanjutkan
              </Button>
              <Button
                variant="danger"
                fullWidth
                onClick={() => router.push("/learn")}
              >
                Keluar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LessonContent;

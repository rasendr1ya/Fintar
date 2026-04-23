"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";
import { useFintarSound } from "@/hooks/use-fintar-sound";
import { Button } from "@/components/ui/Button";
import { Finny } from "@/components/mascot/Finny";
import { LevelUpModal } from "@/components/gamification/LevelUpModal";
import { completeLesson, reduceHearts } from "@/features/learning/actions";
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

interface LessonContentProps {
  lesson: Lesson;
  challenges: Challenge[];
  initialHearts: number;
  maxHearts: number;
  userXp: number;
}

export function LessonContent({
  lesson,
  challenges,
  initialHearts,
  maxHearts,
  userXp,
}: LessonContentProps) {
  const router = useRouter();
  const { playCorrect, playWrong, playComplete } = useFintarSound();

  // ── Core State ────────────────────────────────────────────
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctlyAnsweredIds, setCorrectlyAnsweredIds] = useState<Set<string>>(
    new Set()
  );
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answerState, setAnswerState] = useState<"idle" | "correct" | "wrong">(
    "idle"
  );
  const [hearts, setHearts] = useState(initialHearts);
  const [isGameOver, setIsGameOver] = useState(initialHearts <= 0);
  const [isLessonComplete, setIsLessonComplete] = useState(false);
  const [totalXpEarned, setTotalXpEarned] = useState(0);
  const [isCompleting, setIsCompleting] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  // Level up
  const [levelUpData, setLevelUpData] = useState<{
    newLevel: number;
    newMaxHearts: number;
  } | null>(null);

  // Refs
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasCompletedRef = useRef(false);
  const isProcessingRef = useRef(false);

  const currentChallenge = challenges[currentIndex];
  const totalChallenges = challenges.length;
  const progress =
    totalChallenges > 0
      ? (correctlyAnsweredIds.size / totalChallenges) * 100
      : 0;

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // ── Handlers ──────────────────────────────────────────────

  const handleSelectAnswer = useCallback(
    (answer: string) => {
      if (answerState !== "idle" || isProcessingRef.current) return;
      setSelectedAnswer(answer);
    },
    [answerState]
  );

  const handleCheckAnswer = useCallback(async () => {
    if (
      !selectedAnswer ||
      !currentChallenge ||
      answerState !== "idle" ||
      isProcessingRef.current
    )
      return;

    isProcessingRef.current = true;
    const isCorrect = selectedAnswer === currentChallenge.correct_answer;

    if (isCorrect) {
      setAnswerState("correct");
      setCorrectlyAnsweredIds((prev) => new Set(prev).add(currentChallenge.id));
      setTotalXpEarned((prev) => prev + 10);
      playCorrect();

      // Auto-advance setelah 1.2 detik
      timeoutRef.current = setTimeout(() => {
        const nextIndex = currentIndex + 1;
        if (nextIndex >= totalChallenges) {
          setIsLessonComplete(true);
          playComplete();
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ["#7C3AED", "#FBBF24", "#10B981"],
          });
        } else {
          setCurrentIndex(nextIndex);
          setSelectedAnswer(null);
          setAnswerState("idle");
        }
        isProcessingRef.current = false;
      }, 1200);
    } else {
      setAnswerState("wrong");
      playWrong();

      // Reduce hearts via server action
      const result = await reduceHearts();
      const newHearts = result.hearts ?? Math.max(hearts - 1, 0);
      setHearts(newHearts);

      if (newHearts <= 0) {
        timeoutRef.current = setTimeout(() => {
          setIsGameOver(true);
          isProcessingRef.current = false;
        }, 1200);
      } else {
        // Auto-reset setelah 1.2 detik
        timeoutRef.current = setTimeout(() => {
          setSelectedAnswer(null);
          setAnswerState("idle");
          isProcessingRef.current = false;
        }, 1200);
      }
    }
  }, [
    selectedAnswer,
    currentChallenge,
    answerState,
    currentIndex,
    totalChallenges,
    hearts,
    playCorrect,
    playWrong,
    playComplete,
  ]);

  const handleFinishLesson = useCallback(async () => {
    if (hasCompletedRef.current) return;
    hasCompletedRef.current = true;
    setIsCompleting(true);

    const result = await completeLesson(lesson.id, totalXpEarned, 5);

    if (result.leveledUp) {
      setLevelUpData({
        newLevel: result.newLevel,
        newMaxHearts: result.newMaxHearts,
      });
    } else {
      router.push("/learn");
    }

    setIsCompleting(false);
  }, [lesson.id, totalXpEarned, router]);

  const handleLevelUpClose = useCallback(() => {
    router.push("/learn");
  }, [router]);

  const handleExit = useCallback(() => {
    if (correctlyAnsweredIds.size === 0 && answerState === "idle") {
      router.push("/learn");
    } else {
      setShowExitConfirm(true);
    }
  }, [correctlyAnsweredIds.size, answerState, router]);

  // ── Render Helpers ────────────────────────────────────────

  // Game Over Screen
  if (isGameOver) {
    return (
      <div className="min-h-screen bg-bg flex flex-col items-center justify-center px-6 py-8">
        <div className="text-center max-w-sm w-full">
          <div className="flex justify-center mb-6">
            <Finny pose="sad" size={140} />
          </div>
          <h1 className="text-3xl font-extrabold text-text mb-3">
            Hearts Habis!
          </h1>
          <p className="text-muted mb-8 leading-relaxed">
            Kamu terlalu banyak salah. Latihan membuat sempurna! Tunggu hearts
            terisi ulang atau beli di shop.
          </p>

          <div className="space-y-3">
            <Button onClick={() => router.push("/shop")} fullWidth>
              <ShoppingBagIcon className="w-5 h-5 mr-2" />
              Ke Shop
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push("/learn")}
              fullWidth
            >
              <ArrowLeftIcon className="w-5 h-5 mr-2" />
              Kembali ke Learn
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Lesson Complete Screen
  if (isLessonComplete) {
    const isPerfect = correctlyAnsweredIds.size === totalChallenges;

    return (
      <div className="min-h-screen bg-bg flex flex-col items-center justify-center px-6 py-8">
        <div className="text-center max-w-sm w-full">
          <div className="flex justify-center mb-6">
            <Finny pose={isPerfect ? "celebrate" : "default"} size={140} />
          </div>

          <h1 className="text-3xl font-extrabold text-text mb-2">
            {isPerfect ? "Sempurna!" : "Pelajaran Selesai!"}
          </h1>
          <p className="text-muted mb-8">
            {isPerfect
              ? "Semua benar di percobaan pertama! Keren banget!"
              : `Kamu menyelesaikan pelajaran dengan ${totalChallenges - correctlyAnsweredIds.size} kesalahan.`}
          </p>

          {/* Rewards */}
          <div className="bg-white rounded-3xl border-2 border-border p-6 mb-8 shadow-card">
            <div className="flex items-center justify-center gap-6">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-xp mb-1">
                  <SparklesIcon className="w-6 h-6" />
                  <span className="text-2xl font-extrabold">+{totalXpEarned}</span>
                </div>
                <span className="text-xs font-semibold text-muted uppercase tracking-wide">
                  XP
                </span>
              </div>
              <div className="w-px h-12 bg-border" />
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-coins mb-1">
                  <SparklesIcon className="w-6 h-6" />
                  <span className="text-2xl font-extrabold">+5</span>
                </div>
                <span className="text-xs font-semibold text-muted uppercase tracking-wide">
                  Koin
                </span>
              </div>
            </div>
          </div>

          <Button
            onClick={handleFinishLesson}
            disabled={isCompleting}
            fullWidth
            size="lg"
          >
            {isCompleting ? "Menyimpan..." : "Lanjut"}
          </Button>
        </div>

        {/* Level Up Modal */}
        {levelUpData && (
          <LevelUpModal
            newLevel={levelUpData.newLevel}
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
          <div className="flex items-center gap-1.5 shrink-0">
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

            if (answerState === "correct") {
              if (isCorrectOption) {
                borderColor = "border-success";
                bgColor = "bg-success/10";
                textColor = "text-success";
                ringBadge = "bg-success text-white";
                icon = <CheckCircleIcon className="w-6 h-6 text-success shrink-0" />;
              } else if (isSelected) {
                // Shouldn't happen if correct, but just in case
                borderColor = "border-success";
                bgColor = "bg-success/10";
              } else {
                borderColor = "border-border";
                bgColor = "bg-white";
              }
            } else if (answerState === "wrong") {
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
              // idle
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
                disabled={answerState !== "idle"}
                className={`
                  w-full p-4 rounded-2xl border-2 text-left transition-all duration-200
                  ${borderColor} ${bgColor} ${textColor} ${shakeClass}
                  ${
                    answerState === "idle"
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
        {answerState !== "idle" && (
          <div
            className={`
              mt-6 p-4 rounded-2xl flex items-center gap-4
              ${
                answerState === "correct"
                  ? "bg-success/10 border border-success/20"
                  : "bg-hearts/10 border border-hearts/20"
              }
            `}
          >
            <Finny
              pose={answerState === "correct" ? "celebrate" : "sad"}
              size={56}
            />
            <div className="flex-1">
              <p
                className={`font-bold ${
                  answerState === "correct" ? "text-success" : "text-hearts"
                }`}
              >
                {answerState === "correct"
                  ? "Benar! Keren!"
                  : "Belum tepat, coba lagi!"}
              </p>
              <p className="text-sm text-muted">
                {answerState === "correct"
                  ? "+10 XP"
                  : "Hearts berkurang 1"}
              </p>
            </div>
          </div>
        )}
      </main>

      {/* ── Bottom Action Bar ─────────────────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border safe-bottom z-20">
        <div className="max-w-lg mx-auto px-4 py-4">
          {answerState === "idle" ? (
            <Button
              fullWidth
              size="lg"
              disabled={!selectedAnswer}
              onClick={handleCheckAnswer}
            >
              Periksa
            </Button>
          ) : answerState === "correct" ? (
            <Button
              fullWidth
              size="lg"
              variant="success"
              onClick={() => {
                // Manual advance (fallback jika user klik sebelum timeout)
                if (timeoutRef.current) clearTimeout(timeoutRef.current);
                const nextIndex = currentIndex + 1;
                if (nextIndex >= totalChallenges) {
                  setIsLessonComplete(true);
                  playComplete();
                  confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: ["#7C3AED", "#FBBF24", "#10B981"],
                  });
                } else {
                  setCurrentIndex(nextIndex);
                  setSelectedAnswer(null);
                  setAnswerState("idle");
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

      {/* ── Level Up Modal ────────────────────────────────── */}
      {levelUpData && (
        <LevelUpModal
          newLevel={levelUpData.newLevel}
          onClose={handleLevelUpClose}
        />
      )}
    </div>
  );
}

export default LessonContent;

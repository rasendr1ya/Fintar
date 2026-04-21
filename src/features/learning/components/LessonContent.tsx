"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";
import { useFintarSound } from "@/hooks/use-fintar-sound";
import { Button } from "@/components/ui/Button";
import { Finny } from "@/components/mascot/Finny";
import type { Lesson, Challenge, ChallengeOption } from "@/types/database";
import { CheckCircleIcon, XCircleIcon, SparklesIcon, HeartIcon } from "@heroicons/react/24/solid";
import { completeLesson, reduceHearts, refillHearts } from "@/features/learning/actions";
import { LevelUpModal } from "@/components/gamification/LevelUpModal";

interface LessonContentProps {
  lesson: Lesson;
  challenges: Challenge[];
  initialHearts: number;
}

export function LessonContent({ lesson, challenges, initialHearts }: LessonContentProps) {
  const router = useRouter();
  const { playCorrect, playWrong, playComplete } = useFintarSound();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [correctCount, setCorrectCount] = useState(0); 
  const [mistakesInLesson, setMistakesInLesson] = useState(0);
  const [isCompleting, setIsCompleting] = useState(false);
  const [hearts, setHearts] = useState(initialHearts);
  const [isGameOver, setIsGameOver] = useState(initialHearts <= 0);
  
  // Level Up State
  const [levelUpData, setLevelUpData] = useState<{ newLevel: number } | null>(null);
  
  // Use ref to ensure confetti only plays once
  const hasPlayedConfetti = useRef(false);

  const currentChallenge = challenges[currentIndex];
  const progress = challenges.length > 0 ? ((currentIndex + 1) / challenges.length) * 100 : 100;

  useEffect(() => {
    if (!currentChallenge && !hasPlayedConfetti.current) {
        hasPlayedConfetti.current = true;
        playComplete();
        
        if (mistakesInLesson === 0) {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#7C3AED', '#FBBF24', '#10B981'] // Primary, Coins, Success
            });
        }
    }
  }, [currentChallenge, mistakesInLesson, playComplete]);

  const handleComplete = async () => {
    setIsCompleting(true);
    const xpEarned = challenges.length * 10; 
    
    // Call server action
    const result = await completeLesson(lesson.id, xpEarned);
    
    if (result && result.leveledUp) {
        setLevelUpData({ newLevel: result.newLevel });
        setIsCompleting(false);
    } else {
        router.push("/learn");
    }
  };

  const handleLevelUpClose = () => {
      router.push("/learn");
  };

  const handleSelectAnswer = (answer: string) => {
    if (isAnswered) return;
    setSelectedAnswer(answer);
  };

  const handleCheckAnswer = async () => {
    if (!selectedAnswer) return;
    
    const correct = selectedAnswer === currentChallenge.correct_answer;
    setIsCorrect(correct);
    setIsAnswered(true);
    
    if (correct) {
      setCorrectCount((prev) => prev + 1);
      playCorrect();
    } else {
      // Wrong answer logic
      playWrong();
      const newHearts = hearts - 1;
      setHearts(newHearts);
      setMistakesInLesson((prev) => prev + 1);
      
      // Server action to reduce hearts
      reduceHearts().then((result) => {
        if (result.error === "GAME_OVER") {
          setIsGameOver(true);
        }
      });

      if (newHearts <= 0) {
        setIsGameOver(true);
      }
    }
  };

  const handleRetry = () => {
    // Reset state for the current question to try again
    setSelectedAnswer(null);
    setIsAnswered(false);
    setIsCorrect(false);
  };

  const handleContinue = () => {
    setSelectedAnswer(null);
    setIsAnswered(false);
    setIsCorrect(false);
    setCurrentIndex((prev) => prev + 1);
  };

  // Game Over Screen
  if (isGameOver) {
    return (
      <main className="max-w-md mx-auto px-4 py-6 flex flex-col items-center justify-center min-h-[80vh]">
        <Finny pose="sad" size={140} />
        <h1 className="text-3xl font-bold text-text mt-6 mb-2">Out of Hearts!</h1>
        <p className="text-muted text-center mb-8">
          You made too many mistakes. Practice makes perfect! 
          <br /> Wait for them to refill or review your notes.
        </p>
        <Button onClick={() => router.push("/learn")} fullWidth>
          Back to Learn
        </Button>
        <div className="mt-4 w-full">
            <Button 
                variant="outline" 
                fullWidth 
                onClick={async () => {
                    await refillHearts();
                    setHearts(5);
                    setIsGameOver(false);
                }}
            >
                Refill Hearts (Dev)
            </Button>
        </div>
      </main>
    );
  }

  // Lesson Complete Screen
  if (!currentChallenge) {
    const isPerfect = mistakesInLesson === 0;
    
    return (
      <main className="max-w-md mx-auto px-4 py-6">
        <div className="text-center py-8">
          <div className="mb-6 flex justify-center">
            <Finny pose={isPerfect ? "celebrate" : "default"} size={140} />
          </div>
          
          <h1 className="text-3xl font-bold text-text mb-2">
            {isPerfect ? "Perfect!" : "Lesson Complete!"}
          </h1>
          
          <p className="text-muted mb-6">
            {isPerfect 
              ? "You got everything right on the first try!" 
              : `You completed the lesson with ${mistakesInLesson} mistake${mistakesInLesson === 1 ? '' : 's'}.`}
          </p>
          
          <div className="bg-gradient-to-br from-xp/10 to-primary/10 border border-xp/20 rounded-2xl p-5 mb-6">
            <div className="flex items-center justify-center gap-2">
              <SparklesIcon className="w-8 h-8 text-xp" />
              <span className="text-3xl font-bold text-text">+{challenges.length * 10}</span>
              <span className="text-lg text-xp font-semibold">XP</span>
            </div>
          </div>
          
          <Button onClick={handleComplete} disabled={isCompleting} fullWidth>
            {isCompleting ? "Saving..." : "Continue"}
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-md mx-auto px-4 py-6 pb-28">
      {/* Header with Hearts */}
      <div className="flex items-center justify-between mb-6">
         {/* Progress Bar */}
         <div className="h-4 bg-border rounded-full overflow-hidden flex-1 mr-4">
          <div
            className="h-full bg-gradient-to-r from-primary to-primary-light rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        {/* Hearts Count */}
        <div className="flex items-center gap-1 text-hearts font-bold">
          <HeartIcon className="w-6 h-6 animate-pulse" />
          <span>{hearts}</span>
        </div>
      </div>

      {/* Lesson Title */}
      <h1 className="text-lg font-bold text-text mb-2">{lesson.title}</h1>

      {/* Question */}
      <div className="mb-6">
        <p className="text-xl font-semibold text-text leading-relaxed">
          {currentChallenge.question}
        </p>
      </div>

      {/* Options */}
      <div className="space-y-3 mb-8">
        {currentChallenge.options.map((option: ChallengeOption, index: number) => {
          const isSelected = selectedAnswer === option.text;
          const isCorrectAnswer = option.text === currentChallenge.correct_answer;
          
          let borderColor = "border-border";
          let bgColor = "bg-white";
          let animation = "";
          
          if (isAnswered) {
            // Only reveal green if the USER found the correct answer
            if (isCorrectAnswer && isCorrect) {
              borderColor = "border-success";
              bgColor = "bg-success/5";
            } else if (isSelected && !isCorrect) {
              borderColor = "border-hearts";
              bgColor = "bg-hearts/5";
              animation = "animate-shake";
            }
          } else if (isSelected) {
            borderColor = "border-primary";
            bgColor = "bg-primary-50";
          }

          return (
            <button
              key={index}
              onClick={() => handleSelectAnswer(option.text)}
              disabled={isAnswered}
              className={`
                w-full p-4 rounded-2xl border-2 text-left transition-all shadow-card
                ${borderColor} ${bgColor} ${animation}
                ${!isAnswered ? "hover:border-primary/50 hover:shadow-card-hover active:scale-[0.98]" : ""}
                disabled:cursor-not-allowed
              `}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm
                    ${isSelected && !isAnswered ? "bg-primary text-white" : "bg-primary-50 text-text"}
                    ${isAnswered && isCorrectAnswer && isCorrect ? "bg-success text-white" : ""}
                    ${isAnswered && isSelected && !isCorrect ? "bg-hearts text-white" : ""}
                  `}
                >
                  {String.fromCharCode(65 + index)}
                </div>
                <span className="font-medium text-text flex-1">{option.text}</span>
                {isAnswered && isCorrectAnswer && isCorrect && (
                  <CheckCircleIcon className="w-6 h-6 text-success" />
                )}
                {isAnswered && isSelected && !isCorrect && (
                  <XCircleIcon className="w-6 h-6 text-hearts" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Feedback Message with Finny */}
      {isAnswered && (
        <div
          className={`
            p-4 rounded-2xl mb-4 flex items-center gap-4
            ${isCorrect ? "bg-success/10 border border-success/20" : "bg-hearts/10 border border-hearts/20"}
          `}
        >
          <Finny pose={isCorrect ? "celebrate" : "sad"} size={50} />
          <div className="flex-1">
            <p className={`font-semibold ${isCorrect ? "text-success" : "text-hearts"}`}>
              {isCorrect ? "Correct! Great job!" : "Not quite right"}
            </p>
            <p className="text-sm text-muted">
              {isCorrect ? "Keep up the great work!" : "Don't give up, try again!"}
            </p>
          </div>
        </div>
      )}

      {/* Action Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-border safe-bottom">
        <div className="max-w-md mx-auto">
          {!isAnswered ? (
            <Button
              fullWidth
              disabled={!selectedAnswer}
              onClick={handleCheckAnswer}
            >
              Check Answer
            </Button>
          ) : (
            <Button
              fullWidth
              onClick={isCorrect ? handleContinue : handleRetry}
              variant={isCorrect ? "success" : "secondary"}
            >
              {isCorrect ? "Continue" : "Try Again"}
            </Button>
          )}
        </div>
      </div>

      {/* Level Up Modal */}
      {levelUpData && (
        <LevelUpModal 
            newLevel={levelUpData.newLevel} 
            onClose={handleLevelUpClose} 
        />
      )}
    </main>
  );
}

export default LessonContent;

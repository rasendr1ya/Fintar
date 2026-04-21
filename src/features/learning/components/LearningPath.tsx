"use client";

import type { Unit, Lesson, UserProgress } from "@/types/database";
import { UnitHeader } from "./UnitHeader";
import { LessonButton } from "./LessonButton";

interface UnitWithLessons extends Unit {
  lessons: Lesson[];
}

interface LearningPathProps {
  units: UnitWithLessons[];
  userProgress: UserProgress[];
}

// Color mapping for unit themes
const themeColors: Record<string, { bg: string; border: string; text: string; light: string }> = {
  "slate-gray": { bg: "bg-slate-500", border: "border-slate-700", text: "text-slate-600", light: "bg-slate-100" },
  blue: { bg: "bg-blue-500", border: "border-blue-700", text: "text-blue-500", light: "bg-blue-100" },
  green: { bg: "bg-emerald-500", border: "border-emerald-700", text: "text-emerald-500", light: "bg-emerald-100" },
  purple: { bg: "bg-purple-500", border: "border-purple-700", text: "text-purple-500", light: "bg-purple-100" },
  orange: { bg: "bg-orange-500", border: "border-orange-700", text: "text-orange-500", light: "bg-orange-100" },
  yellow: { bg: "bg-yellow-500", border: "border-yellow-700", text: "text-yellow-600", light: "bg-yellow-100" },
  red: { bg: "bg-rose-500", border: "border-rose-700", text: "text-rose-500", light: "bg-rose-100" },
  default: { bg: "bg-slate-500", border: "border-slate-700", text: "text-slate-500", light: "bg-slate-100" },
};

function darkenHexColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.max((num >> 16) - amt, 0);
  const G = Math.max(((num >> 8) & 0x00ff) - amt, 0);
  const B = Math.max((num & 0x0000ff) - amt, 0);
  return (
    "#" +
    (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)
  );
}

function getThemeColors(theme: string) {
  // Handle hex color codes from database (e.g. "#7C3AED")
  if (theme && theme.startsWith("#")) {
    return {
      bg: theme,
      border: darkenHexColor(theme, 40),
      text: theme,
      light: theme,
      isHex: true,
    };
  }
  return themeColors[theme] || themeColors.default;
}

// Zig-zag offset pattern (pixels)
const pathOffsets = [0, 60, 90, 60, 0, -60, -90, -60];

export function LearningPath({ units, userProgress }: LearningPathProps) {
  const completedLessonIds = new Set(userProgress.map((p) => p.lesson_id));

  // Calculate current active lesson (first uncompleted lesson)
  // Flatten all lessons to find the global index
  const allLessons = units.flatMap(u => u.lessons);
  const firstUncompletedIndex = allLessons.findIndex(l => !completedLessonIds.has(l.id));
  const activeLessonId = firstUncompletedIndex !== -1 ? allLessons[firstUncompletedIndex]?.id : null;

  return (
    <div className="flex flex-col gap-16 pb-32">
      {units.map((unit) => {
        const colors = getThemeColors(unit.color_theme || "default");
        
        // Stats for header
        const unitCompletedCount = unit.lessons.filter(l => completedLessonIds.has(l.id)).length;
        
        return (
          <div key={unit.id} className="relative">
            <UnitHeader 
              unit={unit} 
              colorTheme={colors} 
              completedCount={unitCompletedCount}
              totalCount={unit.lessons.length}
            />
            
            <div className="flex flex-col items-center py-4 relative min-h-[200px]">
              {unit.lessons.map((lesson, index) => {
                const isCompleted = completedLessonIds.has(lesson.id);
                const isCurrent = lesson.id === activeLessonId;
                const isLocked = !isCompleted && !isCurrent;
                
                // Cycle through offsets
                const offsetIndex = index % pathOffsets.length;
                const xOffset = pathOffsets[offsetIndex];

                return (
                  <div key={lesson.id} className="relative z-10 mb-8 last:mb-0">
                    <LessonButton
                      id={lesson.id}
                      index={index}
                      total={unit.lessons.length}
                      status={isCompleted ? "completed" : isCurrent ? "current" : "locked"}
                      xOffset={xOffset}
                      colorTheme={colors}
                      isLast={index === unit.lessons.length - 1}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default LearningPath;

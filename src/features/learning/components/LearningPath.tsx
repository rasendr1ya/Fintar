"use client";

import { UnitWithLessons } from "@/features/learning/actions/lessons";
import { UnitHeader } from "./UnitHeader";
import { LessonButton } from "./LessonButton";
import { Finny } from "@/components/mascot/Finny";

interface LearningPathProps {
  units: UnitWithLessons[];
  completedLessonIds: Set<string>;
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

export function LearningPath({ units, completedLessonIds }: LearningPathProps) {
  // Tentukan posisi Finny — hanya 1 di seluruh path
  // Yaitu: lesson pertama yang belum completed dari semua unit
  let finnyLessonId: string | null = null;

  for (const unit of units) {
    const firstUncompleted = unit.lessons.find(
      (lesson) => !completedLessonIds.has(lesson.id)
    );
    if (firstUncompleted) {
      finnyLessonId = firstUncompleted.id;
      break; // Stop — hanya 1 Finny
    }
  }

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
              {unit.lessons.map((lesson, lessonIndex) => {
                const isCompleted = completedLessonIds.has(lesson.id);

                // Cari index lesson pertama yang belum selesai di unit ini
                const firstUncompletedIndex = unit.lessons.findIndex(
                  (l) => !completedLessonIds.has(l.id)
                );

                const isCurrent =
                  firstUncompletedIndex !== -1 &&
                  lessonIndex === firstUncompletedIndex;

                const isLocked =
                  !isCompleted &&
                  (firstUncompletedIndex === -1 ||
                    lessonIndex > firstUncompletedIndex);

                const status: "completed" | "current" | "locked" =
                  isCompleted ? "completed" : isCurrent ? "current" : "locked";

                // Cycle through offsets
                const offsetIndex = lessonIndex % pathOffsets.length;
                const xOffset = pathOffsets[offsetIndex];

                const isFinnyHere = lesson.id === finnyLessonId;

                return (
                  <div
                    key={lesson.id}
                    className="relative z-10 mb-8 last:mb-0"
                    style={{ transform: `translateX(${xOffset}px)` }}
                  >
                    {/* Finny muncul di atas lesson current global */}
                    {isFinnyHere && (
                      <div className="absolute -top-20 left-1/2 -translate-x-1/2 animate-bounce-subtle z-20 pointer-events-none">
                        <div className="bg-white px-4 py-2 rounded-2xl shadow-xl border-2 border-primary/10 mb-2 whitespace-nowrap text-sm font-extrabold text-primary text-center relative">
                          Mulai!
                          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white rotate-45 border-b-2 border-r-2 border-primary/10" />
                        </div>
                        <Finny size={80} pose="default" />
                      </div>
                    )}

                    {/* Ripple Effect for Current */}
                    {isCurrent && (
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-white/30 rounded-full animate-pulse z-0" />
                    )}

                    <LessonButton
                      lesson={lesson}
                      status={status}
                      colorTheme={colors}
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

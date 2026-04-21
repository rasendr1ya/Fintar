import type { Unit } from "@/types/database";
import { BookOpenIcon, CheckCircleIcon } from "@heroicons/react/24/solid";

interface UnitHeaderProps {
  unit: Unit;
  colorTheme: { bg: string; border: string; text: string; light: string; isHex?: boolean };
  completedCount: number;
  totalCount: number;
}

export function UnitHeader({ unit, colorTheme, completedCount, totalCount }: UnitHeaderProps) {
  const progressPercent = Math.round((completedCount / totalCount) * 100) || 0;

  return (
    <div
      className={`
        w-full p-6 rounded-3xl mb-8 relative overflow-hidden
        text-white shadow-xl border-b-8
        transform transition-transform hover:scale-[1.01]
        ${colorTheme.isHex ? "" : colorTheme.bg}
        ${colorTheme.isHex ? "" : colorTheme.border}
      `}
      style={
        colorTheme.isHex
          ? {
              backgroundColor: colorTheme.bg,
              borderBottomColor: colorTheme.border,
            }
          : undefined
      }
    >
      {/* Background Pattern Overlay */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg width="100%" height="100%">
          <pattern id="pattern-circles" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="2" fill="currentColor" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#pattern-circles)" />
        </svg>
      </div>

      <div className="relative z-10 flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h2 className="text-2xl font-extrabold tracking-tight drop-shadow-md">{unit.title}</h2>
          </div>
          <p className="text-white/90 text-sm font-medium mb-4 leading-relaxed max-w-[90%]">
            {unit.description}
          </p>
          
          {/* Mini Progress Pill */}
          <div className="inline-flex items-center gap-2 bg-black/20 backdrop-blur-sm px-3 py-1.5 rounded-xl text-xs font-bold">
            <CheckCircleIcon className="w-4 h-4 text-white/80" />
            <span>{completedCount} / {totalCount} Completed</span>
          </div>
        </div>

        <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm shadow-inner">
          <BookOpenIcon className="w-8 h-8 text-white drop-shadow-sm" />
        </div>
      </div>

      {/* Bottom Progress Bar Line */}
      <div className="absolute bottom-0 left-0 h-2 bg-black/20 w-full">
        <div 
          className="h-full bg-white/40 transition-all duration-500 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
}

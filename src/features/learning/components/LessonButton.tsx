import Link from "next/link";
import { CheckIcon, StarIcon, LockClosedIcon } from "@heroicons/react/24/solid";
import { Finny } from "@/components/mascot/Finny";

interface LessonButtonProps {
  id: string;
  index: number;
  total: number;
  status: "locked" | "current" | "completed";
  xOffset: number;
  colorTheme: { bg: string; border: string; text: string; light: string; isHex?: boolean };
  isLast: boolean;
}

export function LessonButton({ id, status, xOffset, colorTheme, isLast }: LessonButtonProps) {
  const isCurrent = status === "current";
  const isLocked = status === "locked";
  const isCompleted = status === "completed";

  // Styles based on status
  let buttonStyle = "";
  let buttonBgStyle: React.CSSProperties | undefined = undefined;
  let icon = null;
  let shadowColor = "";

  if (isCompleted) {
    // Golden Coin Style for Completed
    buttonStyle = "bg-gradient-to-b from-amber-300 to-amber-500 border-amber-600 text-amber-900";
    shadowColor = "shadow-[0_4px_0_#d97706]"; // Amber-600 shadow
    icon = <CheckIcon className="w-8 h-8 drop-shadow-sm" />;
  } else if (isCurrent) {
    // Vibrant Theme Gem Style for Current
    if (colorTheme.isHex) {
      buttonStyle = "border-white/20 text-white";
      buttonBgStyle = { backgroundColor: colorTheme.bg };
    } else {
      buttonStyle = `${colorTheme.bg} border-white/20 text-white`;
    }
    shadowColor = "shadow-[0_4px_0_rgba(0,0,0,0.2)]"; 
    icon = <StarIcon className="w-8 h-8 drop-shadow-md animate-wiggle" />;
  } else {
    // Stone Style for Locked
    buttonStyle = "bg-slate-200 border-slate-300 text-slate-400";
    shadowColor = "shadow-[0_4px_0_#cbd5e1]"; // Slate-300
    icon = <LockClosedIcon className="w-6 h-6" />;
  }

  return (
    <div 
      className="relative flex justify-center"
      style={{ transform: `translateX(${xOffset}px)` }}
    >
      {/* Finny Mascot for Current Lesson */}
      {isCurrent && (
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

      <Link
        href={isLocked ? "#" : `/lesson/${id}`}
        className={`
          relative w-20 h-20 rounded-full flex items-center justify-center z-10
          transition-all duration-200 group
          border-4 
          ${buttonStyle}
          ${shadowColor}
          ${isLocked ? "cursor-not-allowed opacity-80" : "cursor-pointer active:translate-y-1 active:shadow-none hover:brightness-110"}
        `}
        style={buttonBgStyle}
      >
        {/* Inner Ring / Reflection for 3D look */}
        <div className="absolute inset-1 rounded-full border-2 border-white/30" />
        
        {/* Top Shine */}
        {!isLocked && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-8 h-3 bg-white/40 rounded-full blur-[2px]" />
        )}

        {/* The Icon */}
        <div className="relative z-10 transform transition-transform group-hover:scale-110">
          {icon}
        </div>
        
      </Link>
    </div>
  );
}

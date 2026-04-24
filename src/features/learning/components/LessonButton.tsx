import Link from "next/link";
import { CheckIcon, StarIcon, LockClosedIcon } from "@heroicons/react/24/solid";
import { LessonInPath } from "@/features/learning/actions/lessons";

interface LessonButtonProps {
  lesson: LessonInPath;
  status: "completed" | "current" | "locked";
  colorTheme: { bg: string; border: string; text: string; light: string; isHex?: boolean };
}

export function LessonButton({ lesson, status, colorTheme }: LessonButtonProps) {
  const isClickable = status === "completed" || status === "current";

  // Styles based on status
  let buttonStyle = "";
  let buttonBgStyle: React.CSSProperties | undefined = undefined;
  let icon = null;
  let shadowColor = "";

  if (status === "completed") {
    // Golden amber circle with simple white checkmark (prototype style)
    buttonStyle = "bg-amber-400 border-amber-600 text-white";
    shadowColor = "shadow-[0_4px_0_#d97706]"; // Amber-600 shadow
    icon = <CheckIcon className="w-8 h-8 text-black drop-shadow-sm" />;
  } else if (status === "current") {
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

  const buttonContent = (
    <div
      className={`
        relative w-20 h-20 rounded-full flex items-center justify-center z-10
        transition-all duration-200 group
        border-4 
        ${buttonStyle}
        ${shadowColor}
        ${!isClickable ? "cursor-not-allowed opacity-80" : "cursor-pointer active:translate-y-1 active:shadow-none hover:brightness-110"}
      `}
      style={buttonBgStyle}
    >
      {/* Inner Ring / Reflection for 3D look */}
      <div className="absolute inset-1 rounded-full border-2 border-white/30" />

      {/* Top Shine */}
      {isClickable && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-8 h-3 bg-white/40 rounded-full blur-[2px]" />
      )}

      {/* The Icon */}
      <div className="relative z-10 transform transition-transform group-hover:scale-110">
        {icon}
      </div>
    </div>
  );

  // Locked: tidak bisa diklik
  if (!isClickable) {
    return <div className="relative flex justify-center">{buttonContent}</div>;
  }

  // Completed/Current: link ke quiz
  return (
    <Link href={`/lesson/${lesson.id}`} className="relative flex justify-center">
      {buttonContent}
    </Link>
  );
}

import { Finny } from "@/components/mascot/Finny";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  withText?: boolean;
  variant?: "light" | "dark";
  animated?: boolean;
}

export function Logo({ size = "md", withText = true, variant = "dark", animated = true }: LogoProps) {
  // Size mapping
  const sizes = {
    sm: { container: "w-9 h-9", mascot: 28, text: "text-lg" },
    md: { container: "w-11 h-11", mascot: 36, text: "text-2xl" },
    lg: { container: "w-14 h-14", mascot: 48, text: "text-3xl" },
  };

  const { container, mascot, text } = sizes[size];
  const textColor = variant === "light" ? "text-white" : "text-text";

  return (
    <div className="flex items-center gap-3 select-none">
      {/* Icon Container - Circle with white/cream gradient */}
      <div className={`
        relative ${container} rounded-full
        bg-linear-to-br from-white via-gray-50 to-gray-100
        shadow-lg shadow-black/15 
        flex items-center justify-center 
        border-2 border-white/80
      `}>
        {/* Inner highlight for depth */}
        <div className="absolute inset-0 rounded-full bg-linear-to-t from-gray-200/50 via-transparent to-white/80" />
        
        {/* Subtle ring shadow inset */}
        <div className="absolute inset-1 rounded-full shadow-inner shadow-gray-300/50" />
        
        {/* Mascot Container - Positioned to peek out */}
        <div 
          className={`
            absolute top-0 left-1/2 -translate-x-1/2
            ${animated ? 'animate-logo-peek' : 'translate-y-[10%] scale-125'}
          `}
          style={{ transformOrigin: 'bottom center' }}
        >
          <Finny size={mascot} pose="default" />
        </div>
        
        {/* Bottom mask to hide Finny's lower body - white gradient */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-2/5 rounded-b-full bg-linear-to-t from-gray-100 via-gray-50/90 to-transparent"
        />
      </div>

      {/* Logotype */}
      {withText && (
        <span className={`
          font-heading font-extrabold tracking-tight ${text}
          ${textColor}
        `}>
          Fintar
        </span>
      )}
    </div>
  );
}

export default Logo;

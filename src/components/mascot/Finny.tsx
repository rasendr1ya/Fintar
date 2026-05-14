import { SVGProps } from "react";

interface FinnyProps extends SVGProps<SVGSVGElement> {
  size?: number;
  pose?: "default" | "celebrate" | "thinking" | "sad" | "waving" | "reading" | "headset" | "writing" | "teaching" | "tip";
}

export function Finny({ size = 200, pose = "default", className, ...props }: FinnyProps) {
  // Arm positions based on pose
  const getArmTransform = () => {
    switch (pose) {
      case "celebrate":
        return { left: "rotate(-45deg)", right: "rotate(45deg)", leftY: -10, rightY: -10, leftOriginX: 70, leftOriginY: 125, rightOriginX: 130, rightOriginY: 125 };
      case "waving":
        return { left: "rotate(0deg)", right: "rotate(-30deg)", leftY: 0, rightY: -10, leftOriginX: 70, leftOriginY: 140, rightOriginX: 130, rightOriginY: 140 };
      case "thinking":
        return { left: "rotate(0deg)", right: "rotate(-60deg)", leftY: 0, rightY: -20, leftOriginX: 70, leftOriginY: 140, rightOriginX: 130, rightOriginY: 140 };
      case "sad":
        return { left: "rotate(15deg)", right: "rotate(-15deg)", leftY: 5, rightY: 5, leftOriginX: 70, leftOriginY: 140, rightOriginX: 130, rightOriginY: 140 };
      case "reading":
        return { left: "rotate(-30deg)", right: "rotate(30deg)", leftY: -10, rightY: -10, leftOriginX: 70, leftOriginY: 140, rightOriginX: 130, rightOriginY: 140 };
      case "headset":
        return { left: "rotate(-10deg)", right: "rotate(10deg)", leftY: -5, rightY: -5, leftOriginX: 70, leftOriginY: 140, rightOriginX: 130, rightOriginY: 140 };
      case "writing":
        return { left: "rotate(-25deg)", right: "rotate(35deg)", leftY: -8, rightY: -15, leftOriginX: 70, leftOriginY: 140, rightOriginX: 130, rightOriginY: 140 };
      case "teaching":
        return { left: "rotate(-5deg)", right: "rotate(-80deg)", leftY: 0, rightY: -25, leftOriginX: 70, leftOriginY: 140, rightOriginX: 130, rightOriginY: 140 };
      case "tip":
        return { left: "rotate(0deg)", right: "rotate(-20deg)", leftY: 0, rightY: -5, leftOriginX: 70, leftOriginY: 140, rightOriginX: 130, rightOriginY: 140 };
      default:
        return { left: "rotate(0deg)", right: "rotate(0deg)", leftY: 0, rightY: 0, leftOriginX: 70, leftOriginY: 140, rightOriginX: 130, rightOriginY: 140 };
    }
  };

  // Eye style based on pose
  const getEyeStyle = () => {
    switch (pose) {
      case "celebrate":
        return "happy";
      case "sad":
        return "sad";
      case "thinking":
        return "looking-up";
      case "reading":
        return "looking-down";
      case "writing":
        return "looking-down";
      default:
        return "normal";
    }
  };

  // Mouth style based on pose
  const getMouthPath = () => {
    switch (pose) {
      case "celebrate":
        return "M 90 105 Q 100 118 110 105";
      case "sad":
        return "M 90 110 Q 100 100 110 110";
      case "thinking":
        return "M 95 107 L 105 107";
      case "reading":
        return "M 95 107 L 105 107";
      case "writing":
        return "M 95 107 L 105 107";
      default:
        return "M 90 105 Q 100 112 110 105";
    }
  };

  const armTransform = getArmTransform();
  const eyeStyle = getEyeStyle();

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      {/* Tail */}
      <ellipse
        cx="145"
        cy="155"
        rx="25"
        ry="12"
        fill="#F97316"
        transform="rotate(-30 145 155)"
      />
      <ellipse
        cx="160"
        cy="148"
        rx="10"
        ry="6"
        fill="#FEF3C7"
        transform="rotate(-30 160 148)"
      />

      {/* Body */}
      <ellipse cx="100" cy="150" rx="45" ry="35" fill="#F97316" />
      
      {/* Belly */}
      <ellipse cx="100" cy="155" rx="30" ry="25" fill="#FEF3C7" />

      {/* Left Arm */}
      <g style={{ transformOrigin: `${armTransform.leftOriginX}px ${armTransform.leftOriginY}px`, transform: armTransform.left }}>
        <ellipse
          cx="55"
          cy={145 + armTransform.leftY}
          rx="12"
          ry="18"
          fill="#F97316"
        />
      </g>

      {/* Right Arm */}
      <g
        style={{
          transformOrigin: `${armTransform.rightOriginX}px ${armTransform.rightOriginY}px`,
          transform: pose === "waving" ? undefined : armTransform.right
        }}
        className={pose === "waving" ? "animate-wave" : ""}
      >
        <ellipse
          cx="145"
          cy={145 + armTransform.rightY}
          rx="12"
          ry="18"
          fill="#F97316"
        />
      </g>

      {/* Head & Ears Base Shape (Fused) */}
      <path
        d="M 55 85 
           A 45 45 0 0 0 145 85 
           A 45 45 0 0 0 140 55 
           L 128 18 
           L 112 52 
           Q 100 48 88 52 
           L 72 18 
           L 60 55 
           A 45 45 0 0 0 55 85 
           Z"
        fill="#F97316"
      />

      {/* Inner Ears (Layered on top) */}
      <polygon points="66,52 72,30 82,50" fill="#FEF3C7" />
      <polygon points="118,50 128,30 134,52" fill="#FEF3C7" />

      {/* Face mask (white area) */}
      <ellipse cx="100" cy="95" rx="32" ry="28" fill="#FEF3C7" />

      {/* Eyes */}
      {eyeStyle === "happy" ? (
        <>
          {/* Happy closed eyes */}
          <path d="M 78 78 Q 83 72 88 78" stroke="#0F172A" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M 112 78 Q 117 72 122 78" stroke="#0F172A" strokeWidth="3" fill="none" strokeLinecap="round" />
        </>
      ) : eyeStyle === "sad" ? (
        <>
          {/* Sad eyes */}
          <circle cx="83" cy="78" r="7" fill="#0F172A" />
          <circle cx="117" cy="78" r="7" fill="#0F172A" />
          <circle cx="85" cy="76" r="2" fill="white" />
          <circle cx="119" cy="76" r="2" fill="white" />
          {/* Sad eyebrows */}
          <path d="M 75 68 Q 83 72 91 70" stroke="#0F172A" strokeWidth="2" fill="none" />
          <path d="M 125 68 Q 117 72 109 70" stroke="#0F172A" strokeWidth="2" fill="none" />
        </>
      ) : eyeStyle === "looking-up" ? (
        <>
          {/* Looking up eyes */}
          <circle cx="83" cy="75" r="8" fill="#0F172A" />
          <circle cx="117" cy="75" r="8" fill="#0F172A" />
          <circle cx="85" cy="72" r="3" fill="white" />
          <circle cx="119" cy="72" r="3" fill="white" />
        </>
      ) : eyeStyle === "looking-down" ? (
        <>
          {/* Looking down eyes */}
          <circle cx="83" cy="80" r="8" fill="#0F172A" />
          <circle cx="117" cy="80" r="8" fill="#0F172A" />
          <circle cx="85" cy="77" r="3" fill="white" />
          <circle cx="119" cy="77" r="3" fill="white" />
          {/* Glasses frame */}
          <circle cx="83" cy="80" r="14" stroke="#000" strokeWidth="2" fill="none" opacity="0.7" />
          <circle cx="117" cy="80" r="14" stroke="#000" strokeWidth="2" fill="none" opacity="0.7" />
          <line x1="97" y1="80" x2="103" y2="80" stroke="#000" strokeWidth="2" opacity="0.7" />
        </>
      ) : (
        <>
          {/* Normal eyes */}
          <circle cx="83" cy="78" r="8" fill="#0F172A" />
          <circle cx="117" cy="78" r="8" fill="#0F172A" />
          {/* Eye shine */}
          <circle cx="86" cy="75" r="3" fill="white" />
          <circle cx="120" cy="75" r="3" fill="white" />
        </>
      )}

      {/* Nose */}
      <ellipse cx="100" cy="92" rx="6" ry="5" fill="#0F172A" />
      {/* Nose shine */}
      <ellipse cx="98" cy="90" rx="2" ry="1.5" fill="#374151" />

      {/* Mouth */}
      <path
        d={getMouthPath()}
        stroke="#0F172A"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />

      {/* Cheek blush */}
      <ellipse cx="65" cy="90" rx="8" ry="5" fill="#FECACA" opacity="0.6" />
      <ellipse cx="135" cy="90" rx="8" ry="5" fill="#FECACA" opacity="0.6" />

      {/* Accessory - Purple scarf/bandana */}
      <path
        d="M 60 115 Q 100 125 140 115 Q 138 122 100 130 Q 62 122 60 115"
        fill="#7C3AED"
      />
      <circle cx="100" cy="120" r="5" fill="#6D28D9" />

      {/* Headset for admin/support pose */}
      {pose === "headset" && (
        <>
          {/* Headband arc over head */}
          <path
            d="M 52 72 C 52 28, 148 28, 148 72"
            stroke="#374151"
            strokeWidth="5"
            fill="none"
            strokeLinecap="round"
          />
          {/* Left earpiece */}
          <rect x="44" y="68" width="14" height="18" rx="4" fill="#374151" />
          <rect x="47" y="71" width="8" height="12" rx="2" fill="#4B5563" />
          {/* Right earpiece */}
          <rect x="142" y="68" width="14" height="18" rx="4" fill="#374151" />
          <rect x="145" y="71" width="8" height="12" rx="2" fill="#4B5563" />
          {/* Mic boom from left earpiece */}
          <path
            d="M 49 86 L 55 100 L 90 105"
            stroke="#374151"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Mic tip */}
          <rect x="88" y="101" width="8" height="10" rx="4" fill="#4B5563" />
          {/* Mic mesh dots */}
          <circle cx="91" cy="104.5" r="1" fill="#374151" />
          <circle cx="93" cy="104.5" r="1" fill="#374151" />
          <circle cx="91" cy="107.5" r="1" fill="#374151" />
          <circle cx="93" cy="107.5" r="1" fill="#374151" />
        </>
      )}

      {/* Stars for celebrate pose */}
      {pose === "celebrate" && (
        <>
          <polygon
            points="45,40 47,46 53,46 48,50 50,56 45,52 40,56 42,50 37,46 43,46"
            fill="#FBBF24"
          />
          <polygon
            points="155,40 157,46 163,46 158,50 160,56 155,52 150,56 152,50 147,46 153,46"
            fill="#FBBF24"
          />
          <polygon
            points="100,15 101,18 104,18 102,20 103,23 100,21 97,23 98,20 96,18 99,18"
            fill="#FBBF24"
          />
        </>
      )}

      {/* Question mark for thinking pose */}
      {pose === "thinking" && (
        <text x="150" y="50" fontSize="24" fill="#7C3AED" fontWeight="bold">
          ?
        </text>
      )}

      {/* Book for reading pose */}
      {pose === "reading" && (
        <path 
            d="M 60 145 L 140 145 L 135 170 L 65 170 Z" 
            fill="#3B82F6" 
        />
      )}

      {/* Document + Pen for writing pose (Blog CMS) */}
      {pose === "writing" && (
        <>
          {/* Paper / document */}
          <path
            d="M 50 142 L 130 142 L 125 172 L 55 172 Z"
            fill="#FEF9C3"
            stroke="#EAB308"
            strokeWidth="1.5"
          />
          {/* Paper lines */}
          <line x1="62" y1="150" x2="120" y2="150" stroke="#FDE68A" strokeWidth="1.5" />
          <line x1="62" y1="156" x2="115" y2="156" stroke="#FDE68A" strokeWidth="1.5" />
          <line x1="62" y1="162" x2="110" y2="162" stroke="#FDE68A" strokeWidth="1.5" />
          {/* Pen in right hand */}
          <g transform="rotate(45, 138, 130)">
            <rect x="136" y="122" width="5" height="22" rx="2" fill="#374151" />
            <polygon points="136,122 138.5,114 141,122" fill="#1E293B" />
            <rect x="136" y="138" width="5" height="4" rx="1" fill="#F97316" />
          </g>
        </>
      )}

      {/* Whiteboard + Pointer for teaching pose (Lesson CMS) */}
      {pose === "teaching" && (
        <>
          {/* Easel stand — tripod legs */}
          <line x1="50" y1="170" x2="42" y2="128" stroke="#78350F" strokeWidth="3" strokeLinecap="round" />
          <line x1="50" y1="170" x2="58" y2="128" stroke="#78350F" strokeWidth="3" strokeLinecap="round" />
          <line x1="50" y1="170" x2="50" y2="132" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" />
          {/* Whiteboard frame */}
          <rect x="28" y="100" width="48" height="36" rx="3" fill="#92400E" />
          {/* Whiteboard surface */}
          <rect x="32" y="104" width="40" height="28" rx="2" fill="#F8FAFC" />
          {/* Chart content — bar chart */}
          <rect x="36" y="120" width="6" height="8" rx="1" fill="#3B82F6" />
          <rect x="44" y="116" width="6" height="12" rx="1" fill="#10B981" />
          <rect x="52" y="112" width="6" height="16" rx="1" fill="#F59E0B" />
          {/* Chart baseline */}
          <line x1="34" y1="128" x2="60" y2="128" stroke="#94A3B8" strokeWidth="0.8" />
          {/* Small star decoration */}
          <polygon points="60,106 61,109 64,109 61.5,111 62.5,114 60,112 57.5,114 58.5,111 56,109 59,109" fill="#FBBF24" />
          {/* Eraser shelf */}
          <rect x="34" y="130" width="36" height="3" rx="1" fill="#D1D5DB" />
          {/* Pointer stick in right hand */}
          <line x1="155" y1="118" x2="175" y2="175" stroke="#78350F" strokeWidth="3" strokeLinecap="round" />
          {/* Pointer tip */}
          <circle cx="175" cy="175" r="3" fill="#EF4444" />
        </>
      )}

      {/* Light bulb for tip pose — glowing idea above head */}
      {pose === "tip" && (
        <>
          {/* Glow halo behind bulb */}
          <circle cx="148" cy="30" r="18" fill="#FEF3C7" opacity="0.5" />
          {/* Bulb glass */}
          <path
            d="M 140 30 C 140 16, 156 16, 156 30 C 156 38, 152 41, 151 46 L 145 46 C 144 41, 140 38, 140 30 Z"
            fill="#FBBF24"
          />
          {/* Bulb screw base */}
          <rect x="143" y="46" width="10" height="5" rx="1.5" fill="#94A3B8" />
          <rect x="144.5" y="49" width="7" height="1.5" rx="0.5" fill="#64748B" />
          {/* Filament lines inside bulb */}
          <path d="M 145 36 L 147 30 L 149 28" stroke="#F59E0B" strokeWidth="1.2" fill="none" strokeLinecap="round" />
          <path d="M 151 36 L 149 30 L 147 28" stroke="#F59E0B" strokeWidth="1.2" fill="none" strokeLinecap="round" />
          {/* Shine on glass */}
          <ellipse cx="144" cy="24" rx="3" ry="4" fill="white" opacity="0.5" transform="rotate(-20, 144, 24)" />
          {/* Small glow rays */}
          <line x1="130" y1="30" x2="126" y2="30" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
          <line x1="166" y1="30" x2="170" y2="30" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
          <line x1="148" y1="12" x2="148" y2="8" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
          <line x1="134" y1="20" x2="131" y2="18" stroke="#FBBF24" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
          <line x1="162" y1="20" x2="165" y2="18" stroke="#FBBF24" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
        </>
      )}
    </svg>
  );
}

export default Finny;

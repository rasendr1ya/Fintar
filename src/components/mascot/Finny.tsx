import { SVGProps } from "react";

interface FinnyProps extends SVGProps<SVGSVGElement> {
  size?: number;
  pose?: "default" | "celebrate" | "thinking" | "sad" | "waving" | "reading";
}

export function Finny({ size = 200, pose = "default", className, ...props }: FinnyProps) {
  // Arm positions based on pose
  const getArmTransform = () => {
    switch (pose) {
      case "celebrate":
        return { left: "rotate(-45deg)", right: "rotate(45deg)", leftY: -15, rightY: -15 };
      case "waving":
        return { left: "rotate(0deg)", right: "rotate(-30deg)", leftY: 0, rightY: -10 };
      case "thinking":
        return { left: "rotate(0deg)", right: "rotate(-60deg)", leftY: 0, rightY: -20 };
      case "sad":
        return { left: "rotate(15deg)", right: "rotate(-15deg)", leftY: 5, rightY: 5 };
      case "reading":
        return { left: "rotate(-30deg)", right: "rotate(30deg)", leftY: -10, rightY: -10 };
      default:
        return { left: "rotate(0deg)", right: "rotate(0deg)", leftY: 0, rightY: 0 };
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
      <g style={{ transformOrigin: "70px 140px", transform: armTransform.left }}>
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
          transformOrigin: "130px 140px", 
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
    </svg>
  );
}

export default Finny;

// Illustrated SVG components for the Financial Forest theme

interface IllustrationProps {
  className?: string;
}

// Twinkling stars scattered in the sky
export function Stars({ className = "" }: IllustrationProps) {
  return (
    <svg className={className} viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Big stars */}
      <circle cx="50" cy="30" r="3" fill="white" opacity="0.9">
        <animate attributeName="opacity" values="0.9;0.4;0.9" dur="2s" repeatCount="indefinite" />
      </circle>
      <circle cx="120" cy="60" r="2" fill="white" opacity="0.7">
        <animate attributeName="opacity" values="0.7;0.3;0.7" dur="2.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="200" cy="25" r="2.5" fill="white" opacity="0.8">
        <animate attributeName="opacity" values="0.8;0.4;0.8" dur="3s" repeatCount="indefinite" />
      </circle>
      <circle cx="280" cy="45" r="2" fill="white" opacity="0.6">
        <animate attributeName="opacity" values="0.6;0.2;0.6" dur="2.2s" repeatCount="indefinite" />
      </circle>
      <circle cx="350" cy="20" r="3" fill="white" opacity="0.9">
        <animate attributeName="opacity" values="0.9;0.5;0.9" dur="2.8s" repeatCount="indefinite" />
      </circle>
      <circle cx="380" cy="70" r="1.5" fill="white" opacity="0.5">
        <animate attributeName="opacity" values="0.5;0.2;0.5" dur="1.8s" repeatCount="indefinite" />
      </circle>
      {/* Small stars */}
      <circle cx="80" cy="80" r="1" fill="white" opacity="0.4" />
      <circle cx="150" cy="40" r="1" fill="white" opacity="0.3" />
      <circle cx="240" cy="70" r="1" fill="white" opacity="0.5" />
      <circle cx="310" cy="30" r="1" fill="white" opacity="0.4" />
      <circle cx="170" cy="90" r="1" fill="white" opacity="0.3" />
      <circle cx="60" cy="55" r="1" fill="white" opacity="0.4" />
      <circle cx="330" cy="85" r="1" fill="white" opacity="0.3" />
    </svg>
  );
}

// Crescent moon with glow
export function Moon({ className = "" }: IllustrationProps) {
  return (
    <svg className={className} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Glow */}
      <circle cx="40" cy="40" r="35" fill="#FEF3C7" opacity="0.15" />
      <circle cx="40" cy="40" r="28" fill="#FEF3C7" opacity="0.2" />
      {/* Moon */}
      <path
        d="M55 40C55 51.0457 46.0457 60 35 60C29.5 60 24.5 57.8 20.8 54.2C24.5 58.5 29.9 61.2 36 61.2C47.6 61.2 57 51.8 57 40.2C57 28.6 47.6 19.2 36 19.2C29.9 19.2 24.5 21.9 20.8 26.2C24.5 22.6 29.5 20.4 35 20.4C46.0457 20.4 55 29.3543 55 40.4V40Z"
        fill="#FEF3C7"
      />
    </svg>
  );
}

// Fluffy cartoon clouds
export function Cloud({ className = "" }: IllustrationProps) {
  return (
    <svg className={className} viewBox="0 0 120 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="35" cy="35" rx="25" ry="20" fill="white" opacity="0.9" />
      <ellipse cx="60" cy="30" rx="30" ry="22" fill="white" opacity="0.95" />
      <ellipse cx="85" cy="35" rx="25" ry="18" fill="white" opacity="0.9" />
      <ellipse cx="50" cy="40" rx="20" ry="15" fill="white" opacity="0.85" />
      <ellipse cx="70" cy="42" rx="18" ry="14" fill="white" opacity="0.85" />
    </svg>
  );
}

// Small cloud variant
export function CloudSmall({ className = "" }: IllustrationProps) {
  return (
    <svg className={className} viewBox="0 0 80 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="25" cy="22" rx="18" ry="14" fill="white" opacity="0.85" />
      <ellipse cx="45" cy="20" rx="22" ry="16" fill="white" opacity="0.9" />
      <ellipse cx="60" cy="24" rx="16" ry="12" fill="white" opacity="0.8" />
    </svg>
  );
}

// Rolling hills for the bottom transition
export function Hills({ className = "" }: IllustrationProps) {
  return (
    <svg className={className} viewBox="0 0 1440 320" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
      {/* Back hill - darker */}
      <path
        d="M0 320L0 180C120 120 240 100 360 120C480 140 600 200 720 200C840 200 960 140 1080 120C1200 100 1320 120 1440 160L1440 320L0 320Z"
        fill="#166534"
      />
      {/* Front hill - lighter */}
      <path
        d="M0 320L0 220C180 160 300 180 480 200C660 220 780 180 960 180C1140 180 1260 220 1440 240L1440 320L0 320Z"
        fill="#22C55E"
      />
    </svg>
  );
}

// Stylized money tree with shimmer effect on coins
export function MoneyTree({ className = "" }: IllustrationProps) {
  return (
    <svg className={className} viewBox="0 0 300 400" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Tree trunk - more textured and tapered */}
      <path
        d="M135 400L135 250C135 230 120 220 110 180C130 200 145 220 150 250L150 400H135Z"
        fill="#78350F"
      />
      <path
        d="M150 400L150 240C150 220 170 200 180 170C165 200 155 220 155 250L155 400H150Z"
        fill="#92400E"
      />
      
      {/* Branch */}
      <path d="M145 260 Q 120 240 100 250" stroke="#78350F" strokeWidth="8" strokeLinecap="round" />
      <path d="M155 240 Q 180 220 200 230" stroke="#92400E" strokeWidth="8" strokeLinecap="round" />

      {/* Tree foliage - Clumped style for organic look */}
      {/* Bottom layer (darkest) */}
      <circle cx="100" cy="250" r="45" fill="#14532D" />
      <circle cx="200" cy="230" r="40" fill="#14532D" />
      <circle cx="150" cy="200" r="50" fill="#14532D" />

      {/* Middle layer */}
      <circle cx="80" cy="220" r="40" fill="#166534" />
      <circle cx="220" cy="200" r="35" fill="#166534" />
      <circle cx="130" cy="180" r="45" fill="#166534" />
      <circle cx="170" cy="180" r="45" fill="#166534" />

      {/* Top layer (lightest) */}
      <circle cx="110" cy="150" r="40" fill="#22C55E" />
      <circle cx="190" cy="150" r="38" fill="#22C55E" />
      <circle cx="150" cy="120" r="45" fill="#4ADE80" />
      
      {/* Coins on tree - with shimmer animation classes */}
      {/* Large coins */}
      <g className="animate-coin-shimmer">
        <circle cx="150" cy="120" r="14" fill="#FBBF24" stroke="#F59E0B" strokeWidth="2.5" />
        <text x="150" y="125" textAnchor="middle" fill="#92400E" fontSize="14" fontWeight="bold">$</text>
      </g>
      
      <g className="animate-coin-shimmer" style={{ animationDelay: '0.5s' }}>
        <circle cx="110" cy="150" r="12" fill="#FBBF24" stroke="#F59E0B" strokeWidth="2" />
        <text x="110" y="154" textAnchor="middle" fill="#92400E" fontSize="12" fontWeight="bold">$</text>
      </g>

      <g className="animate-coin-shimmer" style={{ animationDelay: '1s' }}>
        <circle cx="190" cy="160" r="12" fill="#FBBF24" stroke="#F59E0B" strokeWidth="2" />
        <text x="190" y="164" textAnchor="middle" fill="#92400E" fontSize="12" fontWeight="bold">$</text>
      </g>

      {/* Medium coins */}
      <g className="animate-coin-shimmer" style={{ animationDelay: '0.3s' }}>
        <circle cx="80" cy="220" r="10" fill="#FBBF24" stroke="#F59E0B" strokeWidth="2" />
        <text x="80" y="224" textAnchor="middle" fill="#92400E" fontSize="10" fontWeight="bold">$</text>
      </g>

      <g className="animate-coin-shimmer" style={{ animationDelay: '0.8s' }}>
        <circle cx="220" cy="200" r="10" fill="#FBBF24" stroke="#F59E0B" strokeWidth="2" />
        <text x="220" y="204" textAnchor="middle" fill="#92400E" fontSize="10" fontWeight="bold">$</text>
      </g>

      {/* Small coins */}
      <g className="animate-coin-shimmer" style={{ animationDelay: '1.2s' }}>
        <circle cx="150" cy="200" r="8" fill="#FBBF24" stroke="#F59E0B" strokeWidth="1.5" />
      </g>
      <g className="animate-coin-shimmer" style={{ animationDelay: '0.6s' }}>
        <circle cx="130" cy="180" r="8" fill="#FBBF24" stroke="#F59E0B" strokeWidth="1.5" />
      </g>
      <g className="animate-coin-shimmer" style={{ animationDelay: '1.5s' }}>
        <circle cx="170" cy="240" r="8" fill="#FBBF24" stroke="#F59E0B" strokeWidth="1.5" />
      </g>
    </svg>
  );
}

// Floating coins
export function FloatingCoins({ className = "" }: IllustrationProps) {
  return (
    <svg className={className} viewBox="0 0 100 150" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g>
        <circle cx="30" cy="30" r="15" fill="#FBBF24" stroke="#F59E0B" strokeWidth="2" />
        <text x="30" y="35" textAnchor="middle" fill="#92400E" fontSize="14" fontWeight="bold">$</text>
        <animateTransform attributeName="transform" type="translate" values="0,0; 0,-10; 0,0" dur="3s" repeatCount="indefinite" />
      </g>
      <g>
        <circle cx="70" cy="60" r="12" fill="#FBBF24" stroke="#F59E0B" strokeWidth="2" />
        <text x="70" y="64" textAnchor="middle" fill="#92400E" fontSize="12" fontWeight="bold">$</text>
        <animateTransform attributeName="transform" type="translate" values="0,0; 0,-8; 0,0" dur="2.5s" repeatCount="indefinite" />
      </g>
      <g>
        <circle cx="45" cy="100" r="10" fill="#FBBF24" stroke="#F59E0B" strokeWidth="2" />
        <text x="45" y="104" textAnchor="middle" fill="#92400E" fontSize="10" fontWeight="bold">$</text>
        <animateTransform attributeName="transform" type="translate" values="0,0; 0,-6; 0,0" dur="2s" repeatCount="indefinite" />
      </g>
      <g>
        <circle cx="80" cy="120" r="8" fill="#FBBF24" stroke="#F59E0B" strokeWidth="2" />
        <text x="80" y="123" textAnchor="middle" fill="#92400E" fontSize="8" fontWeight="bold">$</text>
        <animateTransform attributeName="transform" type="translate" values="0,0; 0,-5; 0,0" dur="2.2s" repeatCount="indefinite" />
      </g>
    </svg>
  );
}

// Cartoon sun with rays
export function Sun({ className = "" }: IllustrationProps) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Rays */}
      <g opacity="0.8">
        <rect x="47" y="5" width="6" height="15" rx="3" fill="#FDE047" />
        <rect x="47" y="80" width="6" height="15" rx="3" fill="#FDE047" />
        <rect x="5" y="47" width="15" height="6" rx="3" fill="#FDE047" />
        <rect x="80" y="47" width="15" height="6" rx="3" fill="#FDE047" />
        <rect x="18" y="18" width="6" height="15" rx="3" fill="#FDE047" transform="rotate(-45 21 25.5)" />
        <rect x="72" y="18" width="6" height="15" rx="3" fill="#FDE047" transform="rotate(45 75 25.5)" />
        <rect x="18" y="72" width="6" height="15" rx="3" fill="#FDE047" transform="rotate(45 21 79.5)" />
        <rect x="72" y="72" width="6" height="15" rx="3" fill="#FDE047" transform="rotate(-45 75 79.5)" />
      </g>
      {/* Sun body */}
      <circle cx="50" cy="50" r="25" fill="#FBBF24" />
      <circle cx="50" cy="50" r="20" fill="#FDE047" />
    </svg>
  );
}

// Wavy section divider
export function WaveDivider({ className = "", flip = false }: IllustrationProps & { flip?: boolean }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 1440 120" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      preserveAspectRatio="none"
      style={{ transform: flip ? 'scaleY(-1)' : undefined }}
    >
      <path
        d="M0 60C240 120 480 0 720 60C960 120 1200 0 1440 60L1440 120L0 120Z"
        fill="currentColor"
      />
    </svg>
  );
}

// Fireflies/sparkles
export function Fireflies({ className = "" }: IllustrationProps) {
  return (
    <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="30" cy="40" r="3" fill="#FEF3C7">
        <animate attributeName="opacity" values="0;1;0" dur="2s" repeatCount="indefinite" />
        <animate attributeName="r" values="2;4;2" dur="2s" repeatCount="indefinite" />
      </circle>
      <circle cx="170" cy="60" r="2" fill="#FEF3C7">
        <animate attributeName="opacity" values="0;1;0" dur="2.5s" repeatCount="indefinite" begin="0.5s" />
        <animate attributeName="r" values="1;3;1" dur="2.5s" repeatCount="indefinite" begin="0.5s" />
      </circle>
      <circle cx="80" cy="120" r="2.5" fill="#FEF3C7">
        <animate attributeName="opacity" values="0;1;0" dur="1.8s" repeatCount="indefinite" begin="1s" />
        <animate attributeName="r" values="1.5;3.5;1.5" dur="1.8s" repeatCount="indefinite" begin="1s" />
      </circle>
      <circle cx="150" cy="150" r="2" fill="#FEF3C7">
        <animate attributeName="opacity" values="0;1;0" dur="2.2s" repeatCount="indefinite" begin="0.3s" />
        <animate attributeName="r" values="1;3;1" dur="2.2s" repeatCount="indefinite" begin="0.3s" />
      </circle>
      <circle cx="50" cy="170" r="3" fill="#FEF3C7">
        <animate attributeName="opacity" values="0;1;0" dur="3s" repeatCount="indefinite" begin="0.8s" />
        <animate attributeName="r" values="2;4;2" dur="3s" repeatCount="indefinite" begin="0.8s" />
      </circle>
    </svg>
  );
}

// Grass/plants at the bottom
export function Grass({ className = "" }: IllustrationProps) {
  return (
    <svg className={className} viewBox="0 0 200 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Grass blades */}
      <path d="M10 60 Q12 30 8 20 Q14 35 18 60" fill="#22C55E" />
      <path d="M25 60 Q28 25 22 10 Q30 30 35 60" fill="#16A34A" />
      <path d="M45 60 Q48 35 44 25 Q50 38 55 60" fill="#22C55E" />
      <path d="M65 60 Q68 20 62 5 Q72 25 78 60" fill="#4ADE80" />
      <path d="M90 60 Q93 30 88 15 Q96 35 102 60" fill="#22C55E" />
      <path d="M115 60 Q118 35 113 22 Q122 40 128 60" fill="#16A34A" />
      <path d="M140 60 Q143 25 138 12 Q148 30 155 60" fill="#22C55E" />
      <path d="M165 60 Q168 30 163 18 Q172 35 180 60" fill="#4ADE80" />
      <path d="M188 60 Q191 35 186 25 Q194 40 200 60" fill="#22C55E" />
    </svg>
  );
}

import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
  variant?: "default" | "elevated" | "outlined";
}

const paddingStyles = {
  none: "",
  sm: "p-3",
  md: "p-4",
  lg: "p-6",
};

const variantStyles = {
  default: "bg-white",
  elevated: "bg-white shadow-md",
  outlined: "bg-white border-2 border-border/30",
};

export function Card({
  children,
  className = "",
  padding = "md",
  variant = "outlined",
}: CardProps) {
  return (
    <div
      className={`
        rounded-2xl
        ${paddingStyles[padding]}
        ${variantStyles[variant]}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

export default Card;

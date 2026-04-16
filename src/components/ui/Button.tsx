"use client";

import { ButtonHTMLAttributes, forwardRef, AnchorHTMLAttributes } from "react";
import Link from "next/link";

type ButtonVariant = "primary" | "secondary" | "success" | "danger" | "ghost" | "outline";
type ButtonSize = "sm" | "md" | "lg";

// Base props shared by both button and link variants
interface BaseButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  isLoading?: boolean;
  className?: string;
  children?: React.ReactNode;
}

// Props when used as a button (no href)
interface ButtonAsButtonProps
  extends BaseButtonProps,
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseButtonProps> {
  href?: never;
}

// Props when used as a link (with href)
interface ButtonAsLinkProps
  extends BaseButtonProps,
    Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseButtonProps> {
  href: string;
}

type ButtonProps = ButtonAsButtonProps | ButtonAsLinkProps;

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-white border-b-4 border-primary-dark active:border-b-0 active:translate-y-1 hover:brightness-110",
  secondary:
    "bg-slate-200 text-text border-b-4 border-slate-300 active:border-b-0 active:translate-y-1 hover:bg-slate-300",
  success:
    "bg-success text-white border-b-4 border-emerald-600 active:border-b-0 active:translate-y-1 hover:brightness-110",
  danger:
    "bg-hearts text-white border-b-4 border-rose-600 active:border-b-0 active:translate-y-1 hover:brightness-110",
  ghost:
    "bg-transparent text-primary hover:bg-primary-50 active:bg-primary-50/80",
  outline:
    "bg-transparent text-primary border-2 border-primary hover:bg-primary-50 active:bg-primary-50/80",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-sm rounded-xl",
  md: "px-6 py-3 text-base rounded-2xl",
  lg: "px-8 py-4 text-lg rounded-2xl",
};

const baseStyles =
  "inline-block font-semibold transition-all duration-100 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:translate-y-0 disabled:active:border-b-4 text-center";

// Helper to check if props have href
function isLinkProps(props: ButtonProps): props is ButtonAsLinkProps {
  return "href" in props && props.href !== undefined;
}

export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  (props, ref) => {
    const {
      className = "",
      variant = "primary",
      size = "md",
      fullWidth = false,
      isLoading = false,
      children,
      ...rest
    } = props;

    const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${fullWidth ? "w-full" : ""} ${className}`;

    // Render as Link when href is provided
    if (isLinkProps(props)) {
      const { href, ...linkRest } = rest as Omit<ButtonAsLinkProps, keyof BaseButtonProps>;
      return (
        <Link
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          className={combinedClassName}
          {...linkRest}
        >
          {children}
        </Link>
      );
    }

    // Render as button otherwise
    const { disabled, ...buttonRest } = rest as Omit<ButtonAsButtonProps, keyof BaseButtonProps>;
    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        className={combinedClassName}
        disabled={disabled || isLoading}
        {...buttonRest}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Memuat...
          </span>
        ) : children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;

import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "teal" | "mocha" | "champagne";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, children, disabled, ...props }, ref) => {
    const baseStyles =
      "relative inline-flex items-center justify-center font-semibold rounded-xl cursor-pointer select-none transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.95] active:translate-y-[1px] active:brightness-95";

    const variantStyles = {
      primary: "bg-gradient-to-r from-[#C8792C] to-[#B2631F] text-white hover:brightness-105 hover:shadow-lg hover:shadow-[#C8792C]/30 focus:ring-[#C8792C] shadow-md shadow-[#C8792C]/25 border border-[#F4D9A0]/30 hover:-translate-y-0.5 active:translate-y-0 shimmer-touch",
      teal: "bg-[#C8792C] text-white hover:bg-[#B46520] hover:shadow-lg hover:shadow-[#C8792C]/30 focus:ring-[#C8792C] shadow-md shadow-[#C8792C]/25 hover:-translate-y-0.5 active:translate-y-0 shimmer-touch",
      mocha: "bg-[#5B4632] text-white hover:bg-[#433222] hover:shadow-md hover:shadow-[#5B4632]/25 focus:ring-[#5B4632] hover:-translate-y-0.5 active:translate-y-0 shimmer-touch",
      champagne: "bg-[#FAF5EA] text-[#5B4632] border border-[#F4D9A0] hover:bg-[#F6EBD1] hover:border-[#E8C882] focus:ring-[#F4D9A0] hover:-translate-y-0.5 active:translate-y-0 shimmer-touch",
      secondary: "bg-[#F4EFE9] text-[#493726] hover:bg-[#E6DCD0] focus:ring-[#CEBCAB] hover:-translate-y-0.5 active:translate-y-0",
      outline: "border border-[#CEBCAB] bg-transparent hover:bg-[#FAF7F4] hover:border-[#A8927D] text-[#493726] focus:ring-[#C8792C] hover:-translate-y-0.5 active:translate-y-0",
      ghost: "bg-transparent hover:bg-[#F4EFE9] text-[#5B4632] focus:ring-[#CEBCAB] hover:-translate-y-0.5 active:translate-y-0",
      danger: "bg-rose-700 text-white hover:bg-rose-800 focus:ring-rose-600 hover:-translate-y-0.5 active:translate-y-0",
    };

    const sizeStyles = {
      sm: "text-xs px-3 py-1.5 gap-1.5",
      md: "text-sm px-4 py-2.5 gap-2",
      lg: "text-base px-6 py-3.5 gap-2.5",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

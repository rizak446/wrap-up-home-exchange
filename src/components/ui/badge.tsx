import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "danger" | "teal" | "outline" | "champagne" | "amber" | "mocha";
}

export function Badge({ className, variant = "default", children, ...props }: BadgeProps) {
  const styles = {
    default: "bg-[#F4EFE9] text-[#493726] border-[#CEBCAB]",
    success: "bg-emerald-50 text-emerald-800 border-emerald-200",
    warning: "bg-[#FAF5EA] text-[#927233] border-[#F4D9A0]",
    danger: "bg-rose-50 text-rose-800 border-rose-200",
    teal: "bg-[#FAF5EA] text-[#C8792C] border-[#F4D9A0]",
    champagne: "bg-[#FAF5EA] text-[#7A5A29] border-[#F4D9A0]",
    amber: "bg-[#FBEEE1] text-[#914E18] border-[#DF9E5E]",
    mocha: "bg-[#5B4632] text-[#FDFBF7] border-[#493726]",
    outline: "bg-transparent text-[#493726] border-[#CEBCAB]",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border",
        styles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

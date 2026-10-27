"use client";

import React, { useState } from "react";
import { User } from "lucide-react";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  src?: string | null;
  name?: string | null;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export function UserAvatar({
  src,
  name,
  className,
  size = "md",
}: UserAvatarProps) {
  const [imageError, setImageError] = useState(false);

  // Extract up to 2 uppercase initials from name
  const getInitials = (fullName?: string | null) => {
    if (!fullName || fullName.trim() === "") return "";
    const parts = fullName.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const initials = getInitials(name);

  const sizeClasses = {
    sm: "w-8 h-8 text-[11px]",
    md: "w-10 h-10 text-xs",
    lg: "w-14 h-14 text-sm",
    xl: "w-28 h-28 text-2xl",
  };

  const iconSizes = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-7 w-7",
    xl: "h-12 w-12",
  };

  const hasValidPhoto = src && src.trim() !== "" && !imageError;

  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center font-bold font-serif select-none overflow-hidden relative border border-[#E8DFD5] shadow-xs flex-shrink-0 transition-all",
        sizeClasses[size],
        hasValidPhoto
          ? "bg-slate-100"
          : "bg-gradient-to-br from-[#5B4632] to-[#362719] text-[#F4D9A0]",
        className
      )}
    >
      {hasValidPhoto ? (
        <img
          src={src!}
          alt={name || "User Profile Photo"}
          onError={() => setImageError(true)}
          className="w-full h-full object-cover"
        />
      ) : initials ? (
        <span className="tracking-wider">{initials}</span>
      ) : (
        <User className={cn("text-[#F4D9A0]", iconSizes[size])} />
      )}
    </div>
  );
}

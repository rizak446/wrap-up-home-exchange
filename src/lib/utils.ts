import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCredits(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(amount) + " pts";
}

export function formatDate(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(d);
}

export function formatDateTime(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

export function calculateNights(checkIn: string | Date, checkOut: string | Date): number {
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 1;
}

export function calculateTotalCredits(
  creditsPerNight: number,
  checkIn: string | Date,
  checkOut: string | Date
): { nights: number; totalCredits: number; platformFeeCredits: number } {
  const nights = calculateNights(checkIn, checkOut);
  const baseCredits = creditsPerNight * nights;
  // Platform booking protection fee is 5% of base credits (min 10 credits)
  const platformFeeCredits = Math.max(10, Math.round(baseCredits * 0.05));
  return {
    nights,
    totalCredits: baseCredits + platformFeeCredits,
    platformFeeCredits,
  };
}

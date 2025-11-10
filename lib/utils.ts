import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Calculate funded percent (0-100) for a need.
 * Rounds to the nearest whole percent and clamps between 0 and 100.
 */
export function fundedPercent(amountDonated: number | undefined | null, amountNeeded: number | undefined | null): number {
  const donated = Number(amountDonated) || 0;
  const needed = Number(amountNeeded) || 0;
  if (needed <= 0) return 0;
  return Math.min(100, Math.round((donated / needed) * 100));
}

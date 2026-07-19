/**
 * src/lib/utils.ts
 *
 * Shared utility functions used across the application.
 */

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind CSS class names, resolving conflicts correctly.
 * Combines clsx (conditional classes) with tailwind-merge (dedup/conflict resolution).
 *
 * @example
 *   cn("px-4 py-2", condition && "bg-primary", "px-6")
 *   // → "py-2 bg-primary px-6"  (px-4 is overridden by px-6)
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

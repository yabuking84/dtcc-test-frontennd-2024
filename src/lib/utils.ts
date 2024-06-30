import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Timeout
 * @param time
 */
export const waits = async (time = 500) => {
  await new Promise((resolve) => setTimeout(resolve, time));
};

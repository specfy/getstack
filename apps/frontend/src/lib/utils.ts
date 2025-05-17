import { clsx } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

import type { ClassValue } from 'clsx';

const customTwMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: ['tiny'],
    },
  },
});

export function cn(...inputs: ClassValue[]): string {
  return customTwMerge(clsx(inputs));
}

/**
 * Async wait function that resolves after a specified number of milliseconds.
 * @param ms - The number of milliseconds to wait.
 */
export async function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

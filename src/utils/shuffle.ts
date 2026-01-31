/**
 * Fisher-Yates shuffle algorithm for creating random board layouts.
 */

/**
 * Shuffles an array using the Fisher-Yates algorithm.
 * Returns a new array without modifying the original.
 *
 * @param array - The array to shuffle
 * @returns A new shuffled array
 */
export function shuffleArray<T>(array: readonly T[]): T[] {
  const result = [...array];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

/**
 * Creates a shuffled array of numbers from 0 to 99 for the game board.
 *
 * @returns An array of 100 numbers (0-99) in random order
 */
export function createShuffledBoard(): number[] {
  const numbers = Array.from({ length: 100 }, (_, i) => i);
  return shuffleArray(numbers);
}

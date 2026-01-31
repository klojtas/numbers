/**
 * Game Result Types
 *
 * Defines the structure for end-game statistics and results.
 */

import type { GameMode } from './game-mode';

/**
 * Result data displayed at the end of a game.
 */
export interface GameResult {
  /** The game mode that was played */
  readonly mode: GameMode;

  /** Total count of numbers successfully found (0-100) */
  readonly numbersFound: number;

  /** Total time elapsed in seconds when game ended */
  readonly totalTime: number;

  /** Whether the player achieved victory */
  readonly isVictory: boolean;
}

/**
 * Parameters for creating a game result.
 */
export interface CreateGameResultParams {
  readonly mode: GameMode;
  readonly selectedNumbersCount: number;
  readonly elapsedSeconds: number;
}

/**
 * Factory function to create a GameResult.
 */
export function createGameResult(params: CreateGameResultParams): GameResult {
  const { mode, selectedNumbersCount, elapsedSeconds } = params;

  return {
    mode,
    numbersFound: selectedNumbersCount,
    totalTime: elapsedSeconds,
    isVictory: selectedNumbersCount >= 100,
  };
}

/**
 * Generates display message for game result.
 */
export function getResultMessage(result: GameResult): string {
  if (result.mode === 'timeLimit') {
    if (result.isVictory) {
      return `Amazing! You found all ${result.numbersFound} numbers with time to spare!`;
    }
    return `Time's up! You found ${result.numbersFound} out of 100 numbers.`;
  }

  // Completion mode
  return `Completed! Your time: ${result.totalTime} seconds`;
}

/**
 * Generates a short summary suitable for sharing.
 */
export function getResultSummary(result: GameResult): string {
  if (result.mode === 'timeLimit') {
    return `Found ${result.numbersFound}/100 numbers`;
  }
  return `Completed in ${result.totalTime}s`;
}

/**
 * Game Result Contract
 *
 * Defines the structure for end-game statistics and results.
 *
 * @module contracts/game-result
 */

import type { GameMode } from './game-mode';

/**
 * Result data displayed at the end of a game.
 *
 * @example
 * ```typescript
 * // Time Limit mode result
 * const result: GameResult = {
 *   mode: 'timeLimit',
 *   numbersFound: 47,
 *   totalTime: 100,
 *   isVictory: false, // Did not find all numbers
 * };
 *
 * // Completion mode result
 * const result: GameResult = {
 *   mode: 'completion',
 *   numbersFound: 100,
 *   totalTime: 87,
 *   isVictory: true, // Found all numbers
 * };
 * ```
 */
export interface GameResult {
  /**
   * The game mode that was played.
   */
  readonly mode: GameMode;

  /**
   * Total count of numbers successfully found.
   * @minimum 0
   * @maximum 100
   */
  readonly numbersFound: number;

  /**
   * Total time elapsed in seconds when game ended.
   * For Time Limit mode, this equals the time limit.
   * For Completion mode, this is the time taken to find all numbers.
   */
  readonly totalTime: number;

  /**
   * Whether the player achieved victory.
   * - Time Limit: true if found all 100 numbers before time ran out
   * - Completion: always true (game only ends when all found)
   */
  readonly isVictory: boolean;
}

/**
 * Creates a GameResult from the current game state.
 * Should be called when game phase transitions to 'ended'.
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

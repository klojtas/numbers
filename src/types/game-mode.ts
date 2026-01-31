/**
 * Game Mode Types
 *
 * Defines the available game modes and their configurations.
 */

/**
 * Available game modes.
 * - 'timeLimit': Player has limited time to find as many numbers as possible
 * - 'completion': Player must find all numbers, time is tracked for score
 */
export type GameMode = 'timeLimit' | 'completion';

/**
 * Display labels for game modes (for UI).
 */
export const GAME_MODE_LABELS: Record<GameMode, string> = {
  timeLimit: 'Time Limit',
  completion: 'Completion',
} as const;

/**
 * Descriptions for game modes (for tooltips/help).
 */
export const GAME_MODE_DESCRIPTIONS: Record<GameMode, string> = {
  timeLimit: 'Find as many numbers as possible before time runs out',
  completion: 'Find all numbers from 0 to 99 as fast as you can',
} as const;

/**
 * Configuration for Time Limit mode.
 */
export interface TimeLimitConfig {
  /** Time limit in seconds */
  readonly seconds: number;
}

/**
 * Default configuration for each mode.
 */
export const DEFAULT_MODE_CONFIG = {
  timeLimit: {
    seconds: 100,
  } satisfies TimeLimitConfig,
  completion: {
    // No additional config for completion mode
  },
} as const;

/**
 * Type guard to check if a value is a valid GameMode.
 */
export function isValidGameMode(value: unknown): value is GameMode {
  return value === 'timeLimit' || value === 'completion';
}

import { GAME_CONSTANTS } from '../types';

/**
 * Validation utilities for game inputs.
 */

/**
 * Validates and clamps a time limit value to the allowed range.
 *
 * @param value - The time limit value to validate
 * @returns The validated time limit (clamped to 10-600 seconds)
 */
export function validateTimeLimit(value: number): number {
  if (!Number.isFinite(value)) {
    return GAME_CONSTANTS.DEFAULT_TIME_LIMIT;
  }

  const rounded = Math.round(value);

  if (rounded < GAME_CONSTANTS.MIN_TIME_LIMIT) {
    return GAME_CONSTANTS.MIN_TIME_LIMIT;
  }

  if (rounded > GAME_CONSTANTS.MAX_TIME_LIMIT) {
    return GAME_CONSTANTS.MAX_TIME_LIMIT;
  }

  return rounded;
}

/**
 * Parses a string input to a time limit value.
 *
 * @param input - The string input to parse
 * @param fallback - Fallback value if parsing fails
 * @returns The parsed and validated time limit
 */
export function parseTimeLimitInput(input: string, fallback: number): number {
  const parsed = parseInt(input, 10);

  if (Number.isNaN(parsed)) {
    return fallback;
  }

  return validateTimeLimit(parsed);
}

/**
 * Checks if a number click is valid (is the next expected number).
 *
 * @param clickedNumber - The number that was clicked
 * @param nextExpected - The next expected number in sequence
 * @returns True if the click is valid
 */
export function isValidNumberClick(clickedNumber: number, nextExpected: number): boolean {
  return clickedNumber === nextExpected;
}

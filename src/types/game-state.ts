/**
 * Game State Types
 *
 * Defines the core state structure for the Number Sequence Game.
 */

import type { GameMode } from './game-mode';

/**
 * Represents the current lifecycle phase of the game.
 */
export type GamePhase = 'idle' | 'playing' | 'ended';

/**
 * Complete game state managed by useGame hook.
 */
export interface GameState {
  /** Current game lifecycle phase */
  readonly phase: GamePhase;

  /** Selected game mode */
  readonly mode: GameMode;

  /** Time limit in seconds for Time Limit mode (10-600, default 100) */
  readonly timeLimitSeconds: number;

  /** Seconds elapsed since game started */
  readonly elapsedSeconds: number;

  /** The next number the player must select (0-99, 100 = complete) */
  readonly nextExpectedNumber: number;

  /** Set of numbers that have been successfully selected */
  readonly selectedNumbers: ReadonlySet<number>;

  /** Array representing the board layout (index = position, value = number) */
  readonly boardLayout: readonly number[];
}

/**
 * Actions that can modify game state.
 */
export type GameAction =
  | { readonly type: 'START_GAME' }
  | { readonly type: 'SELECT_NUMBER'; readonly number: number }
  | { readonly type: 'TICK' }
  | { readonly type: 'TIME_UP' }
  | { readonly type: 'COMPLETE' }
  | { readonly type: 'RESET' }
  | { readonly type: 'SET_MODE'; readonly mode: GameMode }
  | { readonly type: 'SET_TIME_LIMIT'; readonly seconds: number };

/**
 * Constants for game configuration.
 */
export const GAME_CONSTANTS = {
  /** Total cells on the board */
  BOARD_SIZE: 100,
  /** Grid dimension (10x10) */
  GRID_DIMENSION: 10,
  /** Minimum allowed time limit in seconds */
  MIN_TIME_LIMIT: 10,
  /** Maximum allowed time limit in seconds */
  MAX_TIME_LIMIT: 600,
  /** Default time limit in seconds */
  DEFAULT_TIME_LIMIT: 100,
  /** First number to find */
  FIRST_NUMBER: 0,
  /** Last number to find */
  LAST_NUMBER: 99,
} as const;

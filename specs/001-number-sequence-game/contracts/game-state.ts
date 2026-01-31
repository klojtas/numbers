/**
 * Game State Contract
 *
 * Defines the core state structure for the Number Sequence Game.
 * This interface represents the single source of truth for game state.
 *
 * @module contracts/game-state
 */

import type { GameMode } from './game-mode';

/**
 * Represents the current lifecycle phase of the game.
 */
export type GamePhase = 'idle' | 'playing' | 'ended';

/**
 * Complete game state managed by useGame hook.
 *
 * @example
 * ```typescript
 * const initialState: GameState = {
 *   phase: 'idle',
 *   mode: 'timeLimit',
 *   timeLimitSeconds: 100,
 *   elapsedSeconds: 0,
 *   nextExpectedNumber: 0,
 *   selectedNumbers: new Set(),
 *   boardLayout: [],
 * };
 * ```
 */
export interface GameState {
  /**
   * Current game lifecycle phase.
   * - 'idle': No game in progress, Start button enabled
   * - 'playing': Game active, timer running, board interactive
   * - 'ended': Game finished, showing results
   */
  readonly phase: GamePhase;

  /**
   * Selected game mode.
   * Determines win/lose conditions.
   */
  readonly mode: GameMode;

  /**
   * Time limit in seconds for Time Limit mode.
   * @minimum 10
   * @maximum 600
   * @default 100
   */
  readonly timeLimitSeconds: number;

  /**
   * Seconds elapsed since game started.
   * Increments every second during 'playing' phase.
   * @minimum 0
   */
  readonly elapsedSeconds: number;

  /**
   * The next number the player must select (0-99).
   * When this exceeds 99, all numbers have been found.
   * @minimum 0
   * @maximum 100 (100 indicates completion)
   */
  readonly nextExpectedNumber: number;

  /**
   * Set of numbers that have been successfully selected.
   * Used to determine which cells appear as "found".
   */
  readonly selectedNumbers: ReadonlySet<number>;

  /**
   * Array representing the board layout.
   * Index = cell position (0-99), Value = number displayed (0-99).
   * Shuffled on each new game.
   * @length 100 when game is playing/ended, 0 when idle
   */
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

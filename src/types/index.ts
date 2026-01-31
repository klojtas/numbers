/**
 * Number Sequence Game - Type Definitions
 *
 * Re-exports all TypeScript interfaces and types.
 */

// Game State
export type { GameState, GamePhase, GameAction } from './game-state';
export { GAME_CONSTANTS } from './game-state';

// Game Mode
export type { GameMode, TimeLimitConfig } from './game-mode';
export {
  GAME_MODE_LABELS,
  GAME_MODE_DESCRIPTIONS,
  DEFAULT_MODE_CONFIG,
  isValidGameMode,
} from './game-mode';

// Game Result
export type { GameResult, CreateGameResultParams } from './game-result';
export { createGameResult, getResultMessage, getResultSummary } from './game-result';

// Cell State
export type { CellState, ComputeCellStateParams } from './cell-state';
export { computeCellState, CELL_STATE_CLASSES } from './cell-state';

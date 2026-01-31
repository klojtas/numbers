/**
 * Cell State Contract
 *
 * Defines the derived state for individual board cells.
 *
 * @module contracts/cell-state
 */

/**
 * State for an individual cell on the game board.
 * This is derived/computed state, not stored directly.
 *
 * @example
 * ```typescript
 * const cell: CellState = {
 *   number: 42,
 *   position: 15,
 *   isSelected: false,
 *   isNext: true,
 *   isClickable: true,
 * };
 * ```
 */
export interface CellState {
  /**
   * The number displayed in this cell (0-99).
   */
  readonly number: number;

  /**
   * Index position on the board (0-99).
   * Used for grid layout: row = floor(position/10), col = position%10
   */
  readonly position: number;

  /**
   * Whether this number has already been found/selected.
   * Selected cells should be visually distinct (e.g., grayed out, checked).
   */
  readonly isSelected: boolean;

  /**
   * Whether this is the next expected number in sequence.
   * Can be used for optional highlighting to help player.
   */
  readonly isNext: boolean;

  /**
   * Whether the cell can currently be clicked.
   * False when game is not playing or cell is already selected.
   */
  readonly isClickable: boolean;
}

/**
 * Parameters for computing cell state from game state.
 */
export interface ComputeCellStateParams {
  readonly number: number;
  readonly position: number;
  readonly selectedNumbers: ReadonlySet<number>;
  readonly nextExpectedNumber: number;
  readonly isPlaying: boolean;
}

/**
 * Computes the derived CellState from game state.
 */
export function computeCellState(params: ComputeCellStateParams): CellState {
  const { number, position, selectedNumbers, nextExpectedNumber, isPlaying } = params;

  const isSelected = selectedNumbers.has(number);
  const isNext = number === nextExpectedNumber;

  return {
    number,
    position,
    isSelected,
    isNext,
    isClickable: isPlaying && !isSelected,
  };
}

/**
 * CSS class names for cell states (for styling).
 */
export const CELL_STATE_CLASSES = {
  selected: 'cell--selected',
  next: 'cell--next',
  clickable: 'cell--clickable',
  error: 'cell--error',
} as const;

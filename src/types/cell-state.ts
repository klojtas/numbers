/**
 * Cell State Types
 *
 * Defines the derived state for individual board cells.
 */

/**
 * State for an individual cell on the game board.
 */
export interface CellState {
  /** The number displayed in this cell (0-99) */
  readonly number: number;

  /** Index position on the board (0-99) */
  readonly position: number;

  /** Whether this number has already been found/selected */
  readonly isSelected: boolean;

  /** Whether this is the next expected number in sequence */
  readonly isNext: boolean;

  /** Whether the cell can currently be clicked */
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

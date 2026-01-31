import { useReducer, useCallback, useMemo } from 'react';
import type { GameState, GameAction, GameMode, GameResult } from '../types';
import { GAME_CONSTANTS, createGameResult } from '../types';
import { createShuffledBoard } from '../utils/shuffle';
import { validateTimeLimit } from '../utils/validation';

/**
 * Initial game state.
 */
const initialState: GameState = {
  phase: 'idle',
  mode: 'timeLimit',
  timeLimitSeconds: GAME_CONSTANTS.DEFAULT_TIME_LIMIT,
  elapsedSeconds: 0,
  nextExpectedNumber: GAME_CONSTANTS.FIRST_NUMBER,
  selectedNumbers: new Set<number>(),
  boardLayout: [],
};

/**
 * Game state reducer.
 */
function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_GAME':
      return {
        ...state,
        phase: 'playing',
        elapsedSeconds: 0,
        nextExpectedNumber: GAME_CONSTANTS.FIRST_NUMBER,
        selectedNumbers: new Set<number>(),
        boardLayout: createShuffledBoard(),
      };

    case 'SELECT_NUMBER': {
      if (state.phase !== 'playing') {
        return state;
      }

      // Only accept if it's the next expected number
      if (action.number !== state.nextExpectedNumber) {
        return state;
      }

      const newSelectedNumbers = new Set(state.selectedNumbers);
      newSelectedNumbers.add(action.number);

      const newNextExpected = state.nextExpectedNumber + 1;

      // Check if game is complete (found all 100 numbers)
      if (newNextExpected > GAME_CONSTANTS.LAST_NUMBER) {
        return {
          ...state,
          phase: 'ended',
          selectedNumbers: newSelectedNumbers,
          nextExpectedNumber: newNextExpected,
        };
      }

      return {
        ...state,
        selectedNumbers: newSelectedNumbers,
        nextExpectedNumber: newNextExpected,
      };
    }

    case 'TICK':
      if (state.phase !== 'playing') {
        return state;
      }
      return {
        ...state,
        elapsedSeconds: state.elapsedSeconds + 1,
      };

    case 'TIME_UP':
      if (state.phase !== 'playing') {
        return state;
      }
      return {
        ...state,
        phase: 'ended',
      };

    case 'COMPLETE':
      if (state.phase !== 'playing') {
        return state;
      }
      return {
        ...state,
        phase: 'ended',
      };

    case 'RESET':
      return {
        ...initialState,
        mode: state.mode,
        timeLimitSeconds: state.timeLimitSeconds,
      };

    case 'SET_MODE':
      if (state.phase === 'playing') {
        return state;
      }
      return {
        ...state,
        mode: action.mode,
      };

    case 'SET_TIME_LIMIT':
      if (state.phase === 'playing') {
        return state;
      }
      return {
        ...state,
        timeLimitSeconds: validateTimeLimit(action.seconds),
      };

    default:
      return state;
  }
}

/**
 * Return type for useGame hook.
 */
export interface UseGameReturn {
  /** Current game state */
  state: GameState;
  /** Start a new game */
  startGame: () => void;
  /** Reset the game */
  resetGame: () => void;
  /** Select a number (validates internally) */
  selectNumber: (num: number) => boolean;
  /** Increment the timer */
  tick: () => void;
  /** End game due to time limit */
  timeUp: () => void;
  /** Set the game mode */
  setMode: (mode: GameMode) => void;
  /** Set the time limit */
  setTimeLimit: (seconds: number) => void;
  /** Get game result (only valid when phase is 'ended') */
  getResult: () => GameResult | null;
  /** Check if a number click would be valid */
  isValidClick: (num: number) => boolean;
}

/**
 * Custom hook for managing game state.
 */
export function useGame(): UseGameReturn {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  const startGame = useCallback((): void => {
    dispatch({ type: 'START_GAME' });
  }, []);

  const resetGame = useCallback((): void => {
    dispatch({ type: 'RESET' });
  }, []);

  const selectNumber = useCallback(
    (num: number): boolean => {
      if (state.phase !== 'playing' || num !== state.nextExpectedNumber) {
        return false;
      }
      dispatch({ type: 'SELECT_NUMBER', number: num });
      return true;
    },
    [state.phase, state.nextExpectedNumber]
  );

  const tick = useCallback((): void => {
    dispatch({ type: 'TICK' });
  }, []);

  const timeUp = useCallback((): void => {
    dispatch({ type: 'TIME_UP' });
  }, []);

  const setMode = useCallback((mode: GameMode): void => {
    dispatch({ type: 'SET_MODE', mode });
  }, []);

  const setTimeLimit = useCallback((seconds: number): void => {
    dispatch({ type: 'SET_TIME_LIMIT', seconds });
  }, []);

  const getResult = useCallback((): GameResult | null => {
    if (state.phase !== 'ended') {
      return null;
    }
    return createGameResult({
      mode: state.mode,
      selectedNumbersCount: state.selectedNumbers.size,
      elapsedSeconds: state.elapsedSeconds,
    });
  }, [state.phase, state.mode, state.selectedNumbers.size, state.elapsedSeconds]);

  const isValidClick = useCallback(
    (num: number): boolean => {
      return state.phase === 'playing' && num === state.nextExpectedNumber;
    },
    [state.phase, state.nextExpectedNumber]
  );

  return useMemo(
    () => ({
      state,
      startGame,
      resetGame,
      selectNumber,
      tick,
      timeUp,
      setMode,
      setTimeLimit,
      getResult,
      isValidClick,
    }),
    [
      state,
      startGame,
      resetGame,
      selectNumber,
      tick,
      timeUp,
      setMode,
      setTimeLimit,
      getResult,
      isValidClick,
    ]
  );
}

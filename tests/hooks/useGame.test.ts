import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useGame } from '../../src/hooks/useGame';

describe('useGame', () => {
  describe('initial state', () => {
    it('should start in idle phase', () => {
      const { result } = renderHook(() => useGame());
      expect(result.current.state.phase).toBe('idle');
    });

    it('should have default time limit of 100 seconds', () => {
      const { result } = renderHook(() => useGame());
      expect(result.current.state.timeLimitSeconds).toBe(100);
    });

    it('should have default mode as timeLimit', () => {
      const { result } = renderHook(() => useGame());
      expect(result.current.state.mode).toBe('timeLimit');
    });

    it('should have empty board layout initially', () => {
      const { result } = renderHook(() => useGame());
      expect(result.current.state.boardLayout).toHaveLength(0);
    });
  });

  describe('startGame', () => {
    it('should transition to playing phase', () => {
      const { result } = renderHook(() => useGame());

      act(() => {
        result.current.startGame();
      });

      expect(result.current.state.phase).toBe('playing');
    });

    it('should create board layout with 100 numbers', () => {
      const { result } = renderHook(() => useGame());

      act(() => {
        result.current.startGame();
      });

      expect(result.current.state.boardLayout).toHaveLength(100);
    });

    it('should reset elapsed seconds to 0', () => {
      const { result } = renderHook(() => useGame());

      act(() => {
        result.current.startGame();
        result.current.tick();
        result.current.tick();
      });

      expect(result.current.state.elapsedSeconds).toBe(2);

      act(() => {
        result.current.resetGame();
        result.current.startGame();
      });

      expect(result.current.state.elapsedSeconds).toBe(0);
    });

    it('should set nextExpectedNumber to 0', () => {
      const { result } = renderHook(() => useGame());

      act(() => {
        result.current.startGame();
      });

      expect(result.current.state.nextExpectedNumber).toBe(0);
    });
  });

  describe('selectNumber', () => {
    it('should accept correct number', () => {
      const { result } = renderHook(() => useGame());

      act(() => {
        result.current.startGame();
      });

      let success: boolean = false;
      act(() => {
        success = result.current.selectNumber(0);
      });

      expect(success).toBe(true);
      expect(result.current.state.selectedNumbers.has(0)).toBe(true);
      expect(result.current.state.nextExpectedNumber).toBe(1);
    });

    it('should reject incorrect number', () => {
      const { result } = renderHook(() => useGame());

      act(() => {
        result.current.startGame();
      });

      let success: boolean = false;
      act(() => {
        success = result.current.selectNumber(5);
      });

      expect(success).toBe(false);
      expect(result.current.state.nextExpectedNumber).toBe(0);
    });

    it('should not select when not playing', () => {
      const { result } = renderHook(() => useGame());

      let success: boolean = false;
      act(() => {
        success = result.current.selectNumber(0);
      });

      expect(success).toBe(false);
    });

    it('should end game when selecting 99', () => {
      const { result } = renderHook(() => useGame());

      act(() => {
        result.current.startGame();
      });

      // Select all numbers 0-99
      for (let i = 0; i <= 99; i++) {
        act(() => {
          result.current.selectNumber(i);
        });
      }

      expect(result.current.state.phase).toBe('ended');
      expect(result.current.state.nextExpectedNumber).toBe(100);
    });
  });

  describe('tick', () => {
    it('should increment elapsed seconds when playing', () => {
      const { result } = renderHook(() => useGame());

      act(() => {
        result.current.startGame();
      });

      act(() => {
        result.current.tick();
      });

      expect(result.current.state.elapsedSeconds).toBe(1);
    });

    it('should not tick when not playing', () => {
      const { result } = renderHook(() => useGame());

      act(() => {
        result.current.tick();
      });

      expect(result.current.state.elapsedSeconds).toBe(0);
    });
  });

  describe('timeUp', () => {
    it('should end game when time is up', () => {
      const { result } = renderHook(() => useGame());

      act(() => {
        result.current.startGame();
      });

      act(() => {
        result.current.timeUp();
      });

      expect(result.current.state.phase).toBe('ended');
    });
  });

  describe('resetGame', () => {
    it('should return to idle phase', () => {
      const { result } = renderHook(() => useGame());

      act(() => {
        result.current.startGame();
        result.current.resetGame();
      });

      expect(result.current.state.phase).toBe('idle');
    });

    it('should preserve mode setting', () => {
      const { result } = renderHook(() => useGame());

      act(() => {
        result.current.setMode('completion');
        result.current.startGame();
        result.current.resetGame();
      });

      expect(result.current.state.mode).toBe('completion');
    });

    it('should preserve time limit setting', () => {
      const { result } = renderHook(() => useGame());

      act(() => {
        result.current.setTimeLimit(60);
        result.current.startGame();
        result.current.resetGame();
      });

      expect(result.current.state.timeLimitSeconds).toBe(60);
    });
  });

  describe('setMode', () => {
    it('should change mode when idle', () => {
      const { result } = renderHook(() => useGame());

      act(() => {
        result.current.setMode('completion');
      });

      expect(result.current.state.mode).toBe('completion');
    });

    it('should not change mode when playing', () => {
      const { result } = renderHook(() => useGame());

      act(() => {
        result.current.startGame();
        result.current.setMode('completion');
      });

      expect(result.current.state.mode).toBe('timeLimit');
    });
  });

  describe('setTimeLimit', () => {
    it('should change time limit when idle', () => {
      const { result } = renderHook(() => useGame());

      act(() => {
        result.current.setTimeLimit(60);
      });

      expect(result.current.state.timeLimitSeconds).toBe(60);
    });

    it('should clamp time limit to valid range', () => {
      const { result } = renderHook(() => useGame());

      act(() => {
        result.current.setTimeLimit(5);
      });

      expect(result.current.state.timeLimitSeconds).toBe(10);
    });
  });

  describe('getResult', () => {
    it('should return null when not ended', () => {
      const { result } = renderHook(() => useGame());

      expect(result.current.getResult()).toBeNull();

      act(() => {
        result.current.startGame();
      });

      expect(result.current.getResult()).toBeNull();
    });

    it('should return result when ended', () => {
      const { result } = renderHook(() => useGame());

      act(() => {
        result.current.startGame();
      });

      act(() => {
        result.current.selectNumber(0);
      });

      act(() => {
        result.current.selectNumber(1);
      });

      act(() => {
        result.current.tick();
      });

      act(() => {
        result.current.tick();
      });

      act(() => {
        result.current.timeUp();
      });

      const gameResult = result.current.getResult();
      expect(gameResult).not.toBeNull();
      expect(gameResult?.numbersFound).toBe(2);
      expect(gameResult?.totalTime).toBe(2);
      expect(gameResult?.mode).toBe('timeLimit');
    });
  });

  describe('isValidClick', () => {
    it('should return true for next expected number when playing', () => {
      const { result } = renderHook(() => useGame());

      act(() => {
        result.current.startGame();
      });

      expect(result.current.isValidClick(0)).toBe(true);
      expect(result.current.isValidClick(1)).toBe(false);
    });

    it('should return false when not playing', () => {
      const { result } = renderHook(() => useGame());

      expect(result.current.isValidClick(0)).toBe(false);
    });
  });
});

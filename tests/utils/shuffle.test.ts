import { describe, it, expect } from 'vitest';
import { shuffleArray, createShuffledBoard } from '../../src/utils/shuffle';

describe('shuffleArray', () => {
  it('should return array with same length', () => {
    const input = [1, 2, 3, 4, 5];
    const result = shuffleArray(input);
    expect(result).toHaveLength(input.length);
  });

  it('should contain all original elements', () => {
    const input = [1, 2, 3, 4, 5];
    const result = shuffleArray(input);
    expect(result.sort((a, b) => a - b)).toEqual(input.sort((a, b) => a - b));
  });

  it('should not modify the original array', () => {
    const input = [1, 2, 3, 4, 5];
    const inputCopy = [...input];
    shuffleArray(input);
    expect(input).toEqual(inputCopy);
  });

  it('should handle empty array', () => {
    const result = shuffleArray([]);
    expect(result).toEqual([]);
  });

  it('should handle single element array', () => {
    const result = shuffleArray([42]);
    expect(result).toEqual([42]);
  });

  it('should produce different orders (statistical test)', () => {
    const input = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const results = new Set<string>();

    // Run 100 shuffles and check we get multiple different orders
    for (let i = 0; i < 100; i++) {
      results.add(shuffleArray(input).join(','));
    }

    // With 10 elements, we should get many different orderings
    expect(results.size).toBeGreaterThan(10);
  });
});

describe('createShuffledBoard', () => {
  it('should return array of 100 numbers', () => {
    const result = createShuffledBoard();
    expect(result).toHaveLength(100);
  });

  it('should contain all numbers from 0 to 99', () => {
    const result = createShuffledBoard();
    const sorted = [...result].sort((a, b) => a - b);
    const expected = Array.from({ length: 100 }, (_, i) => i);
    expect(sorted).toEqual(expected);
  });

  it('should contain each number exactly once', () => {
    const result = createShuffledBoard();
    const unique = new Set(result);
    expect(unique.size).toBe(100);
  });

  it('should produce different boards on each call', () => {
    const board1 = createShuffledBoard();
    const board2 = createShuffledBoard();

    // Very unlikely to be the same (1 in 100! chance)
    expect(board1.join(',')).not.toBe(board2.join(','));
  });
});

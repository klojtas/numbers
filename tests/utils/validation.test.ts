import { describe, it, expect } from 'vitest';
import {
  validateTimeLimit,
  parseTimeLimitInput,
  isValidNumberClick,
} from '../../src/utils/validation';

describe('validateTimeLimit', () => {
  it('should return value within valid range', () => {
    expect(validateTimeLimit(100)).toBe(100);
    expect(validateTimeLimit(50)).toBe(50);
    expect(validateTimeLimit(300)).toBe(300);
  });

  it('should clamp values below minimum to 10', () => {
    expect(validateTimeLimit(5)).toBe(10);
    expect(validateTimeLimit(0)).toBe(10);
    expect(validateTimeLimit(-100)).toBe(10);
  });

  it('should clamp values above maximum to 600', () => {
    expect(validateTimeLimit(700)).toBe(600);
    expect(validateTimeLimit(1000)).toBe(600);
  });

  it('should round non-integer values', () => {
    expect(validateTimeLimit(100.4)).toBe(100);
    expect(validateTimeLimit(100.6)).toBe(101);
  });

  it('should return default for NaN', () => {
    expect(validateTimeLimit(NaN)).toBe(100);
  });

  it('should return default for Infinity', () => {
    expect(validateTimeLimit(Infinity)).toBe(100);
    expect(validateTimeLimit(-Infinity)).toBe(100);
  });
});

describe('parseTimeLimitInput', () => {
  it('should parse valid integer strings', () => {
    expect(parseTimeLimitInput('100', 50)).toBe(100);
    expect(parseTimeLimitInput('60', 50)).toBe(60);
  });

  it('should return fallback for invalid strings', () => {
    expect(parseTimeLimitInput('abc', 50)).toBe(50);
    expect(parseTimeLimitInput('', 50)).toBe(50);
  });

  it('should clamp parsed values to valid range', () => {
    expect(parseTimeLimitInput('5', 100)).toBe(10);
    expect(parseTimeLimitInput('1000', 100)).toBe(600);
  });

  it('should parse strings with leading zeros', () => {
    expect(parseTimeLimitInput('0100', 50)).toBe(100);
  });
});

describe('isValidNumberClick', () => {
  it('should return true when clicked number matches expected', () => {
    expect(isValidNumberClick(0, 0)).toBe(true);
    expect(isValidNumberClick(50, 50)).toBe(true);
    expect(isValidNumberClick(99, 99)).toBe(true);
  });

  it('should return false when clicked number does not match expected', () => {
    expect(isValidNumberClick(1, 0)).toBe(false);
    expect(isValidNumberClick(0, 1)).toBe(false);
    expect(isValidNumberClick(50, 51)).toBe(false);
  });
});

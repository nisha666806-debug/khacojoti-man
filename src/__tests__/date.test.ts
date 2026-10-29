import { describe, it, expect } from 'vitest';
import {
  getCurrentDushanbeDateString,
  getCurrentDushanbeMonthString,
  formatDushanbeDate,
  formatDushanbeMonth,
  TAJIK_MONTHS,
} from '../utils/date';

describe('Date Utilities (Asia/Dushanbe)', () => {
  it('generates valid Dushanbe date and month strings', () => {
    const dateStr = getCurrentDushanbeDateString();
    expect(dateStr).toMatch(/^\d{4}-\d{2}-\d{2}$/);

    const monthStr = getCurrentDushanbeMonthString();
    expect(monthStr).toMatch(/^\d{4}-\d{2}$/);
    expect(dateStr.startsWith(monthStr)).toBe(true);
  });

  it('formats dates in Tajik language with correct month names', () => {
    const formatted = formatDushanbeDate('2026-10-29');
    expect(formatted).toContain('Октябр');
    expect(formatted).toContain('2026');
  });

  it('formats month strings in Tajik', () => {
    const month = formatDushanbeMonth('2026-05');
    expect(month).toContain('Май');
    expect(month).toContain('2026');
  });

  it('contains all 12 Tajik months', () => {
    expect(TAJIK_MONTHS).toHaveLength(12);
    expect(TAJIK_MONTHS[0]).toBe('Январ');
    expect(TAJIK_MONTHS[11]).toBe('Декабр');
  });
});

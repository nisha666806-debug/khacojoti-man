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

  it('formats dates in Tajik, Russian, and English with correct month names', () => {
    const formattedTg = formatDushanbeDate('2026-10-29', 'tg');
    expect(formattedTg).toContain('Октябр');
    expect(formattedTg).toContain('2026');

    const formattedRu = formatDushanbeDate('2026-10-29', 'ru');
    expect(formattedRu).toContain('Октябрь');
    expect(formattedRu).toContain('2026');

    const formattedEn = formatDushanbeDate('2026-10-29', 'en');
    expect(formattedEn).toContain('October');
    expect(formattedEn).toContain('2026');
  });

  it('formats month strings across languages', () => {
    expect(formatDushanbeMonth('2026-05', 'tg')).toContain('Май');
    expect(formatDushanbeMonth('2026-05', 'ru')).toContain('Май');
    expect(formatDushanbeMonth('2026-05', 'en')).toContain('May');
  });

  it('contains all 12 Tajik months', () => {
    expect(TAJIK_MONTHS).toHaveLength(12);
    expect(TAJIK_MONTHS[0]).toBe('Январ');
    expect(TAJIK_MONTHS[11]).toBe('Декабр');
  });
});

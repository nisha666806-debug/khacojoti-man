import { describe, it, expect } from 'vitest';
import {
  getCurrentDushanbeDateString,
  getCurrentDushanbeMonthString,
  getCurrentDushanbeWeekRange,
  isDateInDushanbeCurrentWeek,
  getWeeksInMonth,
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

  it('calculates current Dushanbe week range and checks dates accurately', () => {
    const { start, end } = getCurrentDushanbeWeekRange();
    expect(start).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(end).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(end >= start).toBe(true);

    const todayStr = getCurrentDushanbeDateString();
    expect(isDateInDushanbeCurrentWeek(todayStr)).toBe(true);
    expect(isDateInDushanbeCurrentWeek(start)).toBe(true);
    expect(isDateInDushanbeCurrentWeek(end)).toBe(true);
    expect(isDateInDushanbeCurrentWeek('1999-01-01')).toBe(false);
  });

  it('generates weeks for a given month with correct Sundays and dates', () => {
    const weeks = getWeeksInMonth('2026-11');
    expect(weeks.length).toBeGreaterThanOrEqual(4);
    expect(weeks[0].weekNumber).toBe(1);
    expect(weeks[0].startDate).toBe('2026-11-01');
    
    // Check that Sundays are correctly marked
    const allDays = weeks.flatMap((w) => w.days);
    expect(allDays.length).toBe(30); // November has 30 days
    const sundays = allDays.filter((d) => d.isSunday);
    expect(sundays.length).toBeGreaterThan(0);
    sundays.forEach((s) => {
      expect(s.dayOfWeek).toBe(0);
    });
  });
});

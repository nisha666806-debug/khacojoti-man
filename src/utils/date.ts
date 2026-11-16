import { Language } from '../types/i18n';
import { MONTH_NAMES } from '../i18n/translations';

export const TAJIK_MONTHS = MONTH_NAMES.tg;

export function getDushanbeNow(): Date {
  return new Date();
}

/**
 * Returns current date in YYYY-MM-DD formatted for Asia/Dushanbe
 */
export function getCurrentDushanbeDateString(): string {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Dushanbe',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  return formatter.format(new Date());
}

/**
 * Returns current month in YYYY-MM formatted for Asia/Dushanbe
 */
export function getCurrentDushanbeMonthString(): string {
  const str = getCurrentDushanbeDateString();
  return str.substring(0, 7); // YYYY-MM
}

/**
 * Formats a date string (YYYY-MM-DD or ISO) into readable localized format
 */
export function formatDushanbeDate(dateInput: string | number | Date, lang: Language = 'tg'): string {
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return String(dateInput);

  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Dushanbe',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  });

  const parts = formatter.formatToParts(d);
  let day = '';
  let month = '';
  let year = '';

  for (const p of parts) {
    if (p.type === 'day') day = p.value;
    if (p.type === 'month') month = p.value;
    if (p.type === 'year') year = p.value;
  }

  const monthIdx = parseInt(month, 10) - 1;
  const monthList = MONTH_NAMES[lang] || MONTH_NAMES.tg;
  const monthName = monthList[monthIdx] || month;

  if (lang === 'en') {
    return `${monthName} ${day}, ${year}`;
  }
  return `${day} ${monthName} ${year}`;
}

/**
 * Formats month YYYY-MM to localized month and year: e.g. "Октябр 2026" / "October 2026"
 */
export function formatDushanbeMonth(monthStr: string, lang: Language = 'tg'): string {
  const [yearStr, monthNum] = monthStr.split('-');
  const idx = parseInt(monthNum, 10) - 1;
  const monthList = MONTH_NAMES[lang] || MONTH_NAMES.tg;
  const monthName = monthList[idx] || monthNum;
  return `${monthName} ${yearStr}`;
}

/**
 * Returns Monday (start) and Sunday (end) of the current week formatted as YYYY-MM-DD for Asia/Dushanbe
 */
export function getCurrentDushanbeWeekRange(): { start: string; end: string } {
  const dushanbeStr = getCurrentDushanbeDateString();
  const [year, month, day] = dushanbeStr.split('-').map(Number);
  const d = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
  const dayOfWeek = d.getUTCDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat
  const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

  d.setUTCDate(d.getUTCDate() - diffToMonday);
  const start = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`;

  d.setUTCDate(d.getUTCDate() + 6);
  const end = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`;

  return { start, end };
}

/**
 * Checks if a date YYYY-MM-DD falls within the current week (Monday to Sunday) in Asia/Dushanbe
 */
export function isDateInDushanbeCurrentWeek(dateStr: string): boolean {
  if (!dateStr) return false;
  const { start, end } = getCurrentDushanbeWeekRange();
  return dateStr >= start && dateStr <= end;
}

export interface MonthWeek {
  weekNumber: number;
  startDate: string;
  endDate: string;
  sundayDate: string | null;
  days: {
    day: number;
    dayOfWeek: number;
    dateStr: string;
    isSunday: boolean;
  }[];
}

/**
 * Returns the calendar weeks for a given month (YYYY-MM).
 * Weeks end on Sunday (or end of month).
 */
export function getWeeksInMonth(monthStr: string): MonthWeek[] {
  const [yearStr, monthNumStr] = monthStr.split('-');
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthNumStr, 10);
  if (isNaN(year) || isNaN(month)) return [];

  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const weeks: MonthWeek[] = [];
  let currentDays: MonthWeek['days'] = [];
  let weekIndex = 1;

  for (let day = 1; day <= daysInMonth; day++) {
    const d = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
    const dayOfWeek = d.getUTCDay();
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const isSunday = dayOfWeek === 0;

    currentDays.push({ day, dayOfWeek, dateStr, isSunday });

    if (isSunday || day === daysInMonth) {
      weeks.push({
        weekNumber: weekIndex++,
        days: currentDays,
        startDate: currentDays[0].dateStr,
        endDate: currentDays[currentDays.length - 1].dateStr,
        sundayDate: currentDays.find((d) => d.isSunday)?.dateStr || null,
      });
      currentDays = [];
    }
  }

  return weeks;
}



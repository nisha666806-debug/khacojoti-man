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

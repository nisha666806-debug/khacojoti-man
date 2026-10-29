/**
 * Date utilities using Asia/Dushanbe timezone (UTC+5)
 */

export const TAJIK_MONTHS = [
  'Январ',
  'Феврал',
  'Март',
  'Апрел',
  'Май',
  'Июн',
  'Июл',
  'Август',
  'Сентябр',
  'Октябр',
  'Ноябр',
  'Декабр',
];

export const TAJIK_WEEKDAYS = [
  'Якшанбе',
  'Душанбе',
  'Сешанбе',
  'Чоршанбе',
  'Панҷшанбе',
  'Ҷумъа',
  'Шанбе',
];

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
 * Formats a date string (YYYY-MM-DD or ISO) into readable Tajik format: "29 Октябр 2026"
 */
export function formatDushanbeDate(dateInput: string | number | Date): string {
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return String(dateInput);

  const formatter = new Intl.DateTimeFormat('tg-TJ', {
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
  const monthName = TAJIK_MONTHS[monthIdx] || month;

  return `${day} ${monthName} ${year}`;
}

/**
 * Formats month YYYY-MM to Tajik month and year: "Октябр 2026"
 */
export function formatDushanbeMonth(monthStr: string): string {
  const [yearStr, monthNum] = monthStr.split('-');
  const idx = parseInt(monthNum, 10) - 1;
  const monthName = TAJIK_MONTHS[idx] || monthNum;
  return `${monthName} ${yearStr}`;
}

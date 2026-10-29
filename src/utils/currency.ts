/**
 * Currency utilities for Tajik Somoni (TJS) and Diram.
 * Rule: All monetary amounts in database are stored as integer dirams.
 * 1 Somoni = 100 Dirams.
 */

export function somoniToDiram(somoni: number | string): number {
  const numeric = typeof somoni === 'string' ? parseFloat(somoni.replace(',', '.')) : somoni;
  if (isNaN(numeric) || numeric < 0) return 0;
  return Math.round(numeric * 100);
}

export function diramToSomoni(diram: number): number {
  if (typeof diram !== 'number' || isNaN(diram)) return 0;
  return diram / 100;
}

export function formatMoney(diram: number): string {
  const somoni = diramToSomoni(diram);
  return `${somoni.toLocaleString('tg-TJ', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} сомонӣ`;
}

export function formatMoneyWithoutUnit(diram: number): string {
  const somoni = diramToSomoni(diram);
  return somoni.toLocaleString('tg-TJ', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

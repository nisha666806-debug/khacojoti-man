import { Language } from '../types/i18n';
import { translations } from '../i18n/translations';

export function somoniToDiram(somoni: number | string): number {
  const numeric = typeof somoni === 'string' ? parseFloat(somoni.replace(',', '.')) : somoni;
  if (isNaN(numeric) || numeric < 0) return 0;
  return Math.round(numeric * 100);
}

export function diramToSomoni(diram: number): number {
  if (typeof diram !== 'number' || isNaN(diram)) return 0;
  return diram / 100;
}

export function formatMoney(diram: number, lang: Language = 'tg'): string {
  const somoni = diramToSomoni(diram);
  const locale = lang === 'en' ? 'en-US' : lang === 'ru' ? 'ru-RU' : 'tg-TJ';
  const unit = translations[lang].currencyUnit;

  const formatted = somoni.toLocaleString(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return `${formatted} ${unit}`;
}

export function formatMoneyWithoutUnit(diram: number, lang: Language = 'tg'): string {
  const somoni = diramToSomoni(diram);
  const locale = lang === 'en' ? 'en-US' : lang === 'ru' ? 'ru-RU' : 'tg-TJ';
  return somoni.toLocaleString(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

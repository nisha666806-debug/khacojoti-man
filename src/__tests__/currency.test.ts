import { describe, it, expect } from 'vitest';
import { somoniToDiram, diramToSomoni, formatMoney } from '../utils/currency';

describe('Currency Utilities (TJS / Diram)', () => {
  it('converts somoni float to integer diram accurately', () => {
    expect(somoniToDiram(10)).toBe(1000);
    expect(somoniToDiram(10.5)).toBe(1050);
    expect(somoniToDiram(0.99)).toBe(99);
    expect(somoniToDiram('25.75')).toBe(2575);
    expect(somoniToDiram('100,50')).toBe(10050);
  });

  it('converts diram integer to somoni float', () => {
    expect(diramToSomoni(1000)).toBe(10);
    expect(diramToSomoni(1050)).toBe(10.5);
    expect(diramToSomoni(99)).toBe(0.99);
    expect(diramToSomoni(0)).toBe(0);
  });

  it('formats monetary values with localized currency unit', () => {
    const formattedTg = formatMoney(5000, 'tg');
    expect(formattedTg).toContain('сомонӣ');

    const formattedRu = formatMoney(5000, 'ru');
    expect(formattedRu).toContain('сомони');

    const formattedEn = formatMoney(5000, 'en');
    expect(formattedEn).toContain('TJS');
  });

  it('handles negative or invalid values gracefully', () => {
    expect(somoniToDiram(-10)).toBe(0);
    expect(somoniToDiram('invalid')).toBe(0);
    expect(diramToSomoni(NaN)).toBe(0);
  });
});

import { describe, it, expect } from 'vitest';

describe('Budget calculation logic', () => {
  it('calculates budget percentage and remaining accurately', () => {
    const budgetDiram = 50000; // 500 Somoni
    const spentDiram = 25000; // 250 Somoni

    const percentage = Math.round((spentDiram / budgetDiram) * 100);
    const remaining = Math.max(0, budgetDiram - spentDiram);
    const isExceeded = spentDiram > budgetDiram;

    expect(percentage).toBe(50);
    expect(remaining).toBe(25000);
    expect(isExceeded).toBe(false);
  });

  it('detects when budget is exceeded', () => {
    const budgetDiram = 50000;
    const spentDiram = 60000;

    const isExceeded = spentDiram > budgetDiram;
    const overAmount = spentDiram - budgetDiram;

    expect(isExceeded).toBe(true);
    expect(overAmount).toBe(10000);
  });
});

import React, { useState, useMemo } from 'react';
import { PieChart as PieChartIcon } from 'lucide-react';
import { useExpenses } from '../context/ExpenseContext';
import { useLanguage } from '../context/LanguageContext';
import { getCurrentDushanbeMonthString } from '../utils/date';

export const Reports: React.FC = () => {
  const { expenses } = useExpenses();
  const { t, formatMoney, formatMonth, getLocalizedCategoryName } = useLanguage();
  const [selectedMonth, setSelectedMonth] = useState(getCurrentDushanbeMonthString());

  // Extract all available months from expenses
  const availableMonths = useMemo(() => {
    const set = new Set<string>();
    set.add(getCurrentDushanbeMonthString());
    expenses.forEach((e) => {
      if (e.date && e.date.length >= 7) {
        set.add(e.date.substring(0, 7));
      }
    });
    return Array.from(set).sort().reverse();
  }, [expenses]);

  const monthExpenses = useMemo(() => {
    return expenses.filter((e) => e.date.startsWith(selectedMonth));
  }, [expenses, selectedMonth]);

  const totalMonthDiram = useMemo(() => {
    return monthExpenses.reduce((sum, e) => sum + e.amountInDiram, 0);
  }, [monthExpenses]);

  // Group by category
  const categoryStats = useMemo(() => {
    const map = new Map<string, { id: string; name: string; amountInDiram: number; count: number }>();

    monthExpenses.forEach((exp) => {
      const existing = map.get(exp.categoryId) || {
        id: exp.categoryId,
        name: exp.categoryName,
        amountInDiram: 0,
        count: 0,
      };
      existing.amountInDiram += exp.amountInDiram;
      existing.count += 1;
      map.set(exp.categoryId, existing);
    });

    const list = Array.from(map.values()).map((data) => ({
      id: data.id,
      name: getLocalizedCategoryName(data.id, data.name),
      amountInDiram: data.amountInDiram,
      count: data.count,
      percentage: totalMonthDiram > 0 ? Math.round((data.amountInDiram / totalMonthDiram) * 100) : 0,
    }));

    return list.sort((a, b) => b.amountInDiram - a.amountInDiram);
  }, [monthExpenses, totalMonthDiram, getLocalizedCategoryName]);

  const topCategory = categoryStats[0] || null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Header with Month Selector */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">{t.reportsTitle}</h2>
          <p className="text-sm text-slate-400">
            {t.reportsSubtitle}
          </p>
        </div>

        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:border-sky-500 outline-none font-medium shadow-sm"
        >
          {availableMonths.map((m) => (
            <option key={m} value={m}>
              {formatMonth(m)}
            </option>
          ))}
        </select>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-800/80 border border-slate-700/60 p-5 rounded-2xl shadow-sm">
          <span className="text-xs font-semibold uppercase text-slate-400">{t.totalExpenses}</span>
          <div className="text-2xl font-bold text-white mt-1">
            {formatMoney(totalMonthDiram)}
          </div>
          <p className="text-xs text-slate-400 mt-2">
            {t.reportsSubtitle} {formatMonth(selectedMonth)}
          </p>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/60 p-5 rounded-2xl shadow-sm">
          <span className="text-xs font-semibold uppercase text-slate-400">{t.topCategory}</span>
          <div className="text-2xl font-bold text-sky-400 mt-1">
            {topCategory ? topCategory.name : t.noData}
          </div>
          <p className="text-xs text-slate-400 mt-2">
            {topCategory ? `${formatMoney(topCategory.amountInDiram)} (${topCategory.percentage}%)` : t.noExpensesThisMonth}
          </p>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/60 p-5 rounded-2xl shadow-sm">
          <span className="text-xs font-semibold uppercase text-slate-400">{t.paymentCount}</span>
          <div className="text-2xl font-bold text-white mt-1">
            {monthExpenses.length}
          </div>
          <p className="text-xs text-slate-400 mt-2">
            {t.paymentsThisMonth}
          </p>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <PieChartIcon className="w-5 h-5 text-sky-400" />
          <h3 className="text-lg font-bold text-white">{t.categoryBreakdown}</h3>
        </div>

        {categoryStats.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <p className="text-sm">{t.noExpensesThisMonth}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {categoryStats.map((item, index) => {
              const colors = [
                'bg-sky-500',
                'bg-emerald-500',
                'bg-indigo-500',
                'bg-amber-500',
                'bg-purple-500',
                'bg-rose-500',
                'bg-cyan-500',
                'bg-slate-500',
              ];
              const colorClass = colors[index % colors.length];

              return (
                <div key={item.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-white flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${colorClass}`} />
                      {item.name}
                      <span className="text-xs text-slate-400">({item.count} {t.paymentsCountLabel})</span>
                    </span>
                    <span className="font-semibold text-slate-200">
                      {formatMoney(item.amountInDiram)}{' '}
                      <span className="text-xs text-slate-400 font-normal">
                        ({item.percentage}%)
                      </span>
                    </span>
                  </div>
                  <div className="w-full bg-slate-700/50 rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`h-2.5 rounded-full ${colorClass} transition-all duration-300`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

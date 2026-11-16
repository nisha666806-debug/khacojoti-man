import React, { useMemo, useState } from 'react';
import { BarChart3, ChevronDown, ChevronUp, Flame } from 'lucide-react';
import { Expense } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { getWeeksInMonth, MonthWeek } from '../utils/date';

interface WeeklyMonthReportProps {
  expenses: Expense[];
  selectedMonth: string; // YYYY-MM
}

interface WeekStat extends MonthWeek {
  totalDiram: number;
  count: number;
  sundayTotalDiram: number;
  expenses: Expense[];
  dailyMap: Map<string, { totalDiram: number; count: number }>;
}

export const WeeklyMonthReport: React.FC<WeeklyMonthReportProps> = ({
  expenses,
  selectedMonth,
}) => {
  const { t, formatMoney, formatDate, formatMonth } = useLanguage();
  const [expandedWeek, setExpandedWeek] = useState<number | null>(null);

  const weeks = useMemo(() => getWeeksInMonth(selectedMonth), [selectedMonth]);

  const weekStats: WeekStat[] = useMemo(() => {
    return weeks.map((w) => {
      const weekExpenses = expenses.filter(
        (e) => e.date >= w.startDate && e.date <= w.endDate
      );

      const totalDiram = weekExpenses.reduce((sum, e) => sum + e.amountInDiram, 0);

      // Sunday specific expenses
      const sundayExpenses = w.sundayDate
        ? weekExpenses.filter((e) => e.date === w.sundayDate)
        : [];
      const sundayTotalDiram = sundayExpenses.reduce((sum, e) => sum + e.amountInDiram, 0);

      // Daily map
      const dailyMap = new Map<string, { totalDiram: number; count: number }>();
      w.days.forEach((d) => {
        dailyMap.set(d.dateStr, { totalDiram: 0, count: 0 });
      });
      weekExpenses.forEach((e) => {
        const current = dailyMap.get(e.date) || { totalDiram: 0, count: 0 };
        current.totalDiram += e.amountInDiram;
        current.count += 1;
        dailyMap.set(e.date, current);
      });

      return {
        ...w,
        totalDiram,
        count: weekExpenses.length,
        sundayTotalDiram,
        expenses: weekExpenses,
        dailyMap,
      };
    });
  }, [weeks, expenses]);

  const maxWeekDiram = useMemo(() => {
    return Math.max(...weekStats.map((w) => w.totalDiram), 0);
  }, [weekStats]);

  const totalMonthDiram = useMemo(() => {
    return weekStats.reduce((sum, w) => sum + w.totalDiram, 0);
  }, [weekStats]);

  const highestWeek = useMemo(() => {
    if (maxWeekDiram <= 0) return null;
    return weekStats.find((w) => w.totalDiram === maxWeekDiram) || null;
  }, [weekStats, maxWeekDiram]);

  const toggleWeek = (weekNum: number) => {
    setExpandedWeek((prev) => (prev === weekNum ? null : weekNum));
  };

  return (
    <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-5 shadow-sm space-y-6">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-700/60 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">{t.weeklyAnalysisTitle}</h3>
            <p className="text-xs text-slate-400">
              {formatMonth(selectedMonth)} — {weekStats.length} {t.weekLabel.toLowerCase()}
            </p>
          </div>
        </div>

        {highestWeek && maxWeekDiram > 0 && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-semibold self-start sm:self-auto">
            <Flame className="w-4 h-4 text-amber-400" />
            <span>
              {t.highestSpendingWeek}: {t.weekLabel} {highestWeek.weekNumber} ({formatMoney(highestWeek.totalDiram)})
            </span>
          </div>
        )}
      </div>

      {/* Visual Bar Chart for Weeks */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase tracking-wider">
          <span>{t.weeklyChartTitle}</span>
          <span>{formatMoney(totalMonthDiram)}</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 pt-2">
          {weekStats.map((w) => {
            const isHighest = maxWeekDiram > 0 && w.totalDiram === maxWeekDiram;
            const percentageOfTotal =
              totalMonthDiram > 0 ? Math.round((w.totalDiram / totalMonthDiram) * 100) : 0;
            const heightPercentage =
              maxWeekDiram > 0 ? Math.max(12, Math.round((w.totalDiram / maxWeekDiram) * 100)) : 12;

            return (
              <div
                key={w.weekNumber}
                onClick={() => toggleWeek(w.weekNumber)}
                className={`cursor-pointer group flex flex-col items-center justify-end p-3 rounded-xl border transition-all ${
                  expandedWeek === w.weekNumber
                    ? 'bg-slate-700/60 border-sky-500 shadow-md ring-1 ring-sky-500/50'
                    : isHighest && w.totalDiram > 0
                    ? 'bg-slate-800/90 border-amber-500/40 hover:border-amber-400/80 hover:bg-slate-700/40'
                    : 'bg-slate-900/60 border-slate-700/60 hover:border-slate-600 hover:bg-slate-700/30'
                }`}
              >
                {/* Amount label */}
                <span className="text-[11px] font-bold text-white mb-1 group-hover:scale-105 transition-transform text-center">
                  {formatMoney(w.totalDiram)}
                </span>
                <span className="text-[10px] text-slate-400 mb-2">
                  {percentageOfTotal}%
                </span>

                {/* Vertical Bar Container */}
                <div className="w-full h-24 bg-slate-800/80 rounded-lg flex items-end p-1 overflow-hidden relative">
                  <div
                    className={`w-full rounded-md transition-all duration-500 ${
                      isHighest && w.totalDiram > 0
                        ? 'bg-gradient-to-t from-amber-600 to-rose-500 shadow-lg shadow-amber-500/20'
                        : w.totalDiram > 0
                        ? 'bg-gradient-to-t from-sky-600 to-indigo-500'
                        : 'bg-slate-700/40'
                    }`}
                    style={{ height: `${heightPercentage}%` }}
                  />
                  {isHighest && w.totalDiram > 0 && (
                    <Flame className="w-3.5 h-3.5 text-white absolute top-1.5 left-1/2 -translate-x-1/2 animate-bounce" />
                  )}
                </div>

                {/* Week name and date range */}
                <div className="mt-2 text-center">
                  <p className="text-xs font-bold text-white leading-tight">
                    {t.weekLabel} {w.weekNumber}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {w.startDate.slice(8)}–{w.endDate.slice(8)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detailed Weekly Breakdown Cards with Red Sunday Highlight */}
      <div className="space-y-3 pt-2">
        <h4 className="text-sm font-bold text-slate-200">{t.dailyBreakdown}</h4>

        <div className="space-y-3">
          {weekStats.map((w) => {
            const isHighest = maxWeekDiram > 0 && w.totalDiram === maxWeekDiram;
            const isExpanded = expandedWeek === w.weekNumber;

            return (
              <div
                key={w.weekNumber}
                className={`rounded-xl border transition-all overflow-hidden ${
                  isExpanded
                    ? 'bg-slate-800 border-sky-500/80 shadow-lg'
                    : isHighest && w.totalDiram > 0
                    ? 'bg-slate-800/90 border-amber-500/30 hover:border-amber-500/60'
                    : 'bg-slate-800/60 border-slate-700/60 hover:border-slate-600'
                }`}
              >
                {/* Header row */}
                <div
                  onClick={() => toggleWeek(w.weekNumber)}
                  className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                        isHighest && w.totalDiram > 0
                          ? 'bg-gradient-to-tr from-amber-500 to-rose-500 text-white shadow-md shadow-amber-500/20'
                          : 'bg-slate-700 text-slate-200'
                      }`}
                    >
                      {w.weekNumber}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white">
                          {t.weekLabel} {w.weekNumber}
                        </span>
                        <span className="text-xs text-slate-400 font-normal">
                          ({formatDate(w.startDate)} — {formatDate(w.endDate)})
                        </span>
                        {isHighest && w.totalDiram > 0 && (
                          <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 text-[10px] font-bold">
                            {t.highestSpendingWeek}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {w.count} {t.paymentsCountLabel}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 pl-12 sm:pl-0">
                    {/* Sunday highlight tag if Sunday has spending */}
                    {w.sundayDate && (
                      <div
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                          w.sundayTotalDiram > 0
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm shadow-rose-500/10 animate-pulse'
                            : 'bg-rose-500/10 text-rose-400/70 border border-rose-500/20'
                        }`}
                        title={`${t.sundaySpending}: ${formatMoney(w.sundayTotalDiram)}`}
                      >
                        <span className="w-2 h-2 rounded-full bg-rose-500" />
                        <span>{t.sundayLabel}:</span>
                        <span>{formatMoney(w.sundayTotalDiram)}</span>
                      </div>
                    )}

                    <div className="text-right">
                      <span className="font-bold text-base text-white">
                        {formatMoney(w.totalDiram)}
                      </span>
                    </div>

                    <button
                      type="button"
                      className="p-1 rounded-lg text-slate-400 hover:text-white"
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Expanded Details: Days of week with Sunday in Red */}
                {isExpanded && (
                  <div className="border-t border-slate-700/60 p-4 bg-slate-900/60 space-y-4 animate-in fade-in duration-150">
                    {/* Daily grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
                      {w.days.map((d) => {
                        const dayData = w.dailyMap.get(d.dateStr) || { totalDiram: 0, count: 0 };
                        const isSunday = d.isSunday;

                        return (
                          <div
                            key={d.dateStr}
                            className={`p-2.5 rounded-xl border text-center transition-all ${
                              isSunday
                                ? 'bg-rose-950/30 border-rose-500/60 text-rose-200 ring-1 ring-rose-500/30'
                                : dayData.totalDiram > 0
                                ? 'bg-slate-800/80 border-slate-700 text-white'
                                : 'bg-slate-900/40 border-slate-800 text-slate-400'
                            }`}
                          >
                            <div className="flex items-center justify-between text-[11px] font-semibold mb-1">
                              <span
                                className={`px-1.5 py-0.5 rounded-md ${
                                  isSunday
                                    ? 'bg-rose-600 text-white font-bold'
                                    : 'text-slate-300'
                                }`}
                              >
                                {isSunday ? t.sundayLabel : formatDate(d.dateStr).split(' ')[0]}
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono">
                                {d.dateStr.slice(8)}
                              </span>
                            </div>

                            <p
                              className={`text-xs font-bold mt-1 ${
                                isSunday
                                  ? 'text-rose-300'
                                  : dayData.totalDiram > 0
                                  ? 'text-white'
                                  : 'text-slate-500'
                              }`}
                            >
                              {formatMoney(dayData.totalDiram)}
                            </p>
                            <p className="text-[10px] text-slate-400 mt-0.5">
                              {dayData.count} {t.paymentsCountLabel}
                            </p>
                          </div>
                        );
                      })}
                    </div>

                    {/* Expenses list inside this week */}
                    {w.expenses.length > 0 ? (
                      <div className="space-y-1.5 pt-2">
                        <span className="text-xs font-semibold text-slate-300">
                          {t.recentExpensesTitle} ({t.weekLabel} {w.weekNumber}):
                        </span>
                        <div className="divide-y divide-slate-800 rounded-xl bg-slate-900/80 border border-slate-800 overflow-hidden">
                          {w.expenses.map((exp) => {
                            const isSundayExp = w.sundayDate === exp.date;
                            return (
                              <div
                                key={exp.id}
                                className={`px-3 py-2 flex items-center justify-between text-xs transition-colors ${
                                  isSundayExp ? 'bg-rose-950/20' : ''
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  {isSundayExp && (
                                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-600 text-white">
                                      {t.sundayLabel}
                                    </span>
                                  )}
                                  <span className="font-semibold text-white">{exp.title}</span>
                                  <span className="text-slate-400">({exp.categoryName})</span>
                                </div>
                                <div className="flex items-center gap-3">
                                  <span className="text-slate-400">{formatDate(exp.date)}</span>
                                  <span className="font-bold text-white">
                                    -{formatMoney(exp.amountInDiram)}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-3 text-xs text-slate-400">
                        {t.noExpensesThisWeek}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

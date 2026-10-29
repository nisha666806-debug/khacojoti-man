import React, { useState, useEffect } from 'react';
import { Wallet, CheckCircle, AlertTriangle, ArrowRight } from 'lucide-react';
import { useExpenses } from '../context/ExpenseContext';
import { formatMoney, somoniToDiram, diramToSomoni } from '../utils/currency';
import { formatDushanbeMonth } from '../utils/date';

export const BudgetPage: React.FC = () => {
  const { budget, expenses, currentMonth, updateBudget } = useExpenses();

  const [somoniInput, setSomoniInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (budget && budget.amountInDiram > 0) {
      setSomoniInput(String(diramToSomoni(budget.amountInDiram)));
    } else {
      setSomoniInput('');
    }
  }, [budget]);

  const thisMonthExpenses = expenses.filter((e) => e.date.startsWith(currentMonth));
  const totalSpentDiram = thisMonthExpenses.reduce((sum, e) => sum + e.amountInDiram, 0);

  const budgetDiram = budget?.amountInDiram || 0;
  const percentage =
    budgetDiram > 0 ? Math.min(100, Math.round((totalSpentDiram / budgetDiram) * 100)) : 0;
  const isExceeded = budgetDiram > 0 && totalSpentDiram > budgetDiram;
  const remainingDiram = Math.max(0, budgetDiram - totalSpentDiram);

  const handleSaveBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    const diram = somoniToDiram(somoniInput);
    setSaving(true);
    setSuccessMsg('');
    try {
      await updateBudget(diram);
      setSuccessMsg('Буҷет бомуваффақият сабт шуд!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Буҷети моҳона</h2>
        <p className="text-sm text-slate-400">
          Идораи хароҷоти моҳи {formatDushanbeMonth(currentMonth)}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Set Budget Form */}
        <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Танзими лимити буҷет</h3>
              <p className="text-xs text-slate-400">
                Барои моҳи ҷорӣ ({formatDushanbeMonth(currentMonth)})
              </p>
            </div>
          </div>

          {successMsg && (
            <div className="p-3 mb-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSaveBudget} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Маблағи лимит (бо сомонӣ, TJS)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={somoniInput}
                  onChange={(e) => setSomoniInput(e.target.value)}
                  placeholder="Масалан: 2500"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 focus:border-sky-500 outline-none text-sm text-white pr-20"
                />
                <span className="absolute right-3.5 top-2.5 text-xs text-slate-400 font-medium">
                  сомонӣ
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full py-2.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-sm shadow-lg shadow-sky-600/30 transition-colors"
            >
              {saving ? 'Сабт шуда истодааст...' : 'Сабти буҷет'}
            </button>
          </form>
        </div>

        {/* Budget Status Card */}
        <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-white text-base mb-4">Ҳолати иҷроиши буҷет</h3>

            {budgetDiram === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <p className="text-sm">Буҷет ҳанӯз танзим нашудааст.</p>
                <p className="text-xs text-slate-500 mt-1">
                  Дар шакли чап маблағи лимити дилхоҳро ворид кунед.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-slate-400">Сарфшуда:</span>
                  <span className="text-lg font-bold text-white">
                    {formatMoney(totalSpentDiram)}
                  </span>
                </div>

                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-slate-400">Лимити буҷет:</span>
                  <span className="text-sm font-semibold text-slate-300">
                    {formatMoney(budgetDiram)}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="space-y-1.5 pt-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className={isExceeded ? 'text-rose-400' : 'text-slate-300'}>
                      {percentage}% истифода шуд
                    </span>
                    <span className="text-slate-400">
                      {isExceeded ? (
                        <span className="text-rose-400 font-bold">
                          Барзиёд: +{formatMoney(totalSpentDiram - budgetDiram)}
                        </span>
                      ) : (
                        `Боқимонда: ${formatMoney(remainingDiram)}`
                      )}
                    </span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-3 rounded-full transition-all duration-500 ${
                        isExceeded
                          ? 'bg-rose-500'
                          : percentage > 85
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>

                {isExceeded && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 mt-4">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                    <span>
                      Огоҳӣ! Шумо аз лимити муайяншудаи буҷети ин моҳ гузаштед!
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-700/60 flex items-center justify-between text-xs text-slate-400">
            <span>Ҳисоб: Баробар ба минтақаи Осиё/Душанбе</span>
            <div className="flex items-center gap-1 text-sky-400">
              <span>TJS / Дирам</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

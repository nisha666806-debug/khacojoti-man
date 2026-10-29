import React, { useState } from 'react';
import { Plus, TrendingUp, Calendar, AlertCircle, ArrowUpRight } from 'lucide-react';
import { useExpenses } from '../context/ExpenseContext';
import { formatMoney } from '../utils/currency';
import {
  getCurrentDushanbeDateString,
  getCurrentDushanbeMonthString,
  formatDushanbeDate,
  formatDushanbeMonth,
} from '../utils/date';
import { ExpenseModal } from '../components/ExpenseModal';
import { DeleteConfirmModal } from '../components/DeleteConfirmModal';
import { Expense } from '../types';
import { Link } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const { expenses, budget, currentMonth, removeExpense } = useExpenses();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [expenseToDelete, setExpenseToDelete] = useState<Expense | null>(null);

  const todayStr = getCurrentDushanbeDateString();
  const thisMonthStr = getCurrentDushanbeMonthString();

  // Calculations
  const thisMonthExpenses = expenses.filter((e) => e.date.startsWith(thisMonthStr));
  const todayExpenses = expenses.filter((e) => e.date === todayStr);

  const totalThisMonthDiram = thisMonthExpenses.reduce((sum, e) => sum + e.amountInDiram, 0);
  const totalTodayDiram = todayExpenses.reduce((sum, e) => sum + e.amountInDiram, 0);

  const budgetDiram = budget?.amountInDiram || 0;
  const budgetPercentage =
    budgetDiram > 0 ? Math.min(100, Math.round((totalThisMonthDiram / budgetDiram) * 100)) : 0;
  const isBudgetExceeded = budgetDiram > 0 && totalThisMonthDiram > budgetDiram;

  const recentExpenses = expenses.slice(0, 5);

  const handleEdit = (exp: Expense) => {
    setSelectedExpense(exp);
    setIsModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (expenseToDelete) {
      await removeExpense(expenseToDelete.id);
      setExpenseToDelete(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Header with Title and Add Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Панели асосӣ</h2>
          <p className="text-sm text-slate-400">
            Хулосаи молиявии шумо барои моҳи {formatDushanbeMonth(currentMonth)}
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedExpense(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-sm shadow-lg shadow-sky-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          <span>Хароҷоти нав</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Monthly Expense */}
        <div className="bg-slate-800/80 border border-slate-700/60 p-5 rounded-2xl shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Хароҷоти моҳ</span>
            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white">
            {formatMoney(totalThisMonthDiram)}
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Дар маҷмӯъ {thisMonthExpenses.length} пардохт сабт шуд
          </p>
        </div>

        {/* Today's Expense */}
        <div className="bg-slate-800/80 border border-slate-700/60 p-5 rounded-2xl shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Хароҷоти имрӯз</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white">
            {formatMoney(totalTodayDiram)}
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Санаи имрӯз: {formatDushanbeDate(todayStr)}
          </p>
        </div>

        {/* Budget Status */}
        <div className="bg-slate-800/80 border border-slate-700/60 p-5 rounded-2xl shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Буҷети моҳона</span>
            <div
              className={`p-2 rounded-xl ${
                isBudgetExceeded
                  ? 'bg-rose-500/10 text-rose-400'
                  : 'bg-indigo-500/10 text-indigo-400'
              }`}
            >
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white">
            {budgetDiram > 0 ? formatMoney(budgetDiram) : 'Муайян нашудааст'}
          </div>
          {budgetDiram > 0 ? (
            <div className="mt-3">
              <div className="flex justify-between text-xs font-medium text-slate-400 mb-1">
                <span>Иҷрошавӣ: {budgetPercentage}%</span>
                <span>
                  {isBudgetExceeded ? 'Буҷет гузашт!' : `Боқимонда: ${formatMoney(Math.max(0, budgetDiram - totalThisMonthDiram))}`}
                </span>
              </div>
              <div className="w-full bg-slate-700/50 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    isBudgetExceeded
                      ? 'bg-rose-500'
                      : budgetPercentage > 85
                      ? 'bg-amber-500'
                      : 'bg-sky-500'
                  }`}
                  style={{ width: `${budgetPercentage}%` }}
                />
              </div>
            </div>
          ) : (
            <Link
              to="/budget"
              className="inline-flex items-center gap-1 text-xs text-sky-400 hover:text-sky-300 mt-2 font-medium"
            >
              <span>Танзими буҷет</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </div>

      {/* Recent Expenses List */}
      <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg text-white">Хароҷоти охирин</h3>
          <Link
            to="/history"
            className="text-xs font-medium text-sky-400 hover:text-sky-300 flex items-center gap-1"
          >
            <span>Ҳамаро дидан</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentExpenses.length === 0 ? (
          <div className="text-center py-10 text-slate-400">
            <p className="text-sm">Ҳанӯз ягон хароҷот ворид карда нашудааст.</p>
            <button
              onClick={() => {
                setSelectedExpense(null);
                setIsModalOpen(true);
              }}
              className="mt-3 text-xs text-sky-400 hover:underline"
            >
              Аввалин хароҷотро илова кунед
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-700/60">
            {recentExpenses.map((exp) => (
              <div
                key={exp.id}
                className="py-3.5 flex items-center justify-between gap-3 hover:bg-slate-700/20 px-2 rounded-xl transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-700/60 flex items-center justify-center text-slate-300 font-semibold text-xs border border-slate-600/40">
                    {exp.categoryName.substring(0, 2)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-white">{exp.title}</h4>
                    <p className="text-xs text-slate-400">
                      {exp.categoryName} • {formatDushanbeDate(exp.date)}
                    </p>
                  </div>
                </div>

                <div className="text-right flex items-center gap-3">
                  <span className="font-bold text-sm text-white">
                    -{formatMoney(exp.amountInDiram)}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleEdit(exp)}
                      className="px-2.5 py-1 text-xs rounded-lg text-sky-400 hover:bg-sky-500/10 transition-colors"
                    >
                      Таҳрир
                    </button>
                    <button
                      onClick={() => setExpenseToDelete(exp)}
                      className="px-2.5 py-1 text-xs rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors"
                    >
                      Нест
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add / Edit Expense Modal */}
      <ExpenseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        expenseToEdit={selectedExpense}
      />

      {/* Delete Expense Modal */}
      <DeleteConfirmModal
        isOpen={!!expenseToDelete}
        expense={expenseToDelete}
        onClose={() => setExpenseToDelete(null)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

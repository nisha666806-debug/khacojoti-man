import React, { useState, useMemo } from 'react';
import { Search, Filter, Plus, Trash2, Edit3 } from 'lucide-react';
import { useExpenses } from '../context/ExpenseContext';
import { useLanguage } from '../context/LanguageContext';
import { getCurrentDushanbeDateString, getCurrentDushanbeMonthString } from '../utils/date';
import { ExpenseModal } from '../components/ExpenseModal';
import { DeleteConfirmModal } from '../components/DeleteConfirmModal';
import { Expense } from '../types';

export const History: React.FC = () => {
  const { expenses, categories, removeExpense } = useExpenses();
  const { t, formatMoney, formatDate, getLocalizedCategoryName } = useLanguage();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'month'>('all');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [expenseToDelete, setExpenseToDelete] = useState<Expense | null>(null);

  const todayStr = getCurrentDushanbeDateString();
  const currentMonthStr = getCurrentDushanbeMonthString();

  const filteredExpenses = useMemo(() => {
    return expenses.filter((exp) => {
      const matchesSearch =
        exp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (exp.note && exp.note.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCategory =
        selectedCategory === 'all' || exp.categoryId === selectedCategory;

      let matchesDate = true;
      if (dateFilter === 'today') {
        matchesDate = exp.date === todayStr;
      } else if (dateFilter === 'month') {
        matchesDate = exp.date.startsWith(currentMonthStr);
      }

      return matchesSearch && matchesCategory && matchesDate;
    });
  }, [expenses, searchTerm, selectedCategory, dateFilter, todayStr, currentMonthStr]);

  const totalFilteredDiram = useMemo(() => {
    return filteredExpenses.reduce((sum, e) => sum + e.amountInDiram, 0);
  }, [filteredExpenses]);

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
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">{t.historyTitle}</h2>
          <p className="text-sm text-slate-400">
            {t.historySubtitle}
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedExpense(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-sm shadow-lg shadow-sky-600/30 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>{t.newExpenseBtn}</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-800/80 border border-slate-700/60 p-4 rounded-2xl space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700 focus:border-sky-500 outline-none text-sm text-white"
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <Filter className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700 focus:border-sky-500 outline-none text-sm text-white"
            >
              <option value="all">{t.allCategories}</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {getLocalizedCategoryName(c.id, c.name)}
                </option>
              ))}
            </select>
          </div>

          {/* Date Filter Tabs */}
          <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-700">
            <button
              onClick={() => setDateFilter('all')}
              className={`flex-1 py-1 text-xs font-semibold rounded-lg transition-colors ${
                dateFilter === 'all'
                  ? 'bg-sky-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t.filterAllTime}
            </button>
            <button
              onClick={() => setDateFilter('month')}
              className={`flex-1 py-1 text-xs font-semibold rounded-lg transition-colors ${
                dateFilter === 'month'
                  ? 'bg-sky-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t.filterThisMonth}
            </button>
            <button
              onClick={() => setDateFilter('today')}
              className={`flex-1 py-1 text-xs font-semibold rounded-lg transition-colors ${
                dateFilter === 'today'
                  ? 'bg-sky-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t.filterToday}
            </button>
          </div>
        </div>

        {/* Filtered stats summary */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-700/60 text-xs text-slate-400">
          <span>{t.foundRecords} {filteredExpenses.length}</span>
          <span>
            {t.totalSum} <strong className="text-white text-sm">{formatMoney(totalFilteredDiram)}</strong>
          </span>
        </div>
      </div>

      {/* Expenses List */}
      <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl divide-y divide-slate-700/60 overflow-hidden shadow-sm">
        {filteredExpenses.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <p className="text-sm">{t.noExpensesFound}</p>
          </div>
        ) : (
          filteredExpenses.map((exp) => {
            const catName = getLocalizedCategoryName(exp.categoryId, exp.categoryName);
            return (
              <div
                key={exp.id}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-700/20 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-700/80 flex items-center justify-center font-bold text-xs text-slate-200 border border-slate-600/40 shrink-0 mt-0.5">
                    {catName.substring(0, 2)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-white">{exp.title}</h4>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mt-0.5">
                      <span className="px-2 py-0.5 rounded-md bg-slate-700 text-slate-300">
                        {catName}
                      </span>
                      <span>•</span>
                      <span>{formatDate(exp.date)}</span>
                      {exp.note && (
                        <>
                          <span>•</span>
                          <span className="italic text-slate-300">"{exp.note}"</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pl-12 sm:pl-0">
                  <span className="text-base font-bold text-white">
                    -{formatMoney(exp.amountInDiram)}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleEdit(exp)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-sky-400 hover:bg-sky-500/10 transition-colors"
                      title={t.edit}
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setExpenseToDelete(exp)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title={t.delete}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Edit modal */}
      <ExpenseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        expenseToEdit={selectedExpense}
      />

      {/* Delete modal */}
      <DeleteConfirmModal
        isOpen={!!expenseToDelete}
        expense={expenseToDelete}
        onClose={() => setExpenseToDelete(null)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

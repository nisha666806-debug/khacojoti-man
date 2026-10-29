import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Expense } from '../types';
import { useExpenses } from '../context/ExpenseContext';
import { somoniToDiram, diramToSomoni } from '../utils/currency';
import { getCurrentDushanbeDateString } from '../utils/date';

interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  expenseToEdit?: Expense | null;
}

export const ExpenseModal: React.FC<ExpenseModalProps> = ({
  isOpen,
  onClose,
  expenseToEdit,
}) => {
  const { categories, createExpense, editExpense } = useExpenses();

  const [title, setTitle] = useState('');
  const [somoniAmount, setSomoniAmount] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [date, setDate] = useState(getCurrentDushanbeDateString());
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (expenseToEdit) {
      setTitle(expenseToEdit.title);
      setSomoniAmount(String(diramToSomoni(expenseToEdit.amountInDiram)));
      setCategoryId(expenseToEdit.categoryId);
      setDate(expenseToEdit.date);
      setNote(expenseToEdit.note || '');
    } else {
      setTitle('');
      setSomoniAmount('');
      setCategoryId(categories[0]?.id || 'other');
      setDate(getCurrentDushanbeDateString());
      setNote('');
    }
    setError('');
  }, [expenseToEdit, categories, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Лутфан номи хароҷотро ворид кунед');
      return;
    }

    const diram = somoniToDiram(somoniAmount);
    if (diram <= 0) {
      setError('Маблағ бояд аз 0 зиёд бошад');
      return;
    }

    const selectedCategory = categories.find((c) => c.id === categoryId);
    const categoryName = selectedCategory ? selectedCategory.name : 'Дигар';

    setSubmitting(true);
    try {
      if (expenseToEdit) {
        await editExpense(expenseToEdit.id, {
          title: title.trim(),
          amountInDiram: diram,
          categoryId,
          categoryName,
          date,
          note: note.trim(),
        });
      } else {
        await createExpense({
          title: title.trim(),
          amountInDiram: diram,
          categoryId,
          categoryName,
          date,
          note: note.trim(),
        });
      }
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Хатогӣ ҳангоми сабт');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl relative text-slate-100 animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-700/50"
          type="button"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl font-bold mb-4">
          {expenseToEdit ? 'Таҳрири хароҷот' : 'Хароҷоти нав'}
        </h3>

        {error && (
          <div className="p-3 mb-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Номи хароҷот *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Масалан: Хариди нон ва мева"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none text-sm text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Маблағ (бо сомонӣ, TJS) *
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                min="0.01"
                required
                value={somoniAmount}
                onChange={(e) => setSomoniAmount(e.target.value)}
                placeholder="0.00"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none text-sm text-white pr-20"
              />
              <span className="absolute right-3.5 top-2.5 text-xs font-medium text-slate-400">
                сомонӣ
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Дар пойгоҳ ба таври автоматӣ ба дирам захира мешавад (1 с. = 100 д.)
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Категория
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none text-sm text-white"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Сана (Asia/Dushanbe)
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none text-sm text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Эзоҳ (ихтиёрӣ)
            </label>
            <textarea
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Тафсилоти иловагӣ..."
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none text-sm text-white resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2 rounded-xl border border-slate-600 text-slate-300 hover:bg-slate-700 text-sm font-medium transition-colors"
            >
              Бекор кардан
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-sm font-semibold shadow-lg shadow-sky-600/30 transition-colors"
            >
              {submitting ? 'Сабт шуда истодааст...' : 'Сабт кардан'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Tags, Plus, Check } from 'lucide-react';
import { useExpenses } from '../context/ExpenseContext';
import { Category } from '../types';
import { formatMoney } from '../utils/currency';
import { getCurrentDushanbeMonthString } from '../utils/date';

export const Categories: React.FC = () => {
  const { categories, expenses, addCustomCategory } = useExpenses();

  const [isAdding, setIsAdding] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [selectedColor, setSelectedColor] = useState('#0ea5e9');

  const currentMonthStr = getCurrentDushanbeMonthString();
  const thisMonthExpenses = expenses.filter((e) => e.date.startsWith(currentMonthStr));

  const colorPalette = [
    '#0ea5e9',
    '#10b981',
    '#8b5cf6',
    '#f59e0b',
    '#ec4899',
    '#ef4444',
    '#06b6d4',
    '#84cc16',
  ];

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    const newCategory: Category = {
      id: `custom_${Date.now()}`,
      name: newCatName.trim(),
      iconName: 'Tag',
      color: selectedColor,
      isDefault: false,
    };

    addCustomCategory(newCategory);
    setNewCatName('');
    setIsAdding(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Категорияҳои хароҷот</h2>
          <p className="text-sm text-slate-400">
            Идоракунии гурӯҳҳои хароҷот барои гурӯҳбандии беҳтар
          </p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-sm shadow-lg shadow-sky-600/30 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Категорияи нав</span>
        </button>
      </div>

      {/* Add Category Form */}
      {isAdding && (
        <div className="bg-slate-800/90 border border-slate-700/80 p-5 rounded-2xl shadow-lg animate-in fade-in zoom-in-95 duration-150">
          <h3 className="font-bold text-white text-base mb-3">Иловаи категорияи нав</h3>
          <form onSubmit={handleAddCategory} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Номи категория *
              </label>
              <input
                type="text"
                required
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                placeholder="Масалан: Хариди туҳфаҳо"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 focus:border-sky-500 outline-none text-sm text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Интихоби ранг
              </label>
              <div className="flex items-center gap-2">
                {colorPalette.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setSelectedColor(c)}
                    style={{ backgroundColor: c }}
                    className="w-7 h-7 rounded-full flex items-center justify-center transition-transform hover:scale-110"
                  >
                    {selectedColor === c && <Check className="w-4 h-4 text-white" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 rounded-xl border border-slate-600 text-slate-300 hover:bg-slate-700 text-sm font-medium"
              >
                Бекор кардан
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-sm shadow-md shadow-sky-600/30"
              >
                Илова кардан
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map((cat) => {
          const catExpenses = thisMonthExpenses.filter((e) => e.categoryId === cat.id);
          const totalCatDiram = catExpenses.reduce((sum, e) => sum + e.amountInDiram, 0);

          return (
            <div
              key={cat.id}
              className="bg-slate-800/80 border border-slate-700/60 p-4 rounded-2xl shadow-sm hover:border-slate-600 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-md"
                  style={{ backgroundColor: cat.color }}
                >
                  <Tags className="w-5 h-5" />
                </div>
                {cat.isDefault && (
                  <span className="text-[10px] font-medium text-slate-400 bg-slate-700/60 px-2 py-0.5 rounded-full">
                    Асосӣ
                  </span>
                )}
              </div>

              <h4 className="font-bold text-white text-sm mb-1">{cat.name}</h4>
              <p className="text-xs text-slate-400">
                Дар ин моҳ: {catExpenses.length} сабт
              </p>
              <div className="text-sm font-semibold text-sky-400 mt-2">
                {formatMoney(totalCatDiram)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

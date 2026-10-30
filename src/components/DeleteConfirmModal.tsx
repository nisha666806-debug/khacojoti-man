import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Expense } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  expense: Expense | null;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  expense,
  onClose,
  onConfirm,
}) => {
  const { t, formatMoney } = useLanguage();
  const [deleting, setDeleting] = useState(false);

  if (!isOpen || !expense) return null;

  const handleConfirm = async () => {
    setDeleting(true);
    try {
      await onConfirm();
      onClose();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-sm p-6 shadow-2xl text-slate-100 text-center animate-in fade-in zoom-in-95 duration-150">
        <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-6 h-6" />
        </div>

        <h3 className="text-lg font-bold mb-2">{t.deleteConfirmTitle}</h3>
        <p className="text-sm text-slate-300 mb-4">
          {t.deleteConfirmQuestion}{' '}
          <strong className="text-white">"{expense.title}"</strong> —{' '}
          <strong className="text-rose-400">
            {formatMoney(expense.amountInDiram)}
          </strong>
        </p>

        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={deleting}
            className="px-4 py-2 rounded-xl border border-slate-600 text-slate-300 hover:bg-slate-700 text-sm font-medium transition-colors"
          >
            {t.cancelBtn}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={deleting}
            className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-sm font-semibold shadow-lg shadow-rose-600/30 transition-colors"
          >
            {deleting ? t.deletingExpense : t.deleteConfirmYes}
          </button>
        </div>
      </div>
    </div>
  );
};

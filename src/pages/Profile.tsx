import React from 'react';
import { LogOut, ShieldCheck, Globe, Coins, Receipt } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useExpenses } from '../context/ExpenseContext';
import { useLanguage } from '../context/LanguageContext';
import { LanguageSwitcher } from '../components/LanguageSwitcher';

export const Profile: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const { expenses } = useExpenses();
  const { t, formatMoney } = useLanguage();

  const totalAllTimeDiram = expenses.reduce((sum, e) => sum + e.amountInDiram, 0);

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">{t.profileTitle}</h2>
        <p className="text-sm text-slate-400">
          {t.profileSubtitle}
        </p>
      </div>

      {/* User Card */}
      <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-sky-500/20 text-2xl font-bold overflow-hidden">
            {currentUser?.email ? currentUser.email[0].toUpperCase() : 'U'}
          </div>

          <div className="space-y-1 text-center sm:text-left flex-1">
            <h3 className="text-lg font-bold text-white">
              {currentUser?.email || t.activeUser}
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              UID: {currentUser?.uid}
            </p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-medium border border-emerald-500/20 mt-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{t.verifiedAccount}</span>
            </div>
          </div>

          <button
            onClick={() => logout()}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-700 hover:bg-rose-600 hover:text-white text-slate-300 font-medium text-xs transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>{t.logoutBtn}</span>
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-slate-800/80 border border-slate-700/60 p-5 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase">{t.totalAllTimeExpenses}</span>
            <Coins className="w-5 h-5 text-sky-400" />
          </div>
          <div className="text-xl font-bold text-white">
            {formatMoney(totalAllTimeDiram)}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {t.sinceBeginning}
          </p>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/60 p-5 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase">{t.totalOperations}</span>
            <Receipt className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-white">
            {expenses.length} {t.paymentsCountLabel}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {t.inDatabaseHistory}
          </p>
        </div>
      </div>

      {/* System info and Language Picker */}
      <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-5 shadow-sm space-y-4">
        <h4 className="font-bold text-white text-sm">{t.regionalAndSecurityTitle}</h4>

        <div className="divide-y divide-slate-700/60 text-xs">
          {/* Language Switcher pill */}
          <div className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="text-slate-300 font-medium flex items-center gap-2">
              <Globe className="w-4 h-4 text-sky-400" />
              {t.languageSelectLabel}
            </span>
            <LanguageSwitcher variant="pill" />
          </div>

          <div className="py-2.5 flex items-center justify-between">
            <span className="text-slate-400 flex items-center gap-2">
              <Globe className="w-4 h-4 text-slate-400" />
              {t.timezoneLabel}
            </span>
            <span className="font-mono text-slate-200">Asia/Dushanbe (UTC+5)</span>
          </div>

          <div className="py-2.5 flex items-center justify-between">
            <span className="text-slate-400 flex items-center gap-2">
              <Coins className="w-4 h-4 text-slate-400" />
              {t.currencyLabel}
            </span>
            <span className="font-semibold text-slate-200">
              TJS ({t.currencyUnit} / {t.diramUnit})
            </span>
          </div>

          <div className="py-2.5 flex items-center justify-between">
            <span className="text-slate-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-slate-400" />
              {t.firestoreRulesLabel}
            </span>
            <span className="font-mono text-slate-200">users/{'{uid}'}/**</span>
          </div>
        </div>
      </div>
    </div>
  );
};

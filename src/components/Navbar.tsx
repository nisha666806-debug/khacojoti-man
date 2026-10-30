import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  History,
  PieChart,
  Wallet,
  Tags,
  User,
  CheckCircle2,
  RefreshCw,
  WifiOff,
} from 'lucide-react';
import { useExpenses } from '../context/ExpenseContext';
import { useLanguage } from '../context/LanguageContext';
import { LanguageSwitcher } from './LanguageSwitcher';

export const Navbar: React.FC = () => {
  const { syncStatus } = useExpenses();
  const { t } = useLanguage();

  const navItems = [
    { to: '/', label: t.navDashboard, icon: LayoutDashboard },
    { to: '/history', label: t.navHistory, icon: History },
    { to: '/reports', label: t.navReports, icon: PieChart },
    { to: '/budget', label: t.navBudget, icon: Wallet },
    { to: '/categories', label: t.navCategories, icon: Tags },
    { to: '/profile', label: t.navProfile, icon: User },
  ];

  return (
    <>
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-slate-800/90 backdrop-blur border-b border-slate-700/60 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img
              src="/logo.png"
              alt={t.appName}
              className="w-10 h-10 rounded-xl object-contain shadow-lg shadow-sky-500/10"
            />
            <div>
              <h1 className="font-bold text-lg text-white leading-tight">{t.appName}</h1>
              <p className="text-xs text-slate-400">{t.appSubtitle}</p>
            </div>
          </div>

          {/* Sync indicator + Language switcher + Desktop nav */}
          <div className="flex items-center gap-2.5">
            {/* Sync status */}
            <div
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                syncStatus === 'synced'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : syncStatus === 'syncing'
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
              }`}
            >
              {syncStatus === 'synced' && (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden sm:inline">{t.syncSynced}</span>
                </>
              )}
              {syncStatus === 'syncing' && (
                <>
                  <RefreshCw className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                  <span className="hidden sm:inline">{t.syncSyncing}</span>
                </>
              )}
              {syncStatus === 'offline' && (
                <>
                  <WifiOff className="w-3.5 h-3.5 text-rose-400" />
                  <span className="hidden sm:inline">{t.syncOffline}</span>
                </>
              )}
            </div>

            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* Desktop Navigation links */}
            <nav className="hidden md:flex items-center space-x-1 pl-3 border-l border-slate-700">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
                          : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-800/95 backdrop-blur border-t border-slate-700/80 px-2 py-2 flex justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center p-1.5 rounded-lg text-[10px] font-medium transition-all ${
                  isActive
                    ? 'text-sky-400 scale-105'
                    : 'text-slate-400 hover:text-slate-200'
                }`
              }
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </>
  );
};

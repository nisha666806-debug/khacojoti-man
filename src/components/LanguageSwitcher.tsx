import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Language } from '../types/i18n';

interface LanguageSwitcherProps {
  variant?: 'pill' | 'dropdown' | 'select';
  className?: string;
}

const LANGUAGES: { code: Language; label: string; flag: string }[] = [
  { code: 'tg', label: 'Тоҷикӣ', flag: '🇹🇯' },
  { code: 'ru', label: 'Русский', flag: '🇷🇺' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
];

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  variant = 'dropdown',
  className = '',
}) => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentLang = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];

  if (variant === 'pill') {
    return (
      <div className={`flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-700/80 ${className}`}>
        {LANGUAGES.map((l) => (
          <button
            key={l.code}
            type="button"
            onClick={() => setLanguage(l.code)}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
              language === l.code
                ? 'bg-sky-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>{l.flag}</span>
            <span>{l.label}</span>
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 hover:bg-slate-700/80 hover:text-white text-xs font-medium transition-all"
        title="Интихоби забон / Выбор языка / Select Language"
      >
        <Globe className="w-3.5 h-3.5 text-sky-400" />
        <span className="text-xs">{currentLang.flag} {currentLang.code.toUpperCase()}</span>
        <ChevronDown className="w-3 h-3 text-slate-400 ml-0.5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-36 rounded-xl bg-slate-800 border border-slate-700 shadow-2xl py-1 z-50 animate-in fade-in zoom-in-95 duration-100">
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              type="button"
              onClick={() => {
                setLanguage(l.code);
                setIsOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium transition-colors ${
                language === l.code
                  ? 'bg-sky-600/20 text-sky-400'
                  : 'text-slate-300 hover:bg-slate-700/60 hover:text-white'
              }`}
            >
              <span className="flex items-center gap-2">
                <span>{l.flag}</span>
                <span>{l.label}</span>
              </span>
              {language === l.code && <Check className="w-3.5 h-3.5 text-sky-400" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

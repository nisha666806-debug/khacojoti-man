import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, TranslationDictionary } from '../types/i18n';
import { translations, DEFAULT_CATEGORY_NAMES } from '../i18n/translations';
import { formatMoney as formatMoneyUtil } from '../utils/currency';
import { formatDushanbeDate as formatDateUtil, formatDushanbeMonth as formatMonthUtil } from '../utils/date';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationDictionary;
  formatMoney: (diram: number) => string;
  formatDate: (date: string | number | Date) => string;
  formatMonth: (monthStr: string) => string;
  getLocalizedCategoryName: (categoryId: string, fallbackName: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('khacojoti_lang') as Language;
    return saved && (saved === 'tg' || saved === 'ru' || saved === 'en') ? saved : 'tg';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('khacojoti_lang', lang);
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const t = translations[language];

  const formatMoney = (diram: number) => formatMoneyUtil(diram, language);
  const formatDate = (date: string | number | Date) => formatDateUtil(date, language);
  const formatMonth = (monthStr: string) => formatMonthUtil(monthStr, language);

  const getLocalizedCategoryName = (categoryId: string, fallbackName: string): string => {
    const def = DEFAULT_CATEGORY_NAMES[categoryId];
    if (def && def[language]) {
      return def[language];
    }
    return fallbackName;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        formatMoney,
        formatDate,
        formatMonth,
        getLocalizedCategoryName,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Expense, Category, Budget, SyncStatus } from '../types';
import {
  subscribeExpenses,
  addExpense,
  updateExpense,
  deleteExpense,
} from '../services/expenseService';
import { subscribeBudget, saveBudget } from '../services/budgetService';
import { DEFAULT_CATEGORIES } from '../services/categoryService';
import { getCurrentDushanbeMonthString } from '../utils/date';
import { useAuth } from './AuthContext';

interface ExpenseContextType {
  expenses: Expense[];
  categories: Category[];
  budget: Budget | null;
  syncStatus: SyncStatus;
  currentMonth: string;
  createExpense: (expense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  editExpense: (id: string, expense: Partial<Omit<Expense, 'id' | 'createdAt'>>) => Promise<void>;
  removeExpense: (id: string) => Promise<void>;
  updateBudget: (amountInDiram: number) => Promise<void>;
  addCustomCategory: (cat: Category) => void;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export const ExpenseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('khacojoti_categories');
    return saved ? JSON.parse(saved) : DEFAULT_CATEGORIES;
  });
  const [budget, setBudget] = useState<Budget | null>(null);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('synced');
  const [currentMonth] = useState(getCurrentDushanbeMonthString());

  // Listen to network status changes
  useEffect(() => {
    const handleOnline = () => {
      setSyncStatus('syncing');
      setTimeout(() => setSyncStatus('synced'), 1500);
    };
    const handleOffline = () => {
      setSyncStatus('offline');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Subscribe to expenses and budget when user is logged in
  useEffect(() => {
    if (!currentUser) {
      setExpenses([]);
      setBudget(null);
      return;
    }

    const unsubExpenses = subscribeExpenses(currentUser.uid, (data, status) => {
      setExpenses(data);
      setSyncStatus(status);
    });

    const unsubBudget = subscribeBudget(currentUser.uid, currentMonth, (b) => {
      setBudget(b);
    });

    return () => {
      unsubExpenses();
      unsubBudget();
    };
  }, [currentUser, currentMonth]);

  const createExpense = async (
    expenseData: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<string> => {
    if (!currentUser) throw new Error('Корбар ворид нашудааст');
    return await addExpense(currentUser.uid, expenseData);
  };

  const editExpense = async (
    id: string,
    expenseData: Partial<Omit<Expense, 'id' | 'createdAt'>>
  ): Promise<void> => {
    if (!currentUser) throw new Error('Корбар ворид нашудааст');
    await updateExpense(currentUser.uid, id, expenseData);
  };

  const removeExpense = async (id: string): Promise<void> => {
    if (!currentUser) throw new Error('Корбар ворид нашудааст');
    await deleteExpense(currentUser.uid, id);
  };

  const updateBudget = async (amountInDiram: number): Promise<void> => {
    if (!currentUser) throw new Error('Корбар ворид нашудааст');
    await saveBudget(currentUser.uid, currentMonth, amountInDiram);
  };

  const addCustomCategory = (cat: Category) => {
    const updated = [...categories, cat];
    setCategories(updated);
    localStorage.setItem('khacojoti_categories', JSON.stringify(updated));
  };

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        categories,
        budget,
        syncStatus,
        currentMonth,
        createExpense,
        editExpense,
        removeExpense,
        updateBudget,
        addCustomCategory,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpenses = () => {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error('useExpenses must be used within an ExpenseProvider');
  }
  return context;
};

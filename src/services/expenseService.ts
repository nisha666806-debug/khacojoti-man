import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  Unsubscribe,
} from 'firebase/firestore';
import { db } from './firebase';
import { Expense, SyncStatus } from '../types';

export function subscribeExpenses(
  uid: string,
  onData: (expenses: Expense[], syncStatus: SyncStatus) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const expensesRef = collection(db, 'users', uid, 'expenses');
  const q = query(expensesRef, orderBy('createdAt', 'desc'));

  return onSnapshot(
    q,
    { includeMetadataChanges: true },
    (snapshot) => {
      const expenses: Expense[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        expenses.push({
          id: docSnap.id,
          title: data.title || '',
          amountInDiram: data.amountInDiram || 0,
          categoryId: data.categoryId || 'other',
          categoryName: data.categoryName || 'Дигар',
          date: data.date || '',
          note: data.note || '',
          createdAt: data.createdAt || 0,
          updatedAt: data.updatedAt || 0,
        });
      });

      // Sort by date descending, then createdAt descending
      expenses.sort((a, b) => {
        if (b.date !== a.date) {
          return b.date.localeCompare(a.date);
        }
        return b.createdAt - a.createdAt;
      });

      const isOffline = typeof navigator !== 'undefined' && !navigator.onLine;
      const status: SyncStatus = isOffline
        ? 'offline'
        : snapshot.metadata.hasPendingWrites
        ? 'syncing'
        : 'synced';

      onData(expenses, status);
    },
    (error) => {
      if (onError) onError(error);
    }
  );
}

export async function addExpense(
  uid: string,
  expense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  const expensesRef = collection(db, 'users', uid, 'expenses');
  const newDocRef = doc(expensesRef);
  const now = Date.now();

  const data: Expense = {
    ...expense,
    id: newDocRef.id,
    createdAt: now,
    updatedAt: now,
  };

  await setDoc(newDocRef, data);
  return newDocRef.id;
}

export async function updateExpense(
  uid: string,
  id: string,
  expense: Partial<Omit<Expense, 'id' | 'createdAt'>>
): Promise<void> {
  const docRef = doc(db, 'users', uid, 'expenses', id);
  await setDoc(
    docRef,
    {
      ...expense,
      updatedAt: Date.now(),
    },
    { merge: true }
  );
}

export async function deleteExpense(uid: string, id: string): Promise<void> {
  const docRef = doc(db, 'users', uid, 'expenses', id);
  await deleteDoc(docRef);
}

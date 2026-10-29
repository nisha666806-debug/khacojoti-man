import { doc, getDoc, setDoc, onSnapshot, Unsubscribe } from 'firebase/firestore';
import { db } from './firebase';
import { Budget } from '../types';

export async function getBudget(uid: string, month: string): Promise<Budget | null> {
  const docRef = doc(db, 'users', uid, 'budgets', month);
  const snap = await getDoc(docRef);
  if (!snap.exists()) return null;
  const data = snap.data();
  return {
    month,
    amountInDiram: data.amountInDiram || 0,
    updatedAt: data.updatedAt || 0,
  };
}

export function subscribeBudget(
  uid: string,
  month: string,
  onData: (budget: Budget | null) => void
): Unsubscribe {
  const docRef = doc(db, 'users', uid, 'budgets', month);
  return onSnapshot(docRef, (snap) => {
    if (!snap.exists()) {
      onData(null);
      return;
    }
    const data = snap.data();
    onData({
      month,
      amountInDiram: data.amountInDiram || 0,
      updatedAt: data.updatedAt || 0,
    });
  });
}

export async function saveBudget(
  uid: string,
  month: string,
  amountInDiram: number
): Promise<void> {
  const docRef = doc(db, 'users', uid, 'budgets', month);
  await setDoc(docRef, {
    month,
    amountInDiram,
    updatedAt: Date.now(),
  });
}

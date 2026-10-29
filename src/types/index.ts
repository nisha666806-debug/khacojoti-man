export interface Expense {
  id: string;
  title: string;
  amountInDiram: number; // Stored as integer diram (1 somoni = 100 diram)
  categoryId: string;
  categoryName: string;
  date: string; // ISO string in Asia/Dushanbe or YYYY-MM-DD
  note?: string;
  createdAt: number;
  updatedAt: number;
}

export interface Category {
  id: string;
  name: string;
  iconName: string;
  color: string;
  isDefault?: boolean;
}

export interface Budget {
  month: string; // YYYY-MM
  amountInDiram: number; // Budget limit in diram
  updatedAt: number;
}

export type SyncStatus = 'synced' | 'syncing' | 'offline';

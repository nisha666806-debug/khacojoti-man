import { Category } from '../types';

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'food', name: 'Хӯрокворӣ', iconName: 'Utensils', color: '#10b981', isDefault: true },
  { id: 'transport', name: 'Нақлиёт', iconName: 'Car', color: '#3b82f6', isDefault: true },
  { id: 'housing', name: 'Манзил ва коммуналӣ', iconName: 'Home', color: '#8b5cf6', isDefault: true },
  { id: 'health', name: 'Саломатӣ ва доруворӣ', iconName: 'HeartPulse', color: '#ef4444', isDefault: true },
  { id: 'education', name: 'Таҳсил ва китоб', iconName: 'GraduationCap', color: '#f59e0b', isDefault: true },
  { id: 'entertainment', name: 'Вақтхушӣ ва истироҳат', iconName: 'Gamepad2', color: '#ec4899', isDefault: true },
  { id: 'clothing', name: 'Либос ва пойафзол', iconName: 'Shirt', color: '#06b6d4', isDefault: true },
  { id: 'other', name: 'Дигар хароҷотҳо', iconName: 'MoreHorizontal', color: '#64748b', isDefault: true },
];

export function getCategoryById(categories: Category[], id: string): Category {
  const found = categories.find((c) => c.id === id);
  if (found) return found;
  return {
    id,
    name: 'Дигар',
    iconName: 'MoreHorizontal',
    color: '#64748b',
  };
}

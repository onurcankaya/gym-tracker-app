import { format } from 'date-fns';

export function formatFullDate(date?: Date): string | null {
  if (!date) return null;
  return format(date, 'MMMM d, y');
}

export function formatDateForDb(date?: Date): string | null {
  if (!date) return null;
  return format(date, 'yyyy-MM-dd');
}

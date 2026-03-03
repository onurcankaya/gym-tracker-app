import { format } from 'date-fns';

export function formatDateForDb(date?: Date): string | null {
  if (!date) return null;
  return format(date, 'yyyy-MM-dd');
}

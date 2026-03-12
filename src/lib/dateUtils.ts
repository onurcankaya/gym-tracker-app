import { format } from 'date-fns';

export function formatFullDate(date?: Date): string | null {
  if (!date) return null;
  return format(date, 'MMMM d, y');
}

export function formatDateForDb(date?: Date): string | null {
  if (!date) return null;
  return format(date, 'yyyy-MM-dd');
}

export function formatMinutesToHours(minutes: number | string) {
  if (typeof minutes === 'string') {
    return `${Math.floor(parseInt(minutes) / 60)}h ${parseInt(minutes) % 60}m`;
  }
  return `${minutes / 60}h ${minutes % 60}m`;
}

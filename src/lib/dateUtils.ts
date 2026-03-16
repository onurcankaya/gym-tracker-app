import { format } from 'date-fns';

export function formatDate(date: Date, dateFormat: string): string | null {
  if (!date || !format) return null;
  return format(date, dateFormat);
}

export function formatFullDate(date?: Date): string | null {
  if (!date) return null;
  return format(date, 'MMMM d, y');
}

export function formatMinutesToHours(minutes: number | string) {
  if (typeof minutes === 'string') {
    return `${Math.floor(parseInt(minutes) / 60)}h ${parseInt(minutes) % 60}m`;
  }
  return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
}

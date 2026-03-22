import { format } from 'date-fns';

export const DATE_FORMAT = {
  FULL: 'd MMMM y',
  DATE_STRING: 'yyyy-MM-dd',
};

export function formatDate(date: Date, dateFormat: string): string | null {
  if (!date || !format) return null;
  return format(date, dateFormat);
}

export function formatFullDate(date?: Date): string | null {
  if (!date) return null;
  return format(date, DATE_FORMAT.FULL);
}

export function formatMinutesToHours(minutes: number | string) {
  if (typeof minutes === 'string') {
    return `${Math.floor(parseInt(minutes) / 60)}h ${parseInt(minutes) % 60}m`;
  }
  return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
}

export function isDateInRange(date: string, range: { from?: Date; to?: Date }) {
  if (!range.from || !range.to) return true;
  const fromStr = format(range.from, DATE_FORMAT.DATE_STRING);
  const toStr = format(range.to, DATE_FORMAT.DATE_STRING);
  return date >= fromStr && date <= toStr;
}

const today = new Date();

const sevenDaysAgo = new Date(today);
sevenDaysAgo.setDate(today.getDate() - 7);

const fourWeeksAgo = new Date(today);
fourWeeksAgo.setDate(today.getDate() - 28);

const oneYearAgo = new Date(today);
oneYearAgo.setDate(today.getDate() - 365);

export { today, sevenDaysAgo, fourWeeksAgo, oneYearAgo };

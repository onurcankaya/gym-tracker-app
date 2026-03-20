import { format } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { DATE_FORMAT } from '@/lib/dateUtils';
import { Workout } from '@/api/types';

export function sortByWorkoutDate(data: Workout[], sortOrder: 'asc' | 'desc') {
  if (sortOrder === 'asc') {
    return data.sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
    );
  } else if (sortOrder === 'desc') {
    return data.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );
  }

  return data;
}

export function filterWorkoutsByDateRange(
  data: Workout[],
  dateRange?: DateRange,
) {
  return data.filter((item) => {
    if (!dateRange?.from || !dateRange?.to) return true;

    const workoutDate = format(item.created_at, DATE_FORMAT.DATE_STRING);
    const fromDate = format(dateRange?.from!, DATE_FORMAT.DATE_STRING);
    const toDate = format(dateRange?.to!, DATE_FORMAT.DATE_STRING);

    return workoutDate >= fromDate && workoutDate <= toDate;
  });
}

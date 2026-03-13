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

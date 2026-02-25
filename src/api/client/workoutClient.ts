import { CreateWorkoutDTO, Workout } from '@/api/types/workout';

const BASE_URL = '/api';
const WORKOUTS_URL = `${BASE_URL}/workouts`;

export const workoutClient = {
  getAll: async (): Promise<Workout[]> => {
    const response = await fetch(WORKOUTS_URL);

    if (!response.ok) throw new Error('Failed to fetch workouts');

    return response.json();
  },

  create: async (data: CreateWorkoutDTO): Promise<Workout> => {
    const response = await fetch(WORKOUTS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error('Failed to create workout');

    return response.json();
  },

  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${WORKOUTS_URL}/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) throw new Error('Failed to delete workout');

    return response.json();
  },
};

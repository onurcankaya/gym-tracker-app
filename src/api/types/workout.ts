export type Workout = {
  id: number;
  type: string;
  duration_minutes: number;
  notes: string | null;
  created_at: Date;
};

export type CreateWorkoutDTO = {
  type: string;
  duration_minutes: number;
  notes?: string;
};

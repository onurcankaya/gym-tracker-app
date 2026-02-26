export type Workout = {
  id: string;
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

export type UpdateWorkoutDTO = {
  type?: string;
  duration_minutes?: number;
  notes?: string;
  created_at?: Date;
};

export enum MuscleGroup {
  CHEST = 'chest',
  BACK = 'back',
  SHOULDERS = 'shoulders',
  BICEPS = 'biceps',
  TRICEPS = 'triceps',
  LEGS = 'legs',
}

export type WeightTraining = {
  id: string;
  muscle_groups: MuscleGroup[];
  duration_minutes: number;
  notes: string | null;
  created_at: Date;
};

export type CreateWeightTrainingDTO = {
  muscle_groups: MuscleGroup[];
  duration_minutes: number;
  notes?: string | null;
  created_at?: string;
};

export type UpdateWeightTrainingDTO = {
  muscle_groups?: MuscleGroup[];
  duration_minutes?: number;
  notes?: string | null;
  created_at?: string;
};

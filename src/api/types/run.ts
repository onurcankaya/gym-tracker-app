export enum DistanceUnit {
  KM = 'km',
  MI = 'mi',
}

export type Run = {
  id: string;
  distance: number;
  distance_unit: DistanceUnit;
  duration_minutes: number;
  notes: string | null;
  created_at: string;
};

export type CreateRunDTO = {
  distance: number;
  distance_unit: DistanceUnit;
  duration_minutes: number;
  notes?: string | null;
  created_at?: string;
};

export type UpdateRunDTO = {
  distance?: number;
  distance_unit?: DistanceUnit;
  duration_minutes?: number;
  notes?: string | null;
  created_at?: string;
};

export type RunStats = {
  total_runs: string;
  total_distance: string;
  total_time: string;
  avg_distance: string;
  avg_duration: string;
};

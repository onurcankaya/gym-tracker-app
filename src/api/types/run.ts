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
  created_at: Date;
};

export type CreateRunDTO = {
  distance: number;
  distance_unit: DistanceUnit;
  duration_minutes: number;
  notes?: string | null;
  created_at?: Date;
};

export type UpdateRunDTO = {
  distance?: number;
  distance_unit?: DistanceUnit;
  duration_minutes?: number;
  notes?: string | null;
  created_at?: Date;
};

import pool from '@/lib/db';
import { Workout, CreateWorkoutDTO } from '@/api/types/workout';

export class WorkoutModel {
  static async findAll(): Promise<Workout[]> {
    const result = await pool.query(
      'SELECT * FROM workouts ORDER BY created_at DESC',
    );

    return result.rows;
  }

  static async create(data: CreateWorkoutDTO): Promise<Workout> {
    const result = await pool.query(
      'INSERT INTO workouts (type, duration_minutes, notes) VALUES ($1, $2, $3) RETURNING *',
      [data.type, data.duration_minutes, data.notes || null],
    );

    return result.rows[0];
  }
}

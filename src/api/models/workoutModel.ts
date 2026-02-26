import pool from '@/lib/db';
import {
  Workout,
  CreateWorkoutDTO,
  UpdateWorkoutDTO,
} from '@/api/types/workout';

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

  static async delete(id: string): Promise<void> {
    await pool.query('DELETE FROM workouts WHERE id = $1', [id]);
  }

  static async update(id: string, data: UpdateWorkoutDTO): Promise<Workout> {
    const fields = [];
    const values = [];
    let paramIndex = 1;

    if (data.type !== undefined) {
      fields.push(`type = $${paramIndex}`);
      values.push(data.type);
      paramIndex++;
    }

    if (data.duration_minutes !== undefined) {
      fields.push(`duration_minutes = $${paramIndex}`);
      values.push(data.duration_minutes);
      paramIndex++;
    }

    if (data.notes !== undefined) {
      fields.push(`notes = $${paramIndex}`);
      values.push(data.notes);
      paramIndex++;
    }

    if (data.created_at !== undefined) {
      fields.push(`created_at = $${paramIndex}`);
      values.push(this.formatDate(data.created_at));
      paramIndex++;
    }

    if (fields.length === 0) {
      throw new Error('No fields to update');
    }

    values.push(id);

    const query = `UPDATE workouts SET ${fields.join(', ')} WHERE id = $${paramIndex} RETURNING *`;

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      throw new Error('Workout not found');
    }

    return result.rows[0];
  }

  private static formatDate(date?: Date): string | null {
    if (!date) return null;

    const d = new Date(date);
    return d.toISOString().split('T')[0];
  }
}

import pool from '@/lib/db';
import { formatDateForDb } from '@/lib/dateUtils';
import {
  WeightTraining,
  CreateWeightTrainingDTO,
  UpdateWeightTrainingDTO,
} from '@/api/types/weightTraining';

export class WeightTrainingModel {
  static async findAll(): Promise<WeightTraining[]> {
    const result = await pool.query(
      'SELECT * FROM weight_trainings ORDER BY created_at DESC',
    );

    return result.rows;
  }

  static async create(data: CreateWeightTrainingDTO): Promise<WeightTraining> {
    const result = await pool.query(
      'INSERT INTO weight_trainings (muscle_group, duration_minutes, notes, created_at) VALUES ($1, $2, $3, $4) RETURNING *',
      [
        data.muscle_groups,
        data.duration_minutes,
        data.notes || null,
        data.created_at,
      ],
    );

    return result.rows[0];
  }

  static async delete(id: string): Promise<void> {
    await pool.query('DELETE FROM weight_trainings WHERE id = $1', [id]);
  }

  static async update(
    id: string,
    data: UpdateWeightTrainingDTO,
  ): Promise<WeightTraining> {
    const fields = [];
    const values = [];
    let paramIndex = 1;

    if (data.muscle_groups !== undefined) {
      fields.push(`muscle_groups = $${paramIndex}`);
      values.push(data.muscle_groups);
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
      values.push(formatDateForDb(data.created_at));
      paramIndex++;
    }

    if (fields.length === 0) {
      throw new Error('No fields to update');
    }

    values.push(id);

    const query = `UPDATE weight_trainings SET ${fields.join(', ')} WHERE id = $${paramIndex} RETURNING *`;

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      throw new Error('Weight training not found');
    }

    return result.rows[0];
  }
}

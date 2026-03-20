import pool from '@/lib/db';
import {
  WeightTraining,
  CreateWeightTrainingDTO,
  UpdateWeightTrainingDTO,
  WeightTrainingStats,
} from '@/api/types/weightTraining';
import { DateRange } from '@/api/types/dateRange';
export class WeightTrainingModel {
  static async findAll(userId: string): Promise<WeightTraining[]> {
    const result = await pool.query(
      'SELECT * FROM weight_trainings WHERE user_id = $1 ORDER BY created_at DESC',
      [userId],
    );

    return result.rows;
  }

  static async create(
    userId: string,
    data: CreateWeightTrainingDTO,
  ): Promise<WeightTraining> {
    const result = await pool.query(
      'INSERT INTO weight_trainings (muscle_groups, duration_minutes, notes, created_at, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [
        data.muscle_groups,
        data.duration_minutes,
        data.notes || null,
        data.created_at,
        userId,
      ],
    );

    return result.rows[0];
  }

  static async delete(userId: string, weightTrainingId: string): Promise<void> {
    await pool.query(
      'DELETE FROM weight_trainings WHERE user_id = $1 AND id = $2',
      [userId, weightTrainingId],
    );
  }

  static async update(
    userId: string,
    weightTrainingId: string,
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
      values.push(data.created_at);
      paramIndex++;
    }

    if (fields.length === 0) {
      throw new Error('No fields to update');
    }

    values.push(weightTrainingId);
    values.push(userId);

    const query = `UPDATE weight_trainings SET ${fields.join(', ')} WHERE id = $${paramIndex} AND user_id = $${paramIndex + 1} RETURNING *`;

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      throw new Error('Weight training not found or unauthorized');
    }

    return result.rows[0];
  }

  static async getStats(
    userId: string,
    dateRange: DateRange,
  ): Promise<WeightTrainingStats> {
    let query = `SELECT
        COUNT(*) as total_workouts,
        COALESCE(SUM(duration_minutes), 0) as total_time,
        COALESCE(AVG(duration_minutes), 0) as avg_duration
        FROM weight_trainings
        WHERE user_id = $1
      `;

    const params = [userId];

    if (dateRange.from && dateRange.to) {
      query += ` AND created_at >= $2 AND created_at <= $3`;
      params.push(dateRange.from, dateRange.to);
    }

    const result = await pool.query(query, params);

    return result.rows[0];
  }
}

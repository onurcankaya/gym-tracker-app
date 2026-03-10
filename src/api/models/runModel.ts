import pool from '@/lib/db';
import { formatDateForDb } from '@/lib/dateUtils';
import { Run, CreateRunDTO, UpdateRunDTO } from '@/api/types/run';

export class RunModel {
  static async findAll(userId: string): Promise<Run[]> {
    const result = await pool.query(
      'SELECT * FROM runs WHERE user_id = $1 ORDER BY created_at DESC',
      [userId],
    );

    return result.rows;
  }

  static async create(userId: string, data: CreateRunDTO): Promise<Run> {
    const result = await pool.query(
      'INSERT INTO runs (distance, distance_unit, duration_minutes, notes, created_at, user_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [
        data.distance,
        data.distance_unit,
        data.duration_minutes,
        data.notes || null,
        data.created_at,
        userId,
      ],
    );

    return result.rows[0];
  }

  static async delete(userId: string, runId: string): Promise<void> {
    await pool.query('DELETE FROM runs WHERE user_id = $1 AND id = $2', [
      userId,
      runId,
    ]);
  }

  static async update(
    userId: string,
    runId: string,
    data: UpdateRunDTO,
  ): Promise<Run> {
    const fields = [];
    const values = [];
    let paramIndex = 1;

    if (data.distance !== undefined) {
      fields.push(`distance = $${paramIndex}`);
      values.push(data.distance);
      paramIndex++;
    }

    if (data.distance_unit !== undefined) {
      fields.push(`distance_unit = $${paramIndex}`);
      values.push(data.distance_unit);
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

    values.push(runId);
    values.push(userId);

    const query = `UPDATE runs SET ${fields.join(', ')} WHERE id = $${paramIndex} AND user_id = $${paramIndex + 1} RETURNING *`;

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      throw new Error('Run not found or unauthorized');
    }

    return result.rows[0];
  }
}

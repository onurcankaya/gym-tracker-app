import pool from '@/lib/db';
import { formatDateForDb } from '@/lib/dateUtils';
import { Run, CreateRunDTO, UpdateRunDTO } from '@/api/types/run';

export class RunModel {
  static async findAll(): Promise<Run[]> {
    const result = await pool.query(
      'SELECT * FROM runs ORDER BY created_at DESC',
    );

    return result.rows;
  }

  static async create(data: CreateRunDTO): Promise<Run> {
    const result = await pool.query(
      'INSERT INTO runs (distance, distance_unit, duration_minutes, notes, created_at) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [
        data.distance,
        data.distance_unit,
        data.duration_minutes,
        data.notes || null,
        data.created_at,
      ],
    );

    return result.rows[0];
  }

  static async delete(id: string): Promise<void> {
    await pool.query('DELETE FROM runs WHERE id = $1', [id]);
  }

  static async update(id: string, data: UpdateRunDTO): Promise<Run> {
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

    values.push(id);

    const query = `UPDATE runs SET ${fields.join(', ')} WHERE id = $${paramIndex} RETURNING *`;

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      throw new Error('Run not found');
    }

    return result.rows[0];
  }
}

import pool from '@/lib/db';
import { User, UpdateUserDTO } from '@/api/types/user';

export class UserModel {
  static async findById(id: string): Promise<User> {
    const result = await pool.query(
      'SELECT id, email, name FROM users WHERE id = $1',
      [id],
    );

    return result.rows[0];
  }

  static async findByEmail(email: string): Promise<User['id']> {
    const result = await pool.query('SELECT id FROM users WHERE email = $1', [
      email,
    ]);

    return result.rows[0]?.id;
  }

  static async update(id: string, data: UpdateUserDTO): Promise<User> {
    const fields = [];
    const values = [];
    let paramIndex = 1;

    if (data.name !== undefined) {
      fields.push(`name = $${paramIndex}`);
      values.push(data.name);
      paramIndex++;
    }

    if (data.email !== undefined) {
      fields.push(`email = $${paramIndex}`);
      values.push(data.email);
      paramIndex++;
    }

    if (fields.length === 0) {
      throw new Error('No fields to update');
    }

    values.push(id);

    const query = `UPDATE users SET ${fields.join(', ')} WHERE id = $${paramIndex} RETURNING id, email, name, created_at`;

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      throw new Error('User not found');
    }

    return result.rows[0];
  }
}

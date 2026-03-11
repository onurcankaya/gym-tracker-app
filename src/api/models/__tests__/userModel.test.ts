import { describe, it, expect, beforeEach, vi } from 'vitest';
import { UserModel } from '@/api/models/userModel';
import pool from '@/lib/db';

vi.mock('@/lib/db', () => ({
  default: {
    query: vi.fn(),
  },
}));

describe('UserModel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('find', () => {
    it('should fetch a user', async () => {
      const mockUser = { id: 'user-1', email: 'test@test.com', name: 'User' };

      vi.mocked(pool.query).mockResolvedValueOnce({ rows: [mockUser] } as any);

      const result = await UserModel.find('user-1');

      expect(pool.query).toHaveBeenCalledWith(
        'SELECT id, email, name FROM users WHERE id = $1',
        ['user-1'],
      );

      expect(result).toEqual(mockUser);
    });
  });

  describe('update', () => {
    it('should update a user with partial data', async () => {
      const mockUpdatedUser = {
        id: 'user-1',
        email: 'test@test.com',
        name: 'User',
      };

      vi.mocked(pool.query).mockResolvedValueOnce({
        rows: [mockUpdatedUser],
      } as any);

      const result = await UserModel.update('user-1', {
        name: 'User',
        email: 'test@test.com',
      });

      expect(result).toEqual(mockUpdatedUser);
      expect(pool.query).toHaveBeenCalledWith(
        'UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING id, email, name, created_at',
        ['User', 'test@test.com', 'user-1'],
      );
    });

    it('should throw error when no fields to update', async () => {
      await expect(UserModel.update('user-1', {})).rejects.toThrow(
        'No fields to update',
      );
    });

    it('should throw error when user not found', async () => {
      vi.mocked(pool.query).mockResolvedValueOnce({ rows: [] } as any);

      await expect(
        UserModel.update('user-1', { name: 'User' }),
      ).rejects.toThrow('User not found');
    });

    it('should only update fields that are provided', async () => {
      const mockUser = [{ id: 'user-1', email: 'test@test.com', name: 'User' }];

      vi.mocked(pool.query).mockResolvedValueOnce({ rows: [mockUser] } as any);

      await UserModel.update('user-1', {
        name: 'User',
        email: 'test@test.com',
      });

      const queryCall = vi.mocked(pool.query).mock.calls[0];
      expect(queryCall[0]).toContain('name = $1');
      expect(queryCall[0]).toContain('email = $2');
      expect(queryCall[0]).not.toContain('password');
    });
  });
});

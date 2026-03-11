import { describe, it, expect, beforeEach, vi } from 'vitest';
import { UserService } from '@/api/services/userService';
import { UserModel } from '@/api/models/userModel';

vi.mock('@/api/models/userModel');

describe('UserService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getUser', () => {
    it('should return a user', async () => {
      const mockUser = { id: 'user-1', email: 'test@test.com', name: 'User' };

      vi.mocked(UserModel.find).mockResolvedValueOnce(mockUser as any);

      const result = await UserService.getUser('user-1');

      expect(UserModel.find).toHaveBeenCalledWith('user-1');
      expect(result).toEqual(mockUser);
    });
  });

  describe('updateUser', () => {
    it('should update a user with valid data', async () => {
      const mockUpdatedUser = {
        id: 'user-1',
        email: 'test@test.com',
        name: 'User',
      };

      vi.mocked(UserModel.update).mockResolvedValueOnce(mockUpdatedUser as any);

      const result = await UserService.updateUser('user-1', {
        name: 'User',
      });

      expect(result).toEqual(mockUpdatedUser);
      expect(UserModel.update).toHaveBeenCalledWith('user-1', {
        name: 'User',
      });
    });

    it('should throw error for invalid user id', async () => {
      await expect(
        UserService.updateUser('', { email: 'test@test.com' }),
      ).rejects.toThrow('Invalid user id');
    });

    it('should throw error for invalid name', async () => {
      await expect(
        UserService.updateUser('user-1', {
          name: '',
        }),
      ).rejects.toThrow('Invalid name');
    });

    it('should throw error for invalid email format', async () => {
      await expect(
        UserService.updateUser('user-1', { email: 'not-an-email' }),
      ).rejects.toThrow('Invalid email format');
    });
  });
});

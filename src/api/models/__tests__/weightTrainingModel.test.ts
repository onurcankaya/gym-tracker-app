import { describe, it, expect, beforeEach, vi } from 'vitest';
import { WeightTrainingModel } from '@/api/models/weightTrainingModel';
import pool from '@/lib/db';
import { MuscleGroup } from '@/api/types/weightTraining';

vi.mock('@/lib/db', () => ({
  default: {
    query: vi.fn(),
  },
}));

describe('WeightTrainingModel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('findAll', () => {
    it('should fetch all weight trainings for a user', async () => {
      const mockMuscleGroups = ['chest', 'triceps'] as MuscleGroup[];

      const mockWeightTrainings = [
        { id: '1', muscle_groups: mockMuscleGroups, user_id: 'user-1' },
        { id: '2', muscle_groups: mockMuscleGroups, user_id: 'user-2' },
      ];

      vi.mocked(pool.query).mockResolvedValueOnce({
        rows: mockWeightTrainings,
      } as any);

      const result = await WeightTrainingModel.findAll('user-1');

      expect(pool.query).toHaveBeenCalledWith(
        'SELECT * FROM weight_trainings WHERE user_id = $1 ORDER BY created_at DESC',
        ['user-1'],
      );

      expect(result).toEqual(mockWeightTrainings);
    });
  });

  describe('create', () => {
    it('should create a new weight training', async () => {
      const mockMuscleGroups = ['chest', 'triceps'] as MuscleGroup[];

      const mockWeightTraining = {
        id: '1',
        muscle_groups: mockMuscleGroups,
        duration_minutes: 25,
        user_id: 'user-1',
      };

      vi.mocked(pool.query).mockResolvedValueOnce({
        rows: [mockWeightTraining],
      } as any);

      const result = await WeightTrainingModel.create('user-1', {
        muscle_groups: mockMuscleGroups,
        duration_minutes: 25,
        notes: null,
        created_at: new Date(),
      });

      expect(result).toEqual(mockWeightTraining);
      expect(pool.query).toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should delete a weight training for the correct user', async () => {
      vi.mocked(pool.query).mockResolvedValueOnce({ rows: [] } as any);

      await WeightTrainingModel.delete('user-1', 'weight-training-1');

      expect(pool.query).toHaveBeenCalledWith(
        'DELETE FROM weight_trainings WHERE user_id = $1 AND id = $2',
        ['user-1', 'weight-training-1'],
      );
    });
  });

  describe('update', () => {
    it('should update a weight training with partial data', async () => {
      const mockMuscleGroups = ['chest', 'triceps'] as MuscleGroup[];

      const mockUpdatedWeightTraining = {
        id: 'weight-training-1',
        muscle_groups: mockMuscleGroups,
        duration_minutes: 45,
        user_id: 'user-1',
      };

      vi.mocked(pool.query).mockResolvedValueOnce({
        rows: [mockUpdatedWeightTraining],
      } as any);

      const result = await WeightTrainingModel.update(
        'user-1',
        'weight-training-1',
        {
          muscle_groups: mockMuscleGroups,
        },
      );

      expect(result).toEqual(mockUpdatedWeightTraining);
      expect(pool.query).toHaveBeenCalledWith(
        'UPDATE weight_trainings SET muscle_groups = $1 WHERE id = $2 AND user_id = $3 RETURNING *',
        [mockMuscleGroups, 'weight-training-1', 'user-1'],
      );
    });

    it('should throw error when no fields to update', async () => {
      await expect(
        WeightTrainingModel.update('user-1', 'weight-training-1', {}),
      ).rejects.toThrow('No fields to update');
    });

    it('should throw error when weight training not found', async () => {
      vi.mocked(pool.query).mockResolvedValueOnce({ rows: [] } as any);

      const mockMuscleGroups = ['chest', 'triceps'] as MuscleGroup[];

      await expect(
        WeightTrainingModel.update('user-1', 'weight-training-1', {
          muscle_groups: mockMuscleGroups,
        }),
      ).rejects.toThrow('Weight training not found or unauthorized');
    });

    it('should only update fields that are provided', async () => {
      const mockMuscleGroups = ['chest', 'triceps'] as MuscleGroup[];

      const mockWeightTraining = {
        id: 'weight-training-1',
        muscle_groups: mockMuscleGroups,
        duration_minutes: 30,
      };

      vi.mocked(pool.query).mockResolvedValueOnce({
        rows: [mockWeightTraining],
      } as any);

      await WeightTrainingModel.update('user-1', 'weight-training-1', {
        muscle_groups: mockMuscleGroups,
        duration_minutes: 30,
      });

      const queryCall = vi.mocked(pool.query).mock.calls[0];
      expect(queryCall[0]).toContain('muscle_groups = $1');
      expect(queryCall[0]).toContain('duration_minutes = $2');
      expect(queryCall[0]).not.toContain('notes');
    });
  });
});

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { WeightTrainingService } from '@/api/services/weightTrainingService';
import { WeightTrainingModel } from '@/api/models/weightTrainingModel';
import { MuscleGroup } from '@/api/types/weightTraining';

vi.mock('@/api/models/weightTrainingModel');

describe('WeightTrainingService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAllWeightTrainings', () => {
    it('should return all weight trainings for a user', async () => {
      const mockMuscleGroups = ['chest', 'triceps'] as MuscleGroup[];

      const mockWeightTrainings = [
        { id: '1', muscle_groups: mockMuscleGroups, user_id: 'user-1' },
        { id: '2', muscle_groups: mockMuscleGroups, user_id: 'user-1' },
      ];

      vi.mocked(WeightTrainingModel.findAll).mockResolvedValueOnce(
        mockWeightTrainings as any,
      );

      const result =
        await WeightTrainingService.getAllWeightTrainings('user-1');

      expect(WeightTrainingModel.findAll).toHaveBeenCalledWith('user-1');
      expect(result).toEqual(mockWeightTrainings);
    });
  });

  describe('createWeightTraining', () => {
    it('should create a valid weight training', async () => {
      const mockMuscleGroups = ['chest', 'triceps'] as MuscleGroup[];

      const mockWeightTraining = {
        id: '1',
        muscle_groups: mockMuscleGroups,
        duration_minutes: 30,
        user_id: 'user-1',
      };

      vi.mocked(WeightTrainingModel.create).mockResolvedValueOnce(
        mockWeightTraining as any,
      );

      const result = await WeightTrainingService.createWeightTraining(
        'user-1',
        {
          muscle_groups: mockMuscleGroups,
          duration_minutes: 30,
          notes: null,
          created_at: new Date(),
        },
      );

      expect(result).toEqual(mockWeightTraining);
      expect(WeightTrainingModel.create).toHaveBeenCalled();
    });

    it('should throw error for invalid muscle groups', async () => {
      const mockMuscleGroups = [] as MuscleGroup[];

      await expect(
        WeightTrainingService.createWeightTraining('user-1', {
          muscle_groups: mockMuscleGroups,
          duration_minutes: 30,
          notes: null,
          created_at: new Date(),
        }),
      ).rejects.toThrow('At least one muscle group is required');
    });

    it('should throw error for invalid duration', async () => {
      const mockMuscleGroups = ['chest', 'triceps'] as MuscleGroup[];

      await expect(
        WeightTrainingService.createWeightTraining('user-1', {
          muscle_groups: mockMuscleGroups,
          duration_minutes: 0,
          notes: null,
          created_at: new Date(),
        }),
      ).rejects.toThrow('Duration must be positive');
    });
  });

  describe('updateWeightTraining', () => {
    it('should update a weight training with valid data', async () => {
      const mockMuscleGroups = ['chest', 'triceps'] as MuscleGroup[];

      const mockUpdatedWeightTraining = {
        id: 'weight-training-1',
        muscle_groups: mockMuscleGroups,
        user_id: 'user-1',
      };

      vi.mocked(WeightTrainingModel.update).mockResolvedValueOnce(
        mockUpdatedWeightTraining as any,
      );

      const result = await WeightTrainingService.updateWeightTraining(
        'user-1',
        'weight-training-1',
        {
          muscle_groups: mockMuscleGroups,
        },
      );

      expect(result).toEqual(mockUpdatedWeightTraining);
      expect(WeightTrainingModel.update).toHaveBeenCalledWith(
        'user-1',
        'weight-training-1',
        {
          muscle_groups: mockMuscleGroups,
        },
      );
    });

    it('should throw error for invalid weight training id', async () => {
      const mockMuscleGroups = ['chest', 'triceps'] as MuscleGroup[];

      await expect(
        WeightTrainingService.updateWeightTraining('user-1', '', {
          muscle_groups: mockMuscleGroups,
        }),
      ).rejects.toThrow('Invalid weight training id');
    });

    it('should throw error for negative duration', async () => {
      await expect(
        WeightTrainingService.updateWeightTraining(
          'user-1',
          'weight-training-1',
          {
            duration_minutes: -5,
          },
        ),
      ).rejects.toThrow('Duration must be positive');
    });

    it('should throw error for zero duration', async () => {
      await expect(
        WeightTrainingService.updateWeightTraining(
          'user-1',
          'weight-training-1',
          {
            duration_minutes: 0,
          },
        ),
      ).rejects.toThrow('Duration must be positive');
    });
  });

  describe('deleteWeightTraining', () => {
    it('should delete a weight training', async () => {
      vi.mocked(WeightTrainingModel.delete).mockResolvedValueOnce(undefined);

      await WeightTrainingService.deleteWeightTraining(
        'user-1',
        'weight-training-1',
      );

      expect(WeightTrainingModel.delete).toHaveBeenCalledWith(
        'user-1',
        'weight-training-1',
      );
    });

    it('should throw error for invalid weight training id', async () => {
      await expect(
        WeightTrainingService.deleteWeightTraining('user-1', ''),
      ).rejects.toThrow('Invalid weight training id');
    });
  });
});

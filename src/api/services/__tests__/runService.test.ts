import { describe, it, expect, beforeEach, vi } from 'vitest';
import { RunService } from '@/api/services/runService';
import { RunModel } from '@/api/models/runModel';
import { DistanceUnit } from '@/api/types/run';

vi.mock('@/api/models/runModel');

describe('RunService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAllRuns', () => {
    it('should return all runs for a user', async () => {
      const mockRuns = [
        { id: '1', distance: 5, user_id: 'user-1' },
        { id: '2', distance: 10, user_id: 'user-1' },
      ];

      vi.mocked(RunModel.findAll).mockResolvedValueOnce(mockRuns as any);

      const result = await RunService.getAllRuns('user-1');

      expect(RunModel.findAll).toHaveBeenCalledWith('user-1');
      expect(result).toEqual(mockRuns);
    });
  });

  describe('createRun', () => {
    it('should create a valid run', async () => {
      const mockRun = {
        id: '1',
        distance: 5,
        distance_unit: DistanceUnit.KM,
        duration_minutes: 30,
        user_id: 'user-1',
      };

      vi.mocked(RunModel.create).mockResolvedValueOnce(mockRun as any);

      const result = await RunService.createRun('user-1', {
        distance: 5,
        distance_unit: DistanceUnit.KM,
        duration_minutes: 30,
        notes: null,
        created_at: new Date(),
      });

      expect(result).toEqual(mockRun);
      expect(RunModel.create).toHaveBeenCalled();
    });

    it('should throw error for invalid distance', async () => {
      await expect(
        RunService.createRun('user-1', {
          distance: 0,
          distance_unit: DistanceUnit.KM,
          duration_minutes: 30,
          notes: null,
          created_at: new Date(),
        }),
      ).rejects.toThrow('Invalid run data');
    });

    it('should throw error for invalid duration', async () => {
      await expect(
        RunService.createRun('user-1', {
          distance: 5,
          distance_unit: DistanceUnit.KM,
          duration_minutes: 0,
          notes: null,
          created_at: new Date(),
        }),
      ).rejects.toThrow('Invalid run data');
    });

    it('should throw error for missing distance_unit', async () => {
      await expect(
        RunService.createRun('user-1', {
          distance: 5,
          distance_unit: null as any,
          duration_minutes: 30,
          notes: null,
          created_at: new Date(),
        }),
      ).rejects.toThrow('Invalid run data');
    });
  });

  describe('updateRun', () => {
    it('should update a run with valid data', async () => {
      const mockUpdatedRun = {
        id: 'run-1',
        distance: 10,
        user_id: 'user-1',
      };

      vi.mocked(RunModel.update).mockResolvedValueOnce(mockUpdatedRun as any);

      const result = await RunService.updateRun('user-1', 'run-1', {
        distance: 10,
      });

      expect(result).toEqual(mockUpdatedRun);
      expect(RunModel.update).toHaveBeenCalledWith('user-1', 'run-1', {
        distance: 10,
      });
    });

    it('should throw error for invalid run id', async () => {
      await expect(
        RunService.updateRun('user-1', '', { distance: 10 }),
      ).rejects.toThrow('Invalid run id');
    });

    it('should throw error for negative duration', async () => {
      await expect(
        RunService.updateRun('user-1', 'run-1', { duration_minutes: -5 }),
      ).rejects.toThrow('Duration must be positive');
    });

    it('should throw error for zero duration', async () => {
      await expect(
        RunService.updateRun('user-1', 'run-1', { duration_minutes: 0 }),
      ).rejects.toThrow('Duration must be positive');
    });
  });

  describe('deleteRun', () => {
    it('should delete a run', async () => {
      vi.mocked(RunModel.delete).mockResolvedValueOnce(undefined);

      await RunService.deleteRun('user-1', 'run-1');

      expect(RunModel.delete).toHaveBeenCalledWith('user-1', 'run-1');
    });

    it('should throw error for invalid run id', async () => {
      await expect(RunService.deleteRun('user-1', '')).rejects.toThrow(
        'Invalid run id',
      );
    });
  });
});

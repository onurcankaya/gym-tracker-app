import { describe, it, expect, beforeEach, vi } from 'vitest';
import { RunModel } from '@/api/models/runModel';
import pool from '@/lib/db';
import { DistanceUnit } from '@/api/types/run';

vi.mock('@/lib/db', () => ({
  default: {
    query: vi.fn(),
  },
}));

describe('RunModel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('findAll', () => {
    it('should fetch all runs for a user', async () => {
      const mockRuns = [
        { id: '1', distance: 5, user_id: 'user-1' },
        { id: '2', distance: 10, user_id: 'user-2' },
      ];

      vi.mocked(pool.query).mockResolvedValueOnce({ rows: mockRuns } as any);

      const result = await RunModel.findAll('user-1');

      expect(pool.query).toHaveBeenCalledWith(
        'SELECT * FROM runs WHERE user_id = $1 ORDER BY created_at DESC',
        ['user-1'],
      );

      expect(result).toEqual(mockRuns);
    });
  });

  describe('create', () => {
    it('should create a new run', async () => {
      const mockRun = {
        id: '1',
        distance: 5,
        distance_unit: 'km',
        duration_minutes: 25,
        user_id: 'user-1',
      };

      vi.mocked(pool.query).mockResolvedValueOnce({ rows: [mockRun] } as any);

      const result = await RunModel.create('user-1', {
        distance: 5,
        distance_unit: DistanceUnit.KM,
        duration_minutes: 25,
        notes: null,
        created_at: new Date(),
      });

      expect(result).toEqual(mockRun);
      expect(pool.query).toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should delete a run for the correct user', async () => {
      vi.mocked(pool.query).mockResolvedValueOnce({ rows: [] } as any);

      await RunModel.delete('user-1', 'run-1');

      expect(pool.query).toHaveBeenCalledWith(
        'DELETE FROM runs WHERE user_id = $1 AND id = $2',
        ['user-1', 'run-1'],
      );
    });
  });

  describe('update', () => {
    it('should update a run with partial data', async () => {
      const mockUpdatedRun = {
        id: 'run-1',
        distance: 10,
        distance_unit: 'km',
        duration_minutes: 45,
        user_id: 'user-1',
      };

      vi.mocked(pool.query).mockResolvedValueOnce({
        rows: [mockUpdatedRun],
      } as any);

      const result = await RunModel.update('user-1', 'run-1', {
        distance: 10,
      });

      expect(result).toEqual(mockUpdatedRun);
      expect(pool.query).toHaveBeenCalledWith(
        'UPDATE runs SET distance = $1 WHERE id = $2 AND user_id = $3 RETURNING *',
        [10, 'run-1', 'user-1'],
      );
    });

    it('should throw error when no fields to update', async () => {
      await expect(RunModel.update('user-1', 'run-1', {})).rejects.toThrow(
        'No fields to update',
      );
    });

    it('should throw error when run not found', async () => {
      vi.mocked(pool.query).mockResolvedValueOnce({ rows: [] } as any);

      await expect(
        RunModel.update('user-1', 'run-1', { distance: 10 }),
      ).rejects.toThrow('Run not found or unauthorized');
    });

    it('should only update fields that are provided', async () => {
      const mockRun = { id: 'run-1', distance: 8, duration_minutes: 30 };

      vi.mocked(pool.query).mockResolvedValueOnce({ rows: [mockRun] } as any);

      await RunModel.update('user-1', 'run-1', {
        distance: 8,
        duration_minutes: 30,
      });

      const queryCall = vi.mocked(pool.query).mock.calls[0];
      expect(queryCall[0]).toContain('distance = $1');
      expect(queryCall[0]).toContain('duration_minutes = $2');
      expect(queryCall[0]).not.toContain('notes');
    });
  });
});

import { RunModel } from '@/api/models/runModel';
import { Run, CreateRunDTO, UpdateRunDTO, RunStats } from '@/api/types/run';

export class RunService {
  static async getAllRuns(userId: string): Promise<Run[]> {
    return RunModel.findAll(userId);
  }

  static async createRun(userId: string, data: CreateRunDTO): Promise<Run> {
    if (!data.distance || !data.distance_unit || data.duration_minutes <= 0) {
      throw new Error('Invalid run data');
    }

    return RunModel.create(userId, data);
  }

  static async deleteRun(userId: string, runId: string): Promise<void> {
    if (!runId) {
      throw new Error('Invalid run id');
    }
    return RunModel.delete(userId, runId);
  }

  static async updateRun(
    userId: string,
    runId: string,
    data: UpdateRunDTO,
  ): Promise<Run> {
    if (!runId) {
      throw new Error('Invalid run id');
    }

    if (data.duration_minutes !== undefined && data.duration_minutes <= 0) {
      throw new Error('Duration must be positive');
    }

    return RunModel.update(userId, runId, data);
  }

  static async getStats(userId: string): Promise<RunStats> {
    return RunModel.getStats(userId);
  }
}

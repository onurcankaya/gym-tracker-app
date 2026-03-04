import { RunModel } from '@/api/models/runModel';
import { Run, CreateRunDTO, UpdateRunDTO } from '@/api/types/run';

export class RunService {
  static async getAllRuns(): Promise<Run[]> {
    return RunModel.findAll();
  }

  static async createRun(data: CreateRunDTO): Promise<Run> {
    if (!data.distance || !data.distance_unit || data.duration_minutes <= 0) {
      throw new Error('Invalid run data');
    }

    return RunModel.create(data);
  }

  static async deleteRun(id: string): Promise<void> {
    if (!id) {
      throw new Error('Invalid run id');
    }
    return RunModel.delete(id);
  }

  static async updateRun(id: string, data: UpdateRunDTO): Promise<Run> {
    if (!id) {
      throw new Error('Invalid run id');
    }

    if (data.duration_minutes !== undefined && data.duration_minutes <= 0) {
      throw new Error('Duration must be positive');
    }

    return RunModel.update(id, data);
  }
}

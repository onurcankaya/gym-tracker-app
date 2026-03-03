import { WeightTrainingModel } from '@/api/models/weightTrainingModel';
import {
  WeightTraining,
  CreateWeightTrainingDTO,
  UpdateWeightTrainingDTO,
} from '@/api/types/weightTraining';

export class WeightTrainingService {
  static async getAllWeightTrainings(): Promise<WeightTraining[]> {
    return WeightTrainingModel.findAll();
  }

  static async createWeightTraining(
    data: CreateWeightTrainingDTO,
  ): Promise<WeightTraining> {
    if (!data.muscle_groups || data.muscle_groups.length === 0) {
      throw new Error('At least one muscle group is required');
    }

    if (data.duration_minutes <= 0) {
      throw new Error('Duration must be positive');
    }

    return WeightTrainingModel.create(data);
  }

  static async deleteWeightTraining(id: string): Promise<void> {
    if (!id) {
      throw new Error('Invalid weight training id');
    }
    return WeightTrainingModel.delete(id);
  }

  static async updateWeightTraining(
    id: string,
    data: UpdateWeightTrainingDTO,
  ): Promise<WeightTraining> {
    if (!id) {
      throw new Error('Invalid weight training id');
    }

    if (data.muscle_groups !== undefined && data.muscle_groups.length === 0) {
      throw new Error('At least one muscle group is required');
    }

    if (data.duration_minutes !== undefined && data.duration_minutes <= 0) {
      throw new Error('Duration must be positive');
    }

    return WeightTrainingModel.update(id, data);
  }
}

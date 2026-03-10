import { WeightTrainingModel } from '@/api/models/weightTrainingModel';
import {
  WeightTraining,
  CreateWeightTrainingDTO,
  UpdateWeightTrainingDTO,
} from '@/api/types/weightTraining';

export class WeightTrainingService {
  static async getAllWeightTrainings(
    userId: string,
  ): Promise<WeightTraining[]> {
    return WeightTrainingModel.findAll(userId);
  }

  static async createWeightTraining(
    userId: string,
    data: CreateWeightTrainingDTO,
  ): Promise<WeightTraining> {
    if (!data.muscle_groups || data.muscle_groups.length === 0) {
      throw new Error('At least one muscle group is required');
    }

    if (data.duration_minutes <= 0) {
      throw new Error('Duration must be positive');
    }

    return WeightTrainingModel.create(userId, data);
  }

  static async deleteWeightTraining(
    userId: string,
    weightTrainingId: string,
  ): Promise<void> {
    if (!weightTrainingId) {
      throw new Error('Invalid weight training id');
    }
    return WeightTrainingModel.delete(userId, weightTrainingId);
  }

  static async updateWeightTraining(
    userId: string,
    weightTrainingId: string,
    data: UpdateWeightTrainingDTO,
  ): Promise<WeightTraining> {
    if (!weightTrainingId) {
      throw new Error('Invalid weight training id');
    }

    if (data.muscle_groups !== undefined && data.muscle_groups.length === 0) {
      throw new Error('At least one muscle group is required');
    }

    if (data.duration_minutes !== undefined && data.duration_minutes <= 0) {
      throw new Error('Duration must be positive');
    }

    return WeightTrainingModel.update(userId, weightTrainingId, data);
  }
}

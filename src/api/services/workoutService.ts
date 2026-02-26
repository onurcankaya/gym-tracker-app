import { WorkoutModel } from '@/api/models/workoutModel';
import {
  Workout,
  CreateWorkoutDTO,
  UpdateWorkoutDTO,
} from '@/api/types/workout';

export class WorkoutService {
  static async getAllWorkouts(): Promise<Workout[]> {
    return WorkoutModel.findAll();
  }

  static async createWorkout(data: CreateWorkoutDTO): Promise<Workout> {
    if (!data.type || data.duration_minutes <= 0) {
      throw new Error('Invalid workout data');
    }

    return WorkoutModel.create(data);
  }

  static async deleteWorkout(id: string): Promise<void> {
    if (!id) {
      throw new Error('Invalid workout id');
    }
    return WorkoutModel.delete(id);
  }

  static async updateWorkout(
    id: string,
    data: UpdateWorkoutDTO,
  ): Promise<Workout> {
    if (!id) {
      throw new Error('Invalid workout id');
    }

    if (data.duration_minutes !== undefined && data.duration_minutes <= 0) {
      throw new Error('Duration must be positive');
    }

    return WorkoutModel.update(id, data);
  }
}

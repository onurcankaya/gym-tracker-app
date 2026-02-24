import { WorkoutModel } from '@/api/models/workoutModel';
import { Workout, CreateWorkoutDTO } from '@/api/types/workout';

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
}

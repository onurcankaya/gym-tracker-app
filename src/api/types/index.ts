import { Run } from './run';
import { WeightTraining } from './weightTraining';

export enum WorkoutType {
  ALL = 'all',
  RUN = 'run',
  WEIGHT_TRAINING = 'weight training',
}

export type Workout =
  | (Run & { type: WorkoutType.RUN })
  | (WeightTraining & { type: WorkoutType.WEIGHT_TRAINING });

'use client';

import ActivityCalendar from '@/components/stats/ActivityCalendar';
import WeightTrainingOverview from '@/components/stats/weight-training/WeightTrainingOverview';
import WeightTrainingFrequency from '@/components/stats/weight-training/charts/WeightTrainingFrequency';
import CumulativeWeightTrainingSessions from '@/components/stats/weight-training/charts/CumulativeWeightTrainingSessions';
import MuscleGroupsOverTime from '@/components/stats/weight-training/charts/MuscleGroupsOverTime';

export default function WeightTrainingStats() {
  return (
    <>
      <WeightTrainingOverview />
      <ActivityCalendar />
      <WeightTrainingFrequency />
      <MuscleGroupsOverTime />
      <CumulativeWeightTrainingSessions />
    </>
  );
}

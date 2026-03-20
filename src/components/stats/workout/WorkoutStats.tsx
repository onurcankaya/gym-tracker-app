'use client';

import ActivityCalendar from '@/components/stats/ActivityCalendar';
import WorkoutOverview from '@/components/stats/workout/WorkoutOverview';
import WorkoutFrequency from '@/components/stats/workout/charts/WorkoutFrequency';
import CumulativeWorkouts from '@/components/stats/workout/charts/CumulativeWorkouts';

export default function WorkoutStats() {
  return (
    <>
      <WorkoutOverview />
      <ActivityCalendar />
      <WorkoutFrequency />
      <CumulativeWorkouts />
    </>
  );
}

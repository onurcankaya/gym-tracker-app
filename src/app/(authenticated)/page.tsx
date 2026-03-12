'use client';

import LogWorkoutDialog from '@/components/workout/LogWorkoutDialog';
import WorkoutHistory from '@/components/workout/WorkoutHistory';

export default function Home() {
  return (
    <div className="container mx-auto max-w-3xl flex flex-col gap-4 px-4 py-16 md:px-8 md:py-24">
      <LogWorkoutDialog />
      <WorkoutHistory />
    </div>
  );
}

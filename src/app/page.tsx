'use client';

import WorkoutForm from '@/components/workout/WorkoutForm';
import WorkoutHistory from '@/components/workout/WorkoutHistory';

export default function Home() {
  return (
    <div className="container mx-auto flex flex-col gap-8 p-4 md:p-8 max-w-3xl">
      <WorkoutForm />
      <WorkoutHistory />
    </div>
  );
}

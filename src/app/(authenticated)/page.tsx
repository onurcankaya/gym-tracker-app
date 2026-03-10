'use client';

import WorkoutForm from '@/components/workout/WorkoutForm';
import WorkoutHistory from '@/components/workout/WorkoutHistory';

export default function Home() {
  return (
    <div className="container mx-auto max-w-3xl flex flex-col gap-8 px-4 py-16 md:px-8 md:py-24">
      <WorkoutForm />
      <WorkoutHistory />
    </div>
  );
}

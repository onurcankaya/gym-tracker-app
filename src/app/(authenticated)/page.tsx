'use client';

import PageWrapper from '@/components/common/PageWrapper';

import WorkoutHistory from '@/components/workout/WorkoutHistory';

export default function Home() {
  return (
    <PageWrapper title="Workouts">
      <WorkoutHistory />
    </PageWrapper>
  );
}

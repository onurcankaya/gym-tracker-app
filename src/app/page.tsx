'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import WorkoutForm from '@/components/workout/WorkoutForm';
import WorkoutCard from '@/components/workout/WorkoutCard';
import { useWorkouts } from '@/hooks/useWorkouts';

export default function Home() {
  const { data: workouts, isLoading, error } = useWorkouts();

  if (isLoading) return <div className="p-8 text-center">Loading...</div>;
  if (error)
    return (
      <div className="p-8 text-center text-red-600">Error loading workouts</div>
    );

  return (
    <div className="container mx-auto p-8 max-w-3xl">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Log Workout</CardTitle>
        </CardHeader>
        <CardContent>
          <WorkoutForm />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Workouts</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {workouts?.map((workout) => (
            <WorkoutCard key={workout.id} workout={workout} />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

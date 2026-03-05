'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import WorkoutForm from '@/components/workout/WorkoutForm';
import WorkoutHistory from '@/components/workout/WorkoutHistory';

export default function Home() {
  return (
    <div className="container mx-auto p-4 md:p-8 max-w-3xl">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Log Workout</CardTitle>
        </CardHeader>
        <CardContent>
          <WorkoutForm />
        </CardContent>
      </Card>

      <WorkoutHistory />
    </div>
  );
}

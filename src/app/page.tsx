'use client';
import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import WorkoutForm from '@/components/workout/WorkoutForm';
import WorkoutCard from '@/components/workout/WorkoutCard';
import { useWorkouts } from '@/hooks/useWorkouts';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const { data: workouts, isLoading, error } = useWorkouts();

  const filteredWorkouts = useMemo(() => {
    if (!workouts) return [];
    if (!searchQuery) return workouts;

    return workouts.filter((workout) => {
      const search = searchQuery.toLowerCase();
      const type = workout.type.toLowerCase();
      const notes = workout.notes?.toLowerCase() || '';

      return type.includes(search) || notes.includes(search);
    });
  }, [searchQuery, workouts]);

  if (isLoading) return <div className="p-8 text-center">Loading...</div>;
  if (error)
    return (
      <div className="p-8 text-center text-red-600">Error loading workouts</div>
    );

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

      <Card>
        <CardHeader>
          <div className="flex justify-between">
            <CardTitle>Recent Workouts</CardTitle>
            <Input
              type="text"
              placeholder="Search workouts"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-xs"
            />
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {filteredWorkouts.length > 0 ? (
            filteredWorkouts.map((workout) => (
              <WorkoutCard key={workout.id} workout={workout} />
            ))
          ) : (
            <div className="flex items-center justify-center min-h-[160px]">
              <p className="text-sm text-gray-400 text-center">
                No workouts found
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

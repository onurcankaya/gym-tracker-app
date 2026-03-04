'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { Input } from '@/components/ui/input';
import WorkoutForm from '@/components/workout/WorkoutForm';
import WorkoutCard from '@/components/workout/WorkoutCard';
import { useRuns } from '@/hooks/useRuns';
import { useWeightTrainings } from '@/hooks/useWeightTraining';
import { WorkoutType, Workout } from '@/api/types';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const { data: runs, isLoading: isLoadingRuns, error: errorRuns } = useRuns();
  const {
    data: weightTrainings,
    isLoading: isLoadingWeightTrainings,
    error: errorWeightTrainings,
  } = useWeightTrainings();

  const allWorkouts = useMemo(() => {
    const items = [
      ...(runs?.map((run) => ({ ...run, type: WorkoutType.RUN })) || []),
      ...(weightTrainings?.map((weightTraining) => ({
        ...weightTraining,
        type: WorkoutType.WEIGHT_TRAINING,
      })) || []),
    ] as Workout[];

    return items.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );
  }, [runs, weightTrainings]);

  const filteredWorkouts = useMemo(() => {
    if (!allWorkouts) return [];
    if (!searchQuery) return allWorkouts;

    return allWorkouts.filter((workout) => {
      const search = searchQuery.toLowerCase();
      const type = workout.type.toLowerCase();
      const notes = workout.notes?.toLowerCase() || '';

      return (
        type.includes(search) ||
        notes.includes(search) ||
        (workout.type === WorkoutType.WEIGHT_TRAINING &&
          workout.muscle_groups?.some((muscleGroup) =>
            muscleGroup.includes(search),
          ))
      );
    });
  }, [searchQuery, allWorkouts]);

  if (isLoadingRuns || isLoadingWeightTrainings)
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <Spinner className="size-24 text-neon-green-300" />
      </div>
    );
  if (errorRuns || errorWeightTrainings)
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
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <Input
            type="text"
            placeholder="Search workouts"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-60"
          />
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

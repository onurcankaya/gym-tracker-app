'use client';

import { useState, useMemo } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { Input } from '@/components/ui/input';
import WorkoutCard from '@/components/workout/WorkoutCard';
import { useRuns } from '@/hooks/useRuns';
import { useWeightTrainings } from '@/hooks/useWeightTraining';
import { WorkoutType, Workout } from '@/api/types';

export default function Home() {
  const [activeTab, setActiveTab] = useState(WorkoutType.ALL);
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

    if (
      activeTab === WorkoutType.RUN ||
      activeTab === WorkoutType.WEIGHT_TRAINING
    ) {
      return sortByDate(items.filter((item) => item.type === activeTab));
    }

    return sortByDate(items);
  }, [activeTab, runs, weightTrainings]);

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

  function sortByDate(items: Workout[]) {
    return items.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );
  }

  const isLoading = useMemo(() => {
    return isLoadingRuns || isLoadingWeightTrainings;
  }, [isLoadingRuns, isLoadingWeightTrainings]);

  const notFoundMessage = useMemo(() => {
    if (activeTab === WorkoutType.RUN) {
      return 'No runs found';
    } else if (activeTab === WorkoutType.WEIGHT_TRAINING) {
      return 'No weight training found';
    }

    return 'No workouts found';
  }, [activeTab]);

  if (errorRuns || errorWeightTrainings)
    return (
      <div className="p-8 text-center text-red-600">Error loading workouts</div>
    );

  return (
    <Card>
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as WorkoutType)}
        className="block"
      >
        <CardHeader>
          <div className="flex flex-col justify-between sm:flex-row">
            <CardTitle>Recent Workouts</CardTitle>

            <TabsList className="gap-2 w-full mt-6 mb-2 sm:w-auto sm:my-0 ">
              <TabsTrigger value={WorkoutType.ALL}>All</TabsTrigger>
              <TabsTrigger value={WorkoutType.RUN}>Runs</TabsTrigger>
              <TabsTrigger value={WorkoutType.WEIGHT_TRAINING}>
                Weight Training
              </TabsTrigger>
            </TabsList>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 px-4 sm:px-6">
          <Input
            type="text"
            placeholder="Search workouts"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-full sm:max-w-60"
          />

          {isLoading ? (
            <div className="w-full h-80 flex items-center justify-center">
              <Spinner className="size-12 text-neon-green-300" />
            </div>
          ) : filteredWorkouts.length > 0 ? (
            filteredWorkouts.map((workout) => (
              <WorkoutCard key={workout.id} workout={workout} />
            ))
          ) : (
            <div className="flex items-center justify-center min-h-[160px]">
              <p className="text-sm text-gray-400 text-center">
                {notFoundMessage}
              </p>
            </div>
          )}
        </CardContent>
      </Tabs>
    </Card>
  );
}

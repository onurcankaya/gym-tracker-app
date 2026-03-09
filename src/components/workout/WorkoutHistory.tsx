'use client';

import { useState, useMemo } from 'react';
import { DateRange } from 'react-day-picker';
import { Search, X } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { InputWithSlots } from '@/components/common/InputWithSlots';
import WorkoutFilters from '@/components/workout/WorkoutFilters';
import WorkoutCard from '@/components/workout/WorkoutCard';
import { useRuns } from '@/hooks/useRuns';
import { useWeightTrainings } from '@/hooks/useWeightTraining';
import { formatFullDate } from '@/lib/dateUtils';
import { WorkoutType, Workout } from '@/api/types';

export default function WorkoutHistory() {
  const [activeTab, setActiveTab] = useState(WorkoutType.ALL);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState<DateRange>();
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

    if (dateRange && dateRange.from && dateRange.to) {
      return items.filter((workout) => {
        const workoutDate = new Date(workout.created_at).getTime();
        const dateRangeFrom = dateRange.from
          ? new Date(dateRange.from).getTime()
          : 0;
        const dateRangeTo = dateRange.to ? new Date(dateRange.to).getTime() : 0;

        return workoutDate >= dateRangeFrom && workoutDate <= dateRangeTo;
      });
    }

    if (
      activeTab === WorkoutType.RUN ||
      activeTab === WorkoutType.WEIGHT_TRAINING
    ) {
      return sortByDate(items.filter((item) => item.type === activeTab));
    }

    return sortByDate(items);
  }, [activeTab, dateRange, runs, weightTrainings]);

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

  const hasActiveFilters = useMemo(() => {
    return !!dateRange?.from || !!dateRange?.to;
  }, [dateRange]);

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
        <CardHeader className="px-4 sm:px-6">
          <div className="flex flex-col justify-between sm:flex-row">
            <CardTitle>Recent Workouts</CardTitle>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col gap-4 my-4 px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-0 items-center justify-between">
            <div className="flex items-end gap-2 w-full sm:w-auto">
              <TabsList className="gap-2 w-full sm:w-auto sm:my-0 ">
                <TabsTrigger value={WorkoutType.ALL}>All</TabsTrigger>
                <TabsTrigger value={WorkoutType.RUN}>Runs</TabsTrigger>
                <TabsTrigger value={WorkoutType.WEIGHT_TRAINING}>
                  Weight Training
                </TabsTrigger>
              </TabsList>
            </div>

            <InputWithSlots
              type="text"
              placeholder="Search workouts"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftSlot={<Search className="h-4 w-4" />}
              rightSlot={
                <WorkoutFilters
                  dateRange={dateRange}
                  setDateRange={setDateRange}
                  hasActiveFilters={hasActiveFilters}
                />
              }
              hasValues={hasActiveFilters || searchQuery.length > 0}
              className="max-w-full sm:max-w-60"
            />
          </div>

          {dateRange && (
            <div
              className="w-auto sm:w-fit flex items-center justify-between border rounded-full px-3 py-1 border-neon-green-300 cursor-pointer"
              onClick={() => setDateRange(undefined)}
            >
              <p className="text-xs">
                <span>Date range: </span>
                {dateRange && dateRange.from && dateRange.to && (
                  <span>
                    {formatFullDate(dateRange.from)} -{' '}
                    {formatFullDate(dateRange.to)}
                  </span>
                )}
              </p>
              <X className="h-3 w-3 ml-3" />
            </div>
          )}
        </CardContent>

        <CardContent className="space-y-4 px-4 sm:px-6">
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

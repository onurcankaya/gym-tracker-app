'use client';

import { useState, useMemo } from 'react';
import { DateRange } from 'react-day-picker';
import {
  Search as SearchIcon,
  X as XIcon,
  RotateCcw as RetryIcon,
} from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { InputWithSlots } from '@/components/common/InputWithSlots';
import LogWorkoutDialog from '@/components/workout/LogWorkoutDialog';
import WorkoutFilters from '@/components/workout/WorkoutFilters';
import WorkoutCard from '@/components/workout/WorkoutCard';
import { useRuns } from '@/hooks/useRuns';
import { useWeightTrainings } from '@/hooks/useWeightTrainings';
import { formatFullDate, isDateInRange } from '@/lib/dateUtils';
import { sortByWorkoutDate } from '@/lib/workoutUtils';
import { WorkoutType, Workout } from '@/api/types';

export default function WorkoutHistory() {
  const [activeTab, setActiveTab] = useState<WorkoutType>(WorkoutType.ALL);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState<DateRange>();

  const queryClient = useQueryClient();

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

    const itemsDesc = sortByWorkoutDate(items, 'desc');

    return itemsDesc;
  }, [runs, weightTrainings]);

  const filteredWorkouts = useMemo(() => {
    if (!allWorkouts) return [];

    let filteredData = allWorkouts;

    if (
      activeTab === WorkoutType.RUN ||
      activeTab === WorkoutType.WEIGHT_TRAINING
    ) {
      filteredData = filteredData.filter(
        (workout) => workout.type === activeTab,
      );
    }

    if (dateRange && dateRange?.from && dateRange?.to) {
      filteredData = filteredData.filter((workout) =>
        isDateInRange(workout.created_at, {
          from: dateRange.from,
          to: dateRange.to,
        }),
      );
    }

    if (searchQuery.length) {
      filteredData = filteredData.filter((workout) => {
        const type = workout.type?.toLowerCase();
        const notes = workout.notes?.toLowerCase() || '';
        const search = searchQuery.toLowerCase();

        return (
          type?.includes(search) ||
          notes.includes(search) ||
          (workout.type === WorkoutType.WEIGHT_TRAINING &&
            workout.muscle_groups?.some((muscleGroup) =>
              muscleGroup.includes(search),
            ))
        );
      });
    }

    return filteredData;
  }, [activeTab, searchQuery, dateRange, allWorkouts]);

  const title = useMemo(() => {
    if (activeTab === WorkoutType.RUN) return 'Runs';
    if (activeTab === WorkoutType.WEIGHT_TRAINING) return 'Weight training';
    else return 'All workouts';
  }, [activeTab]);

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

  const hasErrors = useMemo(() => {
    return errorRuns || errorWeightTrainings;
  }, [errorRuns, errorWeightTrainings]);

  return (
    <Card className="w-full py-4">
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as WorkoutType)}
        className="block"
      >
        <CardHeader className="px-5 md:px-6">
          <div className="flex justify-between">
            <CardTitle className="text-sm md:text-base">{title}</CardTitle>
            <LogWorkoutDialog />
          </div>
        </CardHeader>

        {hasErrors ? (
          <div className="w-full h-60 flex flex-col items-center justify-center">
            <p className="p-8 text-sm text-center text-red-500">
              Error loading workouts
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                queryClient.invalidateQueries({ queryKey: ['runs'] });
                queryClient.invalidateQueries({
                  queryKey: ['weight-trainings'],
                });
              }}
            >
              <RetryIcon />
              Retry
            </Button>
          </div>
        ) : (
          <>
            <CardContent className="flex flex-col gap-4 my-4 px-4 sm:px-6">
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-0 items-center justify-between">
                <div className="flex items-end gap-2 w-full sm:w-auto">
                  <TabsList className="w-full gap-2 sm:w-auto sm:my-0 ">
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
                  leftSlot={<SearchIcon className="h-4 w-4" />}
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
                  <XIcon className="h-3 w-3 ml-3" />
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
          </>
        )}
      </Tabs>
    </Card>
  );
}

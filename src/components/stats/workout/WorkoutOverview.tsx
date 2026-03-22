'use client';

import { useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { RotateCcw as RetryIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import { useStats } from '@/contexts/StatsContext';
import { useRunStats } from '@/hooks/useRuns';
import { useWeightTrainingStats } from '@/hooks/useWeightTrainings';
import { formatMinutesToHours } from '@/lib/dateUtils';

export default function WorkoutOverview() {
  const { dateRange } = useStats();

  const {
    data: runStats,
    isLoading: isLoadingRunStats,
    error: runStatsError,
  } = useRunStats(dateRange!);

  const {
    data: weightTrainingStats,
    isLoading: isLoadingWeightTrainingStats,
    error: weightTrainingStatsError,
  } = useWeightTrainingStats(dateRange!);

  const queryClient = useQueryClient();

  const workoutStats = useMemo(() => {
    if (!runStats || !weightTrainingStats || !dateRange?.from || !dateRange?.to)
      return;

    return {
      total_workouts:
        parseInt(runStats.total_runs) +
        parseInt(weightTrainingStats.total_workouts),
      total_time:
        parseInt(runStats.total_time) +
        parseInt(weightTrainingStats.total_time),
      avg_duration:
        (parseInt(runStats.total_time) +
          parseInt(weightTrainingStats.total_time)) /
        (parseInt(runStats.total_runs) +
          parseInt(weightTrainingStats.total_workouts)),
    };
  }, [runStats, weightTrainingStats, dateRange]);

  return (
    <Card className="w-full min-h-30 sm:min-h-20 max-h-fit py-4 sm:py-5">
      <CardHeader className="px-4 sm:px-5">
        <CardTitle className="text-sm sm:text-md">Overview</CardTitle>
      </CardHeader>

      {runStatsError || weightTrainingStatsError ? (
        <CardContent className="flex flex-1 flex-col items-center justify-center px-3 sm:px-4">
          <p className="p-8 text-sm text-center text-red-500">
            Error loading workout overview
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              queryClient.invalidateQueries({
                queryKey: ['runStats', 'weightTrainingStats'],
              });
            }}
          >
            <RetryIcon />
            Retry
          </Button>
        </CardContent>
      ) : (
        <CardContent className="flex flex-1 items-center justify-center px-3 sm:px-4">
          {isLoadingRunStats || isLoadingWeightTrainingStats ? (
            <Spinner className="size-12 text-neon-green-300" />
          ) : (
            <div className="w-full space-y-2 sm:space-y-3 px-0 sm:px-1">
              <div className="grid grid-cols-3 gap-2 sm:gap-3 md:grid-cols-3">
                <div className="flex flex-col gap-1 sm:gap-1.5 border rounded-lg px-3 sm:px-4 py-2 sm:py-3">
                  <p className="text-lg md:text-2xl text-neon-green-300 font-bold">
                    {workoutStats?.total_workouts}
                  </p>
                  <p className="text-xs text-gray-400">Workouts</p>
                </div>
                <div className="flex flex-col gap-1 sm:gap-1.5 border rounded-lg px-3 sm:px-4 py-2 sm:py-3">
                  <p className="text-lg md:text-2xl text-neon-green-300 font-bold">
                    {workoutStats?.total_time &&
                      formatMinutesToHours(workoutStats.total_time)}
                  </p>
                  <p className="text-xs text-gray-400">Total time</p>
                </div>
                <div className="flex flex-col gap-1 sm:gap-1.5 border rounded-lg px-3 sm:px-4 py-2 sm:py-3">
                  <p className="text-lg md:text-2xl text-neon-green-300 font-bold">
                    {workoutStats?.avg_duration
                      ? workoutStats.avg_duration.toFixed(1)
                      : '0'}
                    m
                  </p>
                  <p className="text-xs text-gray-400">Avg time</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}

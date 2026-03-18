'use client';

import { useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { RotateCcw as RetryIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import { BarChartComponent as BarChart } from '@/components/charts/BarChart';
import { useRuns } from '@/hooks/useRuns';
import { useWeightTrainings } from '@/hooks/useWeightTrainings';
import { sortByWorkoutDate } from '@/lib/workoutUtils';
import { workoutColors } from '@/lib/colors';
import { Workout, WorkoutType } from '@/api/types';

export default function WorkoutFrequency() {
  const { data: runs, isLoading: isLoadingRuns, error: errorRuns } = useRuns();
  const {
    data: weightTrainings,
    isLoading: isLoadingWeightTrainings,
    error: errorWeightTrainings,
  } = useWeightTrainings();

  const queryClient = useQueryClient();

  const chartData = useMemo(() => {
    if (!runs || !weightTrainings) return;

    const workouts = [
      ...runs.map((run) => ({ ...run, type: WorkoutType.RUN })),
      ...weightTrainings.map((weightTraining) => ({
        ...weightTraining,
        type: WorkoutType.WEIGHT_TRAINING,
      })),
    ] as Workout[];
    const workoutsAsc = sortByWorkoutDate(workouts, 'asc');

    return (
      workoutsAsc.map((workout) => {
        let runCount = 0;
        let weightTrainingCount = 0;

        if (workout.type === WorkoutType.RUN) {
          runCount++;
        }

        if (workout.type === WorkoutType.WEIGHT_TRAINING) {
          weightTrainingCount++;
        }

        return {
          date: format(new Date(workout.created_at), 'MMM d'),
          run: runCount,
          'weight training': weightTrainingCount,
        };
      }) || []
    );
  }, [runs, weightTrainings]);

  return (
    <Card className="w-full min-h-70 py-4 sm:py-5">
      <CardHeader className="px-4 sm:px-6">
        <CardTitle className="text-sm sm:text-md">Workout Frequency</CardTitle>
      </CardHeader>

      {errorRuns || errorWeightTrainings ? (
        <CardContent className="flex flex-1 flex-col items-center justify-center px-3.5 sm:px-4">
          <p className="p-8 text-sm text-center text-red-500">
            Error loading workouts frequency chart
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              queryClient.invalidateQueries({
                queryKey: ['runs', 'weightTrainings'],
              });
            }}
          >
            <RetryIcon />
            Retry
          </Button>
        </CardContent>
      ) : (
        <CardContent className="flex flex-1 flex-col items-center justify-center px-3.5 sm:px-4">
          {isLoadingRuns || isLoadingWeightTrainings ? (
            <Spinner className="size-12 text-neon-green-300" />
          ) : (
            <BarChart
              chartData={chartData}
              xAxisDataKey="date"
              barColors={{
                run: workoutColors['run'],
                'weight training': workoutColors['weight training'],
              }}
              showLegend={true}
              height={180}
            />
          )}
        </CardContent>
      )}
    </Card>
  );
}

'use client';

import { useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { RotateCcw as RetryIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import { BarChartComponent as BarChart } from '@/components/charts/BarChart';
import { useStats } from '@/contexts/StatsContext';
import { useWeightTrainings } from '@/hooks/useWeightTrainings';
import {
  sortByWorkoutDate,
  filterWorkoutsByDateRange,
} from '@/lib/workoutUtils';
import { muscleGroupColors } from '@/lib/colors';
import { WeightTraining } from '@/api/types/weightTraining';

export default function MuscleGroupsOverTime() {
  const { dateRange } = useStats();
  const { data: weightTrainings, isLoading, error } = useWeightTrainings();

  const queryClient = useQueryClient();

  const chartData = useMemo(() => {
    if (!weightTrainings) return;

    const weightTrainingsAsc = sortByWorkoutDate(
      weightTrainings,
      'asc',
    ) as WeightTraining[];

    const weightTrainingsWithinDateRange = filterWorkoutsByDateRange(
      weightTrainingsAsc,
      dateRange,
    ) as WeightTraining[];

    return (
      weightTrainingsWithinDateRange.map((weightTraining) => {
        const muscleGroups = weightTraining.muscle_groups.reduce(
          (acc, muscleGroup) => {
            acc[muscleGroup] = 1;
            return acc;
          },
          {} as Record<string, number>,
        );

        return {
          date: format(new Date(weightTraining.created_at), 'MMM d'),
          ...muscleGroups,
        };
      }) || []
    );
  }, [weightTrainings, dateRange]);

  return (
    <Card className="w-full min-h-60 sm:min-h-80 py-4 sm:py-5">
      <CardHeader className="px-4 sm:px-6">
        <CardTitle className="text-sm sm:text-md">
          Muscle Groups Over Time
        </CardTitle>
      </CardHeader>

      {error ? (
        <CardContent className="flex flex-1 flex-col items-center justify-center px-3.5 sm:px-4">
          <p className="p-8 text-sm text-center text-red-500">
            Error loading muscle groups over time chart
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              queryClient.invalidateQueries({ queryKey: ['weightTrainings'] });
            }}
          >
            <RetryIcon />
            Retry
          </Button>
        </CardContent>
      ) : (
        <CardContent className="flex flex-1 flex-col items-center justify-center px-3.5 sm:px-4 mt-2">
          {isLoading ? (
            <Spinner className="size-12 text-neon-green-300" />
          ) : (
            <BarChart
              chartData={chartData}
              barColors={muscleGroupColors}
              xAxisDataKey="date"
              isStacked={true}
            />
          )}
        </CardContent>
      )}
    </Card>
  );
}

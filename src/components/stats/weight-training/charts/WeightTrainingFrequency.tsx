'use client';

import { useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { RotateCcw as RetryIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import { BarChartComponent as BarChart } from '@/components/charts/BarChart';
import { useWeightTrainings } from '@/hooks/useWeightTrainings';
import { sortByWorkoutDate } from '@/lib/workoutUtils';
import { workoutColors } from '@/lib/colors';

export default function WeightTrainingFrequency() {
  const { data: weightTrainings, isLoading, error } = useWeightTrainings();

  const queryClient = useQueryClient();

  const chartData = useMemo(() => {
    if (!weightTrainings) return;

    const weightTrainingsAsc = sortByWorkoutDate(weightTrainings, 'asc');

    return (
      weightTrainingsAsc.map((weightTraining) => {
        return {
          date: format(new Date(weightTraining.created_at), 'MMM d'),
          'weight training': 1,
        };
      }) || []
    );
  }, [weightTrainings]);

  return (
    <Card className="w-full min-h-75 py-4 sm:py-5">
      <CardHeader className="px-4 sm:px-6">
        <CardTitle className="text-sm sm:text-md">
          Weight Training Frequency
        </CardTitle>
      </CardHeader>

      {error ? (
        <CardContent className="flex flex-1 flex-col items-center justify-center px-3.5 sm:px-4">
          <p className="p-8 text-sm text-center text-red-500">
            Error loading weight training frequency chart
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              queryClient.invalidateQueries({
                queryKey: ['weightTrainings'],
              });
            }}
          >
            <RetryIcon />
            Retry
          </Button>
        </CardContent>
      ) : (
        <CardContent className="flex flex-1 flex-col items-center justify-center px-3.5 sm:px-4 mt-4">
          {isLoading ? (
            <Spinner className="size-12 text-neon-green-300" />
          ) : (
            <BarChart
              chartData={chartData}
              xAxisDataKey="date"
              barSize={30}
              barColors={{
                'weight training': workoutColors['weight training'],
              }}
              height={180}
            />
          )}
        </CardContent>
      )}
    </Card>
  );
}

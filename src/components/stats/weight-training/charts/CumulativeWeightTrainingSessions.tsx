'use client';

import { useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { RotateCcw as RetryIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import { LineChartComponent as LineChart } from '@/components/charts/LineChart';
import { useStats } from '@/contexts/StatsContext';
import { useWeightTrainings } from '@/hooks/useWeightTrainings';
import {
  sortByWorkoutDate,
  filterWorkoutsByDateRange,
} from '@/lib/workoutUtils';
import { workoutColors } from '@/lib/colors';

export default function CumulativeWeightTrainingSessions() {
  const { dateRange } = useStats();
  const { data: weightTrainings, isLoading, error } = useWeightTrainings();

  const queryClient = useQueryClient();

  const chartData = useMemo(() => {
    if (!weightTrainings) return;

    const weightTrainingsAsc = sortByWorkoutDate(weightTrainings, 'asc');
    const weightTrainingsWithinDateRange = filterWorkoutsByDateRange(
      weightTrainingsAsc,
      dateRange,
    );

    let gymSessionCount = 0;
    const cumulativeWeightTrainingSessionData = [];

    for (let weightTraining of weightTrainingsWithinDateRange) {
      gymSessionCount++;
      cumulativeWeightTrainingSessionData.push({
        date: format(new Date(weightTraining.created_at), 'MMM d'),
        'cumulative gym sessions': gymSessionCount,
      });
    }

    return cumulativeWeightTrainingSessionData;
  }, [weightTrainings, dateRange]);

  return (
    <Card className="w-full min-h-80 py-4 sm:py-5">
      <CardHeader className="px-4 sm:px-6">
        <CardTitle className="text-sm sm:text-md">
          Cumulative Weight Training Sessions
        </CardTitle>
      </CardHeader>

      {error ? (
        <CardContent className="flex flex-1 flex-col items-center justify-center px-3.5 sm:px-4">
          <p className="p-8 text-sm text-center text-red-500">
            Error loading cumulative weight training chart
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
        <CardContent className="flex flex-1 flex-col items-center justify-center px-3.5 sm:px-4">
          {isLoading ? (
            <Spinner className="size-12 text-neon-green-300" />
          ) : (
            <LineChart
              chartData={chartData}
              lineData={[
                {
                  key: 'cumulative gym sessions',
                  color: workoutColors['weight training'],
                },
              ]}
              xAxisDataKey="date"
            />
          )}
        </CardContent>
      )}
    </Card>
  );
}

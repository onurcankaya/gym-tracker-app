'use client';

import { useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { RotateCcw as RetryIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import { LineChartComponent as LineChart } from '@/components/charts/LineChart';
import { useRuns } from '@/hooks/useRuns';
import { sortByWorkoutDate } from '@/lib/workoutUtils';
import { Run } from '@/api/types/run';

export default function DistanceOverTime() {
  const { data: runs, isLoading, error } = useRuns();

  const queryClient = useQueryClient();

  const chartData = useMemo(() => {
    if (!runs) return;

    const runsAsc = sortByWorkoutDate(runs, 'asc') as Run[];

    return (
      runsAsc.map((run) => ({
        date: format(new Date(run.created_at), 'MMM d'),
        distance: run.distance,
      })) || []
    );
  }, [runs]);

  return (
    <Card className="w-full min-h-80 py-4 sm:py-5">
      <CardHeader className="px-4 sm:px-6">
        <CardTitle className="text-sm sm:text-md">Distance Over Time</CardTitle>
      </CardHeader>

      {error ? (
        <CardContent className="flex flex-1 flex-col items-center justify-center px-3.5 sm:px-4">
          <p className="p-8 text-sm text-center text-red-500">
            Error loading distance over time chart
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              queryClient.invalidateQueries({ queryKey: ['runs'] });
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
                { key: 'distance', color: 'var(--color-neon-green-300)' },
              ]}
              xAxisDataKey="date"
              yAxisUnit="km"
            />
          )}
        </CardContent>
      )}
    </Card>
  );
}

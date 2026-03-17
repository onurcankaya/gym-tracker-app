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
import { sortByWorkoutDate } from '@/lib/workoutUtils';
import { workoutColors } from '@/lib/colors';

export default function RunFrequency() {
  const { data: runs, isLoading, error } = useRuns();

  const queryClient = useQueryClient();

  const chartData = useMemo(() => {
    if (!runs) return;

    const runsAsc = sortByWorkoutDate(runs, 'asc');

    return (
      runsAsc.map((run) => {
        return {
          date: format(new Date(run.created_at), 'MMM d'),
          run: 1,
        };
      }) || []
    );
  }, [runs]);

  return (
    <Card className="w-full min-h-70 py-4 sm:py-5">
      <CardHeader className="px-4 sm:px-6">
        <CardTitle className="text-sm sm:text-md">Run Frequency</CardTitle>
      </CardHeader>

      {error ? (
        <CardContent className="flex flex-1 flex-col items-center justify-center px-3.5 sm:px-4">
          <p className="p-8 text-sm text-center text-red-500">
            Error loading run frequency chart
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              queryClient.invalidateQueries({
                queryKey: ['runs'],
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
                run: workoutColors['run'],
              }}
              height={180}
            />
          )}
        </CardContent>
      )}
    </Card>
  );
}

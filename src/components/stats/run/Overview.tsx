'use client';

import { useQueryClient } from '@tanstack/react-query';
import { RotateCcw as RetryIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import { useRunStats } from '@/hooks/useRuns';
import { formatMinutesToHours } from '@/lib/dateUtils';

export default function RunOverview() {
  const { data: runStats, isLoading, error } = useRunStats();

  const queryClient = useQueryClient();

  return (
    <Card className="w-full min-h-55 sm:min-h-60 max-h-fit py-4 sm:py-5">
      <CardHeader className="px-4 sm:px-5">
        <CardTitle className="text-sm sm:text-md">Overview</CardTitle>
      </CardHeader>

      {error ? (
        <CardContent className="flex flex-1 flex-col items-center justify-center px-3 sm:px-4">
          <p className="p-8 text-sm text-center text-red-500">
            Error loading run overview
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              queryClient.invalidateQueries({ queryKey: ['runStats'] });
            }}
          >
            <RetryIcon />
            Retry
          </Button>
        </CardContent>
      ) : (
        <CardContent className="flex flex-1 items-center justify-center px-3 sm:px-4">
          {isLoading ? (
            <Spinner className="size-12 text-neon-green-300" />
          ) : (
            <div className="w-full space-y-2 sm:space-y-3 px-0 sm:px-1">
              <div className="grid grid-cols-3 gap-2 sm:gap-3 md:grid-cols-3">
                <div className="flex flex-col gap-1 sm:gap-1.5 border rounded-lg px-3 sm:px-4 py-2 sm:py-3">
                  <p className="text-lg md:text-2xl text-neon-green-300 font-bold">
                    {runStats?.total_runs}
                  </p>
                  <p className="text-xs text-gray-400">Total runs</p>
                </div>
                <div className="flex flex-col gap-1 sm:gap-1.5 border rounded-lg px-3 sm:px-4 py-2 sm:py-3">
                  <p className="text-lg md:text-2xl text-neon-green-300 font-bold">
                    {runStats?.total_time &&
                      formatMinutesToHours(runStats.total_time)}
                  </p>
                  <p className="text-xs text-gray-400">Total time</p>
                </div>
                <div className="flex flex-col gap-1 sm:gap-1.5 border rounded-lg px-3 sm:px-4 py-2 sm:py-3">
                  <p className="text-lg md:text-2xl text-neon-green-300 font-bold">
                    {runStats?.avg_duration
                      ? parseFloat(runStats.avg_duration).toFixed(0)
                      : '0'}
                    m
                  </p>
                  <p className="text-xs text-gray-400">Avg time</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:gap-3 w-full">
                <div className="flex flex-col gap-1 sm:gap-1.5 border rounded-lg px-3 sm:px-4 py-2 sm:py-3">
                  <p className="text-lg md:text-2xl text-neon-green-300 font-bold">
                    {runStats?.total_distance
                      ? parseFloat(runStats.total_distance).toFixed(0)
                      : '0'}
                    km
                  </p>
                  <p className="text-xs text-gray-400">Total distance</p>
                </div>
                <div className="flex flex-col gap-1 sm:gap-1.5 border rounded-lg px-3 sm:px-4 py-2 sm:py-3">
                  <p className="text-lg md:text-2xl text-neon-green-300 font-bold">
                    {runStats?.avg_distance
                      ? parseFloat(runStats.avg_distance).toFixed(1)
                      : '0'}
                    km
                  </p>
                  <p className="text-xs text-gray-400">Avg distance</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}

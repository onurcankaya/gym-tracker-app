'use client';

import { useQueryClient } from '@tanstack/react-query';
import { RotateCcw as RetryIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import { useRunStats } from '@/hooks/useRuns';
import { formatMinutesToHours } from '@/lib/dateUtils';

export default function StatsPage() {
  const { data: runStats, isLoading, error } = useRunStats();

  const queryClient = useQueryClient();

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-sm md:max-w-md">
        <CardHeader className="px-4 sm:px-6">
          <CardTitle>Run Stats</CardTitle>
        </CardHeader>

        {error ? (
          <div className="w-full h-60 flex flex-col items-center justify-center">
            <p className="p-8 text-sm text-center text-red-500">
              Error loading run stats
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
          </div>
        ) : (
          <CardContent className="px-4 sm:px-6">
            {isLoading ? (
              <div className="w-full h-80 flex items-center justify-center">
                <Spinner className="size-12 text-neon-green-300" />
              </div>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-3 md:grid-cols-3">
                  <div className="flex flex-col gap-1.5 border rounded-lg px-4 py-3">
                    <p className="text-lg md:text-2xl text-neon-green-300 font-bold">
                      {runStats?.total_runs}
                    </p>
                    <p className="text-xs text-gray-400">Total runs</p>
                  </div>
                  <div className="flex flex-col gap-1.5 border rounded-lg px-4 py-3">
                    <p className="text-lg md:text-2xl text-neon-green-300 font-bold">
                      {runStats?.total_distance
                        ? parseFloat(runStats.total_distance).toFixed(0)
                        : '0'}
                      km
                    </p>
                    <p className="text-xs text-gray-400">Total distance</p>
                  </div>
                  <div className="flex flex-col gap-1.5 border rounded-lg px-4 py-3">
                    <p className="text-lg md:text-2xl text-neon-green-300 font-bold">
                      {runStats?.total_time &&
                        formatMinutesToHours(runStats.total_time)}
                    </p>
                    <p className="text-xs text-gray-400">Total time</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5 border rounded-lg px-4 py-3">
                    <p className="text-lg md:text-2xl text-neon-green-300 font-bold">
                      {runStats?.avg_distance
                        ? parseFloat(runStats.avg_distance).toFixed(1)
                        : '0'}
                      km
                    </p>
                    <p className="text-xs text-gray-400">Avg distance</p>
                  </div>
                  <div className="flex flex-col gap-1.5 border rounded-lg px-4 py-3">
                    <p className="text-lg md:text-2xl text-neon-green-300 font-bold">
                      {runStats?.avg_duration
                        ? parseFloat(runStats.avg_duration).toFixed(1)
                        : '0'}
                      m
                    </p>
                    <p className="text-xs text-gray-400">Avg duration</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        )}
      </Card>
    </div>
  );
}

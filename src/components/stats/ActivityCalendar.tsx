'use client';

import { useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { RotateCcw as RetryIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import { useStats } from '@/contexts/StatsContext';
import { useRuns } from '@/hooks/useRuns';
import { useWeightTrainings } from '@/hooks/useWeightTrainings';
import { WorkoutType } from '@/api/types';

export default function ActivityCalendar() {
  const { tab: variant } = useStats();
  const { data: runs, isLoading: isLoadingRuns, error: errorRuns } = useRuns();
  const {
    data: weightTrainings,
    isLoading: isLoadingWeightTrainings,
    error: errorWeightTrainings,
  } = useWeightTrainings();

  const queryClient = useQueryClient();

  return (
    <Card
      className="w-full min-h-70 py-4 sm:py-5"
      data-slot="activity-calendar-card"
    >
      <CardHeader className="px-4 sm:px-6">
        <CardTitle className="text-sm sm:text-md">Activity Calendar</CardTitle>
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
            <>
              <Calendar
                mode="single"
                className="w-full"
                dataSlot="activity-calendar"
                components={{
                  DayButton: ({ day, ...props }) => {
                    const dateStr = format(day.date, 'yyyy-MM-dd');
                    const hasRun =
                      (variant === WorkoutType.ALL ||
                        variant === WorkoutType.RUN) &&
                      runs?.some(
                        (run) =>
                          format(run.created_at, 'yyyy-MM-dd') === dateStr,
                      );
                    const hasWeightTraining =
                      (variant === WorkoutType.ALL ||
                        variant === WorkoutType.WEIGHT_TRAINING) &&
                      weightTrainings?.some(
                        (weightTraining) =>
                          format(weightTraining.created_at, 'yyyy-MM-dd') ===
                          dateStr,
                      );

                    return (
                      <button {...props} className="relative w-[40px] h-[40px]">
                        <span>{day.date.getDate()}</span>
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-0.5">
                          {hasRun && (
                            <div className="w-1.25 h-1.25 rounded-full bg-run" />
                          )}
                          {hasWeightTraining && (
                            <div className="w-1.25 h-1.25 rounded-full bg-weight-training" />
                          )}
                        </div>
                      </button>
                    );
                  },
                }}
              />

              <div className="flex gap-3 mt-2 mb-1">
                {(variant === WorkoutType.ALL ||
                  variant === WorkoutType.RUN) && (
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-run" />
                    <p className="text-xs text-run">Run</p>
                  </div>
                )}
                {(variant === WorkoutType.ALL ||
                  variant === WorkoutType.WEIGHT_TRAINING) && (
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-weight-training" />
                    <p className="text-xs text-weight-training">
                      Weight training
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </CardContent>
      )}
    </Card>
  );
}

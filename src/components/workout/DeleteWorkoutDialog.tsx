'use client';

import { useState } from 'react';
import DeleteDialog from '@/components/common/DeleteDialog';
import { useDeleteRun } from '@/hooks/useRuns';
import { useDeleteWeightTraining } from '@/hooks/useWeightTraining';
import { WorkoutType, Workout } from '@/api/types';

type WorkoutCardProps = {
  workout: Workout;
};

export default function DeleteWorkoutDialog({ workout }: WorkoutCardProps) {
  const [open, setOpen] = useState(false);

  const deleteRun = useDeleteRun();
  const deleteWeightTraining = useDeleteWeightTraining();

  function handleDeleteWorkout() {
    if (workout.type === WorkoutType.RUN) {
      deleteRun.mutate(workout.id, {
        onSuccess: () => {
          setOpen(false);
        },
      });
    } else if (workout.type === WorkoutType.WEIGHT_TRAINING) {
      deleteWeightTraining.mutate(workout.id, {
        onSuccess: () => {
          setOpen(false);
        },
      });
    }
  }

  return (
    <DeleteDialog
      open={open}
      setOpen={setOpen}
      title={`Delete ${workout.type}?`}
      onCancel={() => setOpen(false)}
      onDelete={handleDeleteWorkout}
      isLoading={deleteRun.isPending || deleteWeightTraining.isPending}
    />
  );
}

'use client';

import { useState, useMemo } from 'react';
import { Trash2 as TrashIcon, Loader } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
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

  function handleDeleteWorkout(type: WorkoutType, id: string) {
    if (type === WorkoutType.RUN) {
      deleteRun.mutate(id, {
        onSuccess: () => {
          setOpen(false);
        },
      });
    } else if (type === WorkoutType.WEIGHT_TRAINING) {
      deleteWeightTraining.mutate(id, {
        onSuccess: () => {
          setOpen(false);
        },
      });
    }
  }

  const deleteButtonLabel = useMemo(() => {
    return deleteRun.isPending || deleteWeightTraining.isPending ? (
      <Spinner icon={Loader} className="text-white" />
    ) : (
      'Delete'
    );
  }, [deleteRun.isPending, deleteWeightTraining.isPending]);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon" className="size-8">
          <TrashIcon />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {workout.type}?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={() => handleDeleteWorkout(workout.type, workout.id)}
          >
            {deleteButtonLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

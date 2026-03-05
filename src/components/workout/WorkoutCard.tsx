'use client';

import { capitalize } from 'lodash';
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
import { Badge } from '@/components/ui/badge';
import { Trash2 as TrashIcon } from 'lucide-react';
import EditWorkoutDialog from '@/components/workout/EditWorkoutDialog';
import { useDeleteRun } from '@/hooks/useRuns';
import { useDeleteWeightTraining } from '@/hooks/useWeightTraining';
import { WorkoutType, Workout } from '@/api/types';

type WorkoutCardProps = {
  workout: Workout;
};

export default function WorkoutCard({ workout }: WorkoutCardProps) {
  const deleteRun = useDeleteRun();
  const deleteWeightTraining = useDeleteWeightTraining();

  function handleDeleteWorkout(type: WorkoutType, id: string) {
    if (type === WorkoutType.RUN) {
      deleteRun.mutate(id);
    } else if (type === WorkoutType.WEIGHT_TRAINING) {
      deleteWeightTraining.mutate(id);
    }
  }

  return (
    <div className="border rounded-md p-4 hover:border-neon-green-300 transition-colors">
      <div className="flex justify-between items-start gap-2">
        <div>
          <p className="text-xs text-gray-400 mb-3">
            {new Date(workout.created_at).toLocaleDateString('en-DK')}
          </p>

          <Badge
            variant="outline"
            className="w-fit block border border-neon-green-300 mb-3"
          >
            <p className="text-sm text-center">{capitalize(workout.type)}</p>
          </Badge>

          {workout.type === WorkoutType.RUN && (
            <div className="flex items-center gap-2">
              <span className="text-sm">
                {workout.distance}
                {workout.distance_unit}
              </span>

              <span className="text-sm">•</span>

              <span className="text-xs">{`${workout.duration_minutes} min`}</span>
            </div>
          )}

          {workout.type === WorkoutType.WEIGHT_TRAINING && (
            <div className="flex items-start sm:items-center gap-2">
              <div className="flex items-center gap-1 flex-wrap">
                {workout.muscle_groups.map((muscleGroup, index) => (
                  <Badge key={index} variant="outline">
                    {capitalize(muscleGroup)}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <span>
            {workout.notes && (
              <p className="text-xs text-gray-500 mt-2">{workout.notes}</p>
            )}
          </span>
        </div>
        <div className="flex gap-1">
          <EditWorkoutDialog workout={workout} />

          <AlertDialog>
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
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}

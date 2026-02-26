'use client';

import { Button } from '@/components/ui/button';
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
import { Trash2 as TrashIcon } from 'lucide-react';
import EditWorkoutDialog from '@/components/workout/EditWorkoutDialog';
import { useDeleteWorkout } from '@/hooks/useWorkouts';
import type { Workout } from '@/api/types/workout';

type WorkoutCardProps = {
  workout: Workout;
};

export default function WorkoutCard({ workout }: WorkoutCardProps) {
  const deleteWorkout = useDeleteWorkout();

  function handleDeleteWorkout(id: string) {
    deleteWorkout.mutate(id);
  }

  return (
    <div className="border rounded-md p-4">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs text-gray-500 mb-2">
            {new Date(workout.created_at).toLocaleDateString('en-DK')}
          </p>
          <span>{workout.type}</span>
          <span>{` - ${workout.duration_minutes} min`}</span>

          <span>
            {workout.notes && (
              <p className="text-sm text-gray-500 mt-2">{workout.notes}</p>
            )}
          </span>
        </div>
        <div>
          <EditWorkoutDialog workout={workout} />

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon" className="ml-1">
                <TrashIcon />
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete workout?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  variant="destructive"
                  onClick={() => handleDeleteWorkout(workout.id)}
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

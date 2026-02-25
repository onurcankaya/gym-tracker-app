'use client';

import { useState } from 'react';
import {
  useWorkouts,
  useCreateWorkout,
  useDeleteWorkout,
} from '@/hooks/useWorkouts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2 as TrashIcon } from 'lucide-react';

export default function Home() {
  const [type, setType] = useState('');
  const [duration, setDuration] = useState('');
  const [notes, setNotes] = useState('');

  const { data: workouts, isLoading, error } = useWorkouts();
  const createWorkout = useCreateWorkout();
  const deleteWorkout = useDeleteWorkout();

  function handleCreateWorkout() {
    createWorkout.mutate(
      { type, duration_minutes: parseInt(duration), notes },
      {
        onSuccess: () => {
          setType('');
          setDuration('');
          setNotes('');
        },
      },
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    handleCreateWorkout();
  }

  function handleDeleteWorkout(id: string) {
    deleteWorkout.mutate(id);
  }

  if (isLoading) return <div className="p-8 text-center">Loading...</div>;
  if (error)
    return (
      <div className="p-8 text-center text-red-600">Error loading workouts</div>
    );

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Log Workout</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="text"
                placeholder="Workout type (Gym, Run, Yoga...)"
                value={type}
                onChange={(e) => setType(e.target.value)}
                required
              />
            </div>
            <div>
              <Input
                type="number"
                placeholder="Duration (minutes)"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                required
              />
            </div>
            <div>
              <Textarea
                placeholder="Notes (optional)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <Button
              type="submit"
              variant="default"
              disabled={createWorkout.isPending}
              className="w-full bg-neon-green-300 hover:bg-neon-green-400 text-black"
            >
              {createWorkout.isPending ? 'Logging workout...' : 'Log workout'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Workouts</CardTitle>
        </CardHeader>

        <CardContent className="space-y-8">
          {workouts?.map((workout) => (
            <div key={workout.id} className="border rounded-md p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs text-gray-500 mb-2">
                    {new Date(workout.created_at).toLocaleDateString('en-DK')}
                  </p>
                  <span>{workout.type}</span>
                  <span>{` - ${workout.duration_minutes} min`}</span>

                  <span>
                    {workout.notes && (
                      <p className="text-sm text-gray-500 mt-2">
                        {workout.notes}
                      </p>
                    )}
                  </span>
                </div>
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
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

'use client';

import { useState, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import DatePicker from '@/components/common/DatePicker';
import { Pencil as PencilIcon } from 'lucide-react';
import { useUpdateWorkout } from '@/hooks/useWorkouts';
import { Workout } from '@/api/types/workout';

type EditWorkoutDialogProps = {
  workout: Workout;
};

export default function EditWorkoutDialog({ workout }: EditWorkoutDialogProps) {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState(workout.type);
  const [duration, setDuration] = useState(workout.duration_minutes);
  const [notes, setNotes] = useState(workout.notes || '');
  const [createdAt, setCreatedAt] = useState(workout.created_at);

  const updateWorkout = useUpdateWorkout();

  function handleUpdateWorkout() {
    updateWorkout.mutate(
      {
        id: workout.id,
        data: {
          type,
          duration_minutes: duration,
          notes,
          created_at: createdAt,
        },
      },
      {
        onSuccess: () => {
          setOpen(false);
        },
      },
    );
  }

  const isSaveButtonDisabled = useMemo(() => {
    return updateWorkout.isPending || type.length === 0 || duration <= 0;
  }, [type, duration, updateWorkout.isPending]);

  const saveButtonLabel = useMemo(() => {
    return updateWorkout.isPending ? 'Saving changes...' : 'Save changes';
  }, [updateWorkout.isPending]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="ml-1">
          <PencilIcon />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit workout</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 my-6">
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
              onChange={(e) => setDuration(parseInt(e.target.value))}
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
          <div>
            <DatePicker date={createdAt} setDate={setCreatedAt} />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="default"
            disabled={isSaveButtonDisabled}
            onClick={handleUpdateWorkout}
            className="bg-neon-green-300 hover:bg-neon-green-400 text-black"
          >
            {saveButtonLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

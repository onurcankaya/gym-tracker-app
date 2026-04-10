'use client';

import { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { Pencil as PencilIcon, Loader } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { InputWithToggle } from '@/components/common/InputWithToggle';
import { InputWithSuffix } from '@/components/common/InputWithSuffix';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { DatePicker } from '@/components/common/DatePicker';
import { useUpdateRun } from '@/hooks/useRuns';
import { useUpdateWeightTraining } from '@/hooks/useWeightTrainings';
import { WorkoutType, Workout } from '@/api/types';
import { DistanceUnit } from '@/api/types/run';
import { MuscleGroup } from '@/api/types/weightTraining';

type EditWorkoutDialogProps = {
  workout: Workout;
};

export default function EditWorkoutDialog({ workout }: EditWorkoutDialogProps) {
  const [open, setOpen] = useState(false);
  const [distance, setDistance] = useState(
    workout.type === WorkoutType.RUN ? workout.distance : '',
  );
  const [distanceUnit, setDistanceUnit] = useState<DistanceUnit>(
    workout.type === WorkoutType.RUN ? workout.distance_unit : DistanceUnit.KM,
  );
  const [muscleGroups, setMuscleGroups] = useState<MuscleGroup[]>(
    workout.type === WorkoutType.WEIGHT_TRAINING ? workout.muscle_groups : [],
  );
  const [duration, setDuration] = useState(workout.duration_minutes);
  const [notes, setNotes] = useState(workout.notes || '');
  const [createdAt, setCreatedAt] = useState(new Date(workout.created_at));

  const updateRun = useUpdateRun();
  const updateWeightTraining = useUpdateWeightTraining();

  function handleUpdateWorkout() {
    const formattedDate = format(createdAt, 'yyyy-MM-dd');

    if (workout.type === WorkoutType.RUN) {
      updateRun.mutate(
        {
          id: workout.id,
          data: {
            distance:
              typeof distance === 'string' ? parseFloat(distance) : distance,
            distance_unit: distanceUnit,
            duration_minutes: duration,
            notes,
            created_at: formattedDate,
          },
        },
        {
          onSuccess: () => {
            setOpen(false);
          },
        },
      );
    } else if (workout.type === WorkoutType.WEIGHT_TRAINING) {
      updateWeightTraining.mutate(
        {
          id: workout.id,
          data: {
            muscle_groups: muscleGroups,
            duration_minutes: duration,
            notes,
            created_at: formattedDate,
          },
        },
        {
          onSuccess: () => {
            setOpen(false);
          },
        },
      );
    }
  }

  const distanceUnitOptions = Object.values(DistanceUnit).map((unit) => ({
    label: unit,
    value: unit,
  }));

  const muscleGroupOptions = Object.values(MuscleGroup).map((group) => ({
    label: group.charAt(0).toUpperCase() + group.slice(1),
    value: group,
  }));

  const isSaveButtonDisabled = useMemo(() => {
    return (
      updateRun.isPending || updateWeightTraining.isPending || duration <= 0
    );
  }, [updateRun.isPending, updateWeightTraining.isPending, duration]);

  const saveButtonLabel = useMemo(() => {
    return updateRun.isPending || updateWeightTraining.isPending ? (
      <Spinner icon={Loader} className="text-black" />
    ) : (
      'Save changes'
    );
  }, [updateRun.isPending, updateWeightTraining.isPending]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="size-8">
          <PencilIcon />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit {workout.type}</DialogTitle>
          <DialogDescription>Save changes to update workout</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 my-4">
          {workout.type === WorkoutType.RUN && (
            <InputWithToggle
              type="number"
              step="0.1"
              placeholder="Distance"
              value={distance}
              onChange={setDistance}
              toggleValue={distanceUnit}
              onToggleChange={(value) => setDistanceUnit(value as DistanceUnit)}
              toggleOptions={distanceUnitOptions}
            />
          )}

          {workout.type === WorkoutType.WEIGHT_TRAINING && (
            <Select
              multiSelect
              placeholder="Select muscle groups"
              options={muscleGroupOptions}
              selected={muscleGroups}
              onChange={(selected) =>
                setMuscleGroups(selected as MuscleGroup[])
              }
            />
          )}

          <InputWithSuffix
            type="number"
            placeholder="Duration"
            value={duration}
            suffix="min"
            onChange={(e) => setDuration(parseInt(e.target.value))}
            min={0}
            required
          />

          <Textarea
            placeholder="Notes (optional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          <DatePicker date={createdAt} setDate={setCreatedAt} />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={isSaveButtonDisabled}
            onClick={handleUpdateWorkout}
          >
            {saveButtonLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

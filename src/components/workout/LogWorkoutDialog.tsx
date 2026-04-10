'use client';

import { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { Loader, Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { InputWithToggle } from '@/components/common/InputWithToggle';
import { InputWithSuffix } from '@/components/common/InputWithSuffix';
import { DatePicker } from '@/components/common/DatePicker';
import { useCreateRun } from '@/hooks/useRuns';
import { useCreateWeightTraining } from '@/hooks/useWeightTrainings';
import { WorkoutType } from '@/api/types';
import { DistanceUnit } from '@/api/types/run';
import { MuscleGroup } from '@/api/types/weightTraining';

export default function WorkoutForm() {
  const [open, setOpen] = useState(false);
  const [workoutType, setWorkoutType] = useState<WorkoutType>(WorkoutType.RUN);
  const [distance, setDistance] = useState('');
  const [distanceUnit, setDistanceUnit] = useState<DistanceUnit>(
    DistanceUnit.KM,
  );
  const [muscleGroups, setMuscleGroups] = useState<MuscleGroup[]>([]);
  const [duration, setDuration] = useState('');
  const [notes, setNotes] = useState('');
  const [createdAt, setCreatedAt] = useState(new Date());

  const createRun = useCreateRun();
  const createWeightTraining = useCreateWeightTraining();

  function handleCreateWorkout() {
    const formattedDate = format(createdAt, 'yyyy-MM-dd');

    if (workoutType === WorkoutType.RUN) {
      createRun.mutate(
        {
          distance:
            typeof distance === 'string' ? parseFloat(distance) : distance,
          distance_unit: distanceUnit,
          duration_minutes:
            typeof duration === 'string' ? parseInt(duration) : duration,
          notes,
          created_at: formattedDate,
        },
        {
          onSuccess: () => {
            resetState();
          },
        },
      );
    } else if (workoutType === WorkoutType.WEIGHT_TRAINING) {
      createWeightTraining.mutate(
        {
          muscle_groups: muscleGroups,
          duration_minutes:
            typeof duration === 'string' ? parseInt(duration) : duration,
          notes,
          created_at: formattedDate,
        },
        {
          onSuccess: () => {
            resetState();
          },
        },
      );
    }
  }

  function resetState() {
    setDistance('');
    setDistanceUnit(DistanceUnit.KM);
    setMuscleGroups([]);
    setDuration('');
    setNotes('');
    setCreatedAt(new Date());
    setWorkoutType(WorkoutType.RUN);
    setOpen(false);
  }

  function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    handleCreateWorkout();
  }

  const distanceUnitOptions = Object.values(DistanceUnit).map((unit) => ({
    label: unit,
    value: unit,
  }));

  const muscleGroupOptions = Object.values(MuscleGroup).map((group) => ({
    label: group.charAt(0).toUpperCase() + group.slice(1),
    value: group,
  }));

  const isSubmitButtonDisabled = useMemo(() => {
    return createRun.isPending || createWeightTraining.isPending;
  }, [createRun.isPending, createWeightTraining.isPending]);

  const submitButtonLabel = useMemo(() => {
    if (createRun.isPending || createWeightTraining.isPending) {
      return <Spinner icon={Loader} className="text-black" />;
    } else if (workoutType === WorkoutType.RUN) {
      return 'Log run';
    } else if (workoutType === WorkoutType.WEIGHT_TRAINING)
      return 'Log weight training';
  }, [workoutType, createRun.isPending, createWeightTraining.isPending]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="primary" className="w-32 h-7 rounded-sm">
          <Plus />
          <p className="text-sm">Log workout</p>
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Log {workoutType}</DialogTitle>
          <DialogDescription>
            Add details below to save your workout
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <Tabs
            value={workoutType}
            onValueChange={(value) => setWorkoutType(value as WorkoutType)}
            className="block"
          >
            <TabsList className="gap-2">
              <TabsTrigger value={WorkoutType.RUN}>Run</TabsTrigger>
              <TabsTrigger value={WorkoutType.WEIGHT_TRAINING}>
                Weight Training
              </TabsTrigger>
            </TabsList>
            <TabsContent value={WorkoutType.RUN} className="mt-4 space-y-4">
              <InputWithToggle
                type="number"
                step="0.5"
                placeholder="Distance"
                value={distance}
                onChange={setDistance}
                toggleValue={distanceUnit}
                onToggleChange={(value) =>
                  setDistanceUnit(value as DistanceUnit)
                }
                toggleOptions={distanceUnitOptions}
              />
            </TabsContent>
            <TabsContent
              value={WorkoutType.WEIGHT_TRAINING}
              className="mt-4 space-y-4"
            >
              <Select
                multiSelect
                placeholder="Select muscle groups"
                options={muscleGroupOptions}
                selected={muscleGroups}
                onChange={(selected) =>
                  setMuscleGroups(selected as MuscleGroup[])
                }
              />
            </TabsContent>
          </Tabs>

          <div>
            <InputWithSuffix
              type="number"
              placeholder="Duration"
              value={duration}
              suffix="min"
              onChange={(e) => setDuration(e.target.value)}
              min={0}
              required
            />
          </div>
          <div>
            <DatePicker date={createdAt} setDate={setCreatedAt} />
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
            variant="primary"
            disabled={isSubmitButtonDisabled}
            className="w-full"
          >
            {submitButtonLabel}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

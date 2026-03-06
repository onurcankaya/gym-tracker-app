'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { InputWithToggle } from '@/components/ui/input-with-toggle';
import { InputWithSuffix } from '@/components/ui/input-with-suffix';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { DatePicker } from '@/components/common/DatePicker';
import { useCreateRun } from '@/hooks/useRuns';
import { useCreateWeightTraining } from '@/hooks/useWeightTraining';
import { WorkoutType } from '@/api/types';
import { DistanceUnit } from '@/api/types/run';
import { MuscleGroup } from '@/api/types/weightTraining';

export default function WorkoutForm() {
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
    if (workoutType === WorkoutType.RUN) {
      createRun.mutate(
        {
          distance:
            typeof distance === 'string' ? parseInt(distance) : distance,
          distance_unit: distanceUnit,
          duration_minutes:
            typeof duration === 'string' ? parseInt(duration) : duration,
          notes,
          created_at: createdAt,
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
          created_at: createdAt,
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
  }

  function handleSubmit(e: React.FormEvent) {
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
    if (createRun.isPending) {
      return 'Logging run...';
    } else if (createWeightTraining.isPending) {
      return 'Logging weight training...';
    }
    return workoutType === WorkoutType.RUN ? 'Log run' : 'Log weight training';
  }, [workoutType, createRun.isPending, createWeightTraining.isPending]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Log Workout</CardTitle>
      </CardHeader>

      <CardContent className="px-4 sm:px-6">
        <form onSubmit={handleSubmit} className="space-y-4">
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
      </CardContent>
    </Card>
  );
}

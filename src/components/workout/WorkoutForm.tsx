'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { InputWithSuffix } from '@/components/ui/input-with-suffix';
import { Textarea } from '@/components/ui/textarea';
import DatePicker from '@/components/common/DatePicker';
import { useCreateWorkout } from '@/hooks/useWorkouts';

export default function WorkoutForm() {
  const [type, setType] = useState('');
  const [duration, setDuration] = useState('');
  const [notes, setNotes] = useState('');
  const [createdAt, setCreatedAt] = useState(new Date());

  const createWorkout = useCreateWorkout();

  function handleCreateWorkout() {
    createWorkout.mutate(
      {
        type,
        duration_minutes: parseInt(duration),
        notes,
        created_at: createdAt,
      },
      {
        onSuccess: () => {
          setType('');
          setDuration('');
          setNotes('');
          setCreatedAt(new Date());
        },
      },
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    handleCreateWorkout();
  }

  return (
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
        <DatePicker date={createdAt} setDate={setCreatedAt} />
      </div>
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
  );
}

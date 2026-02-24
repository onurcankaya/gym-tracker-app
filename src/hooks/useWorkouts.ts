import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { workoutClient } from '@/api/client/workoutClient';

export function useWorkouts() {
  return useQuery({
    queryKey: ['workouts'],
    queryFn: workoutClient.getAll,
  });
}

export function useCreateWorkout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: workoutClient.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workouts'] });
    },
  });
}

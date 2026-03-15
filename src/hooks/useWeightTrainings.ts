import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { weightTrainingClient } from '@/api/client/weightTrainingClient';
import { toast } from 'sonner';

export function useWeightTrainings() {
  return useQuery({
    queryKey: ['weightTrainings'],
    queryFn: weightTrainingClient.getAll,
  });
}

export function useCreateWeightTraining() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: weightTrainingClient.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weightTrainings'] });
      toast.success('Workout created');
    },
    onError: () => {
      toast.error('Failed to create workout');
    },
  });
}

export function useDeleteWeightTraining() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: weightTrainingClient.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weightTrainings'] });
      toast.success('Workout deleted');
    },
    onError: () => {
      toast.error('Failed to delete workout');
    },
  });
}

export function useUpdateWeightTraining() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: weightTrainingClient.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weightTrainings'] });
      toast.success('Workout updated');
    },
    onError: () => {
      toast.error('Failed to update workout');
    },
  });
}

export function useWeightTrainingStats() {
  return useQuery({
    queryKey: ['weightTrainingStats'],
    queryFn: weightTrainingClient.getStats,
  });
}

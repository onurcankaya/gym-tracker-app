import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { weightTrainingClient } from '@/api/client/weightTrainingClient';

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
    },
  });
}

export function useDeleteWeightTraining() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: weightTrainingClient.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weightTrainings'] });
    },
  });
}

export function useUpdateWeightTraining() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: weightTrainingClient.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weightTrainings'] });
    },
  });
}

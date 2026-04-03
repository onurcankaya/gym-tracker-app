import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { weightTrainingClient } from '@/api/client/weightTrainingClient';
import { toast } from 'sonner';
import { DateRange } from 'react-day-picker';

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
      toast.success('Weight training created');
    },
    onError: () => {
      toast.error('Failed to create weight training');
    },
  });
}

export function useDeleteWeightTraining() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: weightTrainingClient.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weightTrainings'] });
      toast.success('Weight training deleted');
    },
    onError: () => {
      toast.error('Failed to delete weight training');
    },
  });
}

export function useUpdateWeightTraining() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: weightTrainingClient.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weightTrainings'] });
      toast.success('Weight training updated');
    },
    onError: () => {
      toast.error('Failed to update weight training');
    },
  });
}

export function useWeightTrainingStats(dateRange: DateRange) {
  return useQuery({
    queryKey: ['weightTrainingStats', dateRange],
    queryFn: () => weightTrainingClient.getStats(dateRange),
  });
}

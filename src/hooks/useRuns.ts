import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { runClient } from '@/api/client/runClient';
import { toast } from 'sonner';

export function useRuns() {
  return useQuery({
    queryKey: ['runs'],
    queryFn: runClient.getAll,
  });
}

export function useCreateRun() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: runClient.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['runs'] });
      toast.success('Workout created');
    },
    onError: () => {
      toast.error('Failed to create workout');
    },
  });
}

export function useDeleteRun() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: runClient.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['runs'] });
      toast.success('Workout deleted');
    },
    onError: () => {
      toast.error('Failed to delete workout');
    },
  });
}

export function useUpdateRun() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: runClient.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['runs'] });
      toast.success('Workout updated');
    },
    onError: () => {
      toast.error('Failed to update workout');
    },
  });
}

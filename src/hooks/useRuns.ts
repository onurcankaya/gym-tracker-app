import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { DateRange } from 'react-day-picker';
import { runClient } from '@/api/client/runClient';

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
      toast.success('Run created');
    },
    onError: () => {
      toast.error('Failed to create run');
    },
  });
}

export function useDeleteRun() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: runClient.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['runs'] });
      toast.success('Run deleted');
    },
    onError: () => {
      toast.error('Failed to delete run');
    },
  });
}

export function useUpdateRun() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: runClient.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['runs'] });
      toast.success('Run updated');
    },
    onError: () => {
      toast.error('Failed to update run');
    },
  });
}

export function useRunStats(dateRange: DateRange) {
  return useQuery({
    queryKey: ['runStats', dateRange],
    queryFn: () => runClient.getStats(dateRange),
  });
}

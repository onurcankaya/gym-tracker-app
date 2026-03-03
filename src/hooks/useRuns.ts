import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
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
    },
  });
}

export function useDeleteRun() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: runClient.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['runs'] });
    },
  });
}

export function useUpdateRun() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: runClient.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['runs'] });
    },
  });
}

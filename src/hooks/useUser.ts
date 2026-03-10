import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { userClient } from '@/api/client/userClient';
import { toast } from 'sonner';

export function useGetUser(userId: string) {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => userClient.get({ id: userId }),
    enabled: !!userId,
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userClient.update,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['user', variables.id] });
      toast.success('Profile updated');
    },
    onError: () => {
      toast.error('Failed to update profile');
    },
  });
}

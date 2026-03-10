import { User, UpdateUserDTO } from '@/api/types/user';

const BASE_URL = '/api';
const USERS_URL = `${BASE_URL}/users`;

export const userClient = {
  get: async ({ id }: { id: string }): Promise<User> => {
    const response = await fetch(`${USERS_URL}/${id}`);

    if (!response.ok) throw new Error('Failed to fetch user');

    return response.json();
  },

  update: async ({
    id,
    data,
  }: {
    id: string;
    data: UpdateUserDTO;
  }): Promise<User> => {
    const response = await fetch(`${USERS_URL}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error('Failed to update user');

    return response.json();
  },
};

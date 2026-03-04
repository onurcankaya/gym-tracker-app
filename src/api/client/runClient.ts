import { Run, CreateRunDTO, UpdateRunDTO } from '@/api/types/run';

const BASE_URL = '/api';
const RUNS_URL = `${BASE_URL}/runs`;

export const runClient = {
  getAll: async (): Promise<Run[]> => {
    const response = await fetch(RUNS_URL);

    if (!response.ok) throw new Error('Failed to fetch runs');

    return response.json();
  },

  create: async (data: CreateRunDTO): Promise<Run> => {
    const response = await fetch(RUNS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error('Failed to create run');

    return response.json();
  },

  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${RUNS_URL}/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) throw new Error('Failed to delete run');
  },

  update: async ({
    id,
    data,
  }: {
    id: string;
    data: UpdateRunDTO;
  }): Promise<Run> => {
    const response = await fetch(`${RUNS_URL}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error('Failed to update run');

    return response.json();
  },
};

import {
  WeightTraining,
  CreateWeightTrainingDTO,
  UpdateWeightTrainingDTO,
  WeightTrainingStats,
} from '@/api/types/weightTraining';

const BASE_URL = '/api';
const WEIGHT_TRAININGS_URL = `${BASE_URL}/weight-trainings`;
const WEIGHT_TRAININGS_STATS_URL = `${BASE_URL}/weight-trainings/stats`;

export const weightTrainingClient = {
  getAll: async (): Promise<WeightTraining[]> => {
    const response = await fetch(WEIGHT_TRAININGS_URL);

    if (!response.ok) throw new Error('Failed to fetch weight trainings');

    return response.json();
  },

  create: async (data: CreateWeightTrainingDTO): Promise<WeightTraining> => {
    const response = await fetch(WEIGHT_TRAININGS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error('Failed to create weight training');

    return response.json();
  },

  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${WEIGHT_TRAININGS_URL}/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) throw new Error('Failed to delete weight training');
  },

  update: async ({
    id,
    data,
  }: {
    id: string;
    data: UpdateWeightTrainingDTO;
  }): Promise<WeightTraining> => {
    const response = await fetch(`${WEIGHT_TRAININGS_URL}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error('Failed to update weight training');

    return response.json();
  },

  getStats: async (): Promise<WeightTrainingStats> => {
    const response = await fetch(WEIGHT_TRAININGS_STATS_URL);

    if (!response.ok) throw new Error('Failed to fetch weight training stats');

    return response.json();
  },
};

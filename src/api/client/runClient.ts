import { format } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { DATE_FORMAT } from '@/lib/dateUtils';
import { Run, CreateRunDTO, UpdateRunDTO, RunStats } from '@/api/types/run';

const BASE_URL = '/api';
const RUNS_URL = `${BASE_URL}/runs`;
const RUN_STATS_URL = `${BASE_URL}/runs/stats`;

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

  getStats: async (dateRange: DateRange): Promise<RunStats> => {
    const fromDate = format(dateRange.from!, DATE_FORMAT.DATE_STRING);
    const toDate = format(dateRange.to!, DATE_FORMAT.DATE_STRING);

    if (!fromDate && !toDate) throw new Error('Invalid date range');

    const url = `${RUN_STATS_URL}?fromDate=${fromDate}&toDate=${toDate}`;

    const response = await fetch(url);

    if (!response.ok) throw new Error('Failed to fetch run stats');

    return response.json();
  },
};

'use client';

import Overview from '@/components/stats/runs/Overview';
import DistanceOverTime from '@/components/stats/runs/charts/DistanceOverTime';

export default function StatsPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="min-w-90 max-w-sm sm:min-w-md flex flex-col items-center gap-4">
        <Overview />
        <DistanceOverTime />
      </div>
    </div>
  );
}

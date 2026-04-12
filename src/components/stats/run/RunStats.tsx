'use client';

import ActivityCalendar from '@/components/stats/ActivityCalendar';
import RunOverview from '@/components/stats/run/RunOverview';
import RunFrequency from '@/components/stats/run/charts/RunFrequency';
import DistanceOverTime from '@/components/stats/run/charts/DistanceOverTime';
import CumulativeDistance from '@/components/stats/run/charts/CumulativeDistance';

export default function RunStats() {
  return (
    <>
      <RunOverview />
      <ActivityCalendar />
      <RunFrequency />
      <DistanceOverTime />
      <CumulativeDistance />
    </>
  );
}

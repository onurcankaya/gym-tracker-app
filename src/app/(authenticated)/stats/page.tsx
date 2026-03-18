'use client';

import { useState, useMemo } from 'react';
import { startCase } from 'lodash';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import ActivityCalendar from '@/components/stats/ActivityCalendar';
import WorkoutOverview from '@/components/stats/workout/WorkoutOverview';
import WorkoutFrequency from '@/components/stats/workout/charts/WorkoutFrequency';
import CumulativeWorkouts from '@/components/stats/workout/charts/CumulativeWorkouts';
import RunOverview from '@/components/stats/run/Overview';
import RunFrequency from '@/components/stats/run/charts/RunFrequency';
import DistanceOverTime from '@/components/stats/run/charts/DistanceOverTime';
import CumulativeRuns from '@/components/stats/run/charts/CumulativeRuns';
import CumulativeDistance from '@/components/stats/run/charts/CumulativeDistance';
import WeightTrainingOverview from '@/components/stats/weight-training/Overview';
import WeightTrainingFrequency from '@/components/stats/weight-training/charts/WeightTrainingFrequency';
import CumulativeWeightTrainingSessions from '@/components/stats/weight-training/charts/CumulativeWeightTrainingSessions';
import MuscleGroupsOverTime from '@/components/stats/weight-training/charts/MuscleGroupsOverTime';
import { WorkoutType } from '@/api/types';

export default function StatsPage() {
  const [tab, setTab] = useState(WorkoutType.ALL);

  const title = useMemo(() => {
    if (tab === WorkoutType.ALL) return 'Workout Stats';
    return `${startCase(tab)} Stats`;
  }, [tab]);

  return (
    <div className="flex min-h-screen items-center justify-center p-4 pt-[80px]">
      <div className="min-w-90 max-w-sm sm:min-w-lg">
        <Card className="px-2 py-4 sm:py-5">
          <Tabs
            value={tab}
            onValueChange={(value) => setTab(value as WorkoutType)}
          >
            <CardHeader className="px-3.5 sm:px-5 mb-0 sm:mb-1">
              <div className="flex items-center justify-between sm:flex-row">
                <CardTitle className="hidden sm:block text-md">
                  {title}
                </CardTitle>
                <CardTitle className="block sm:hidden text-md">Stats</CardTitle>

                <TabsList className="gap-2 sm:w-auto sm:my-0">
                  <TabsTrigger value={WorkoutType.ALL}>All</TabsTrigger>
                  <TabsTrigger value={WorkoutType.RUN}>Runs</TabsTrigger>
                  <TabsTrigger value={WorkoutType.WEIGHT_TRAINING}>
                    Weight Training
                  </TabsTrigger>
                </TabsList>
              </div>
            </CardHeader>

            <CardContent className="px-2 sm:px-4">
              <TabsContent
                value={WorkoutType.ALL}
                className="space-y-4 sm:space-y-6"
              >
                <WorkoutOverview />
                <ActivityCalendar variant={tab} />
                <WorkoutFrequency />
                <CumulativeWorkouts />
              </TabsContent>
              <TabsContent
                value={WorkoutType.RUN}
                className="space-y-4 sm:space-y-6"
              >
                <RunOverview />
                <ActivityCalendar variant={tab} />
                <RunFrequency />
                <DistanceOverTime />
                <CumulativeRuns />
                <CumulativeDistance />
              </TabsContent>
              <TabsContent
                value={WorkoutType.WEIGHT_TRAINING}
                className="space-y-4 sm:space-y-6"
              >
                <WeightTrainingOverview />
                <ActivityCalendar variant={tab} />
                <WeightTrainingFrequency />
                <MuscleGroupsOverTime />
                <CumulativeWeightTrainingSessions />
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}

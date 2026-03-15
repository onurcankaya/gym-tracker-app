'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import RunOverview from '@/components/stats/runs/Overview';
import DistanceOverTime from '@/components/stats/runs/charts/DistanceOverTime';
import WeightTrainingOverview from '@/components/stats/weight-training/Overview';
import MuscleGroupsOverTime from '@/components/stats/weight-training/charts/MuscleGroupsOverTime';
import { WorkoutType } from '@/api/types';

export default function StatsPage() {
  const [tab, setTab] = useState(WorkoutType.RUN);

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="min-w-90 max-w-sm sm:min-w-lg">
        <Card className="px-2 py-4 sm:py-5">
          <Tabs
            value={tab}
            onValueChange={(value) => setTab(value as WorkoutType)}
          >
            <CardHeader className="px-2 sm:px-4 mb-0 sm:mb-1">
              <div className="flex items-center justify-between sm:flex-row">
                <CardTitle className="text-md">Workout Stats</CardTitle>

                <TabsList className="gap-2 sm:w-auto sm:my-0">
                  <TabsTrigger value={WorkoutType.RUN}>Runs</TabsTrigger>
                  <TabsTrigger value={WorkoutType.WEIGHT_TRAINING}>
                    Weight Training
                  </TabsTrigger>
                </TabsList>
              </div>
            </CardHeader>

            <CardContent className="px-2 sm:px-4">
              <TabsContent
                value={WorkoutType.RUN}
                className="space-y-4 sm:space-y-6"
              >
                <RunOverview />
                <DistanceOverTime />
              </TabsContent>
              <TabsContent
                value={WorkoutType.WEIGHT_TRAINING}
                className="space-y-4 sm:space-y-6"
              >
                <WeightTrainingOverview />
                <MuscleGroupsOverTime />
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}

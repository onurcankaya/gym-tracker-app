'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { StatsProvider, useStats } from '@/contexts/StatsContext';
import StatsToolbar from '@/components/stats/StatsToolbar';
import WorkoutStats from '@/components/stats/workout/WorkoutStats';
import RunStats from '@/components/stats/run/RunStats';
import WeightTrainingStats from '@/components/stats/weight-training/WeightTrainingStats';
import { WorkoutType } from '@/api/types';

function StatsPageContent() {
  const { title, tab, setTab, dateRange, dateRangeLabel } = useStats();

  return (
    <div className="flex min-h-screen items-center justify-center p-4 py-16 md:py-24">
      <div className="min-w-90 max-w-sm sm:min-w-2xl">
        <Card className="px-2 py-4 sm:py-5">
          <Tabs
            value={tab}
            onValueChange={(value) => setTab(value as WorkoutType)}
            className="gap-4"
          >
            <CardHeader className="px-3.5 sm:px-5 h-[24px]">
              <div className="flex items-center justify-between sm:flex-row">
                <CardTitle className="text-md">{title}</CardTitle>
              </div>
            </CardHeader>

            <CardContent className="space-y-4 px-2 sm:px-4">
              <TabsList className="w-full gap-2">
                <TabsTrigger value={WorkoutType.ALL}>All</TabsTrigger>
                <TabsTrigger value={WorkoutType.RUN}>Runs</TabsTrigger>
                <TabsTrigger value={WorkoutType.WEIGHT_TRAINING}>
                  Weight Training
                </TabsTrigger>
              </TabsList>

              <StatsToolbar />

              {dateRange?.from && (
                <div className="flex items-center justify-center">
                  <p className="text-xs md:text-sm text-center text-neon-green-300">
                    {dateRangeLabel}
                  </p>
                </div>
              )}
            </CardContent>

            <CardContent className="px-2 sm:px-4">
              <TabsContent
                value={WorkoutType.ALL}
                className="space-y-4 sm:space-y-6"
              >
                <WorkoutStats />
              </TabsContent>
              <TabsContent
                value={WorkoutType.RUN}
                className="space-y-4 sm:space-y-6"
              >
                <RunStats />
              </TabsContent>
              <TabsContent
                value={WorkoutType.WEIGHT_TRAINING}
                className="space-y-4 sm:space-y-6"
              >
                <WeightTrainingStats />
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}

export default function StatsPage() {
  return (
    <StatsProvider>
      <StatsPageContent />
    </StatsProvider>
  );
}

'use client';

import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useStats } from '@/contexts/StatsContext';
import { cn } from '@/lib/utils';
import { DatePreset } from '@/api/types/datePreset';

export default function StatsToolbar() {
  const { datePreset, dateRange, setDateRange, onDatePresetChange } =
    useStats();

  return (
    <div>
      <Tabs
        value={datePreset}
        onValueChange={(value) => onDatePresetChange(value as DatePreset)}
      >
        <TabsList className="w-full gap-2">
          <TabsTrigger value={DatePreset.WEEK}>7d</TabsTrigger>
          <TabsTrigger value={DatePreset.MONTH}>4w</TabsTrigger>
          <TabsTrigger value={DatePreset.YEAR}>1y</TabsTrigger>

          <Popover>
            <PopoverTrigger
              asChild
              className={cn(
                'hover:text-white focus:bg-neon-green-300 focus:text-black px-4',
                datePreset === DatePreset.CUSTOM &&
                  'bg-neon-green-300 text-black hover:text-black',
              )}
            >
              <TabsTrigger value={DatePreset.CUSTOM}>
                <CalendarIcon />
                Custom
              </TabsTrigger>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={1}
              />
            </PopoverContent>
          </Popover>
        </TabsList>
      </Tabs>
    </div>
  );
}

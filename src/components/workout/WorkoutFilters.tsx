'use client';

import { useState, Dispatch, SetStateAction } from 'react';
import { DateRange } from 'react-day-picker';
import { SlidersHorizontal } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { DateRangePicker } from '@/components/common/DateRangePicker';
import { cn } from '@/lib/utils';

type WorkoutFiltersProps = {
  dateRange: DateRange | undefined;
  setDateRange: Dispatch<SetStateAction<DateRange | undefined>>;
  hasActiveFilters: boolean;
};

export default function WorkoutFilters({
  dateRange,
  setDateRange,
  hasActiveFilters,
}: WorkoutFiltersProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <SlidersHorizontal
            className={cn(hasActiveFilters ? 'text-neon-green-300' : '')}
          />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Workout Filters</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 my-4">
          <div>
            <p className="text-sm mb-2">Workout date</p>
            <DateRangePicker
              dateRange={dateRange}
              setDateRange={setDateRange}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            onClick={() => setOpen(false)}
          >
            Apply filters
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

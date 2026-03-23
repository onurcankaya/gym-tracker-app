'use client';

import { useState, Dispatch, SetStateAction } from 'react';
import { DateRange } from 'react-day-picker';
import { SlidersHorizontal, CalendarIcon } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { DateRangePicker } from '@/components/common/DateRangePicker';
import { formatFullDate } from '@/lib/dateUtils';
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
            <Label htmlFor="dateRange" className="mb-2">
              Workout date
            </Label>
            <DateRangePicker
              trigger={
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left',
                      dateRange && 'border-neon-green-300',
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange?.from ? (
                      dateRange.to ? (
                        <>
                          {formatFullDate(dateRange.from)} -{' '}
                          {formatFullDate(dateRange.to)}
                        </>
                      ) : (
                        formatFullDate(dateRange.from)
                      )
                    ) : (
                      <span>Pick a date range</span>
                    )}
                  </Button>
                </PopoverTrigger>
              }
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

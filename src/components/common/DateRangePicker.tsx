'use client';

import { Dispatch, SetStateAction } from 'react';
import { DateRange } from 'react-day-picker';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { formatFullDate } from '@/lib/dateUtils';
import { cn } from '@/lib/utils';

type DateRangePickerProps = {
  dateRange: DateRange | undefined;
  setDateRange: Dispatch<SetStateAction<DateRange | undefined>>;
};

export function DateRangePicker({
  dateRange,
  setDateRange,
}: DateRangePickerProps) {
  return (
    <Popover>
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
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          selected={dateRange}
          onSelect={setDateRange}
          numberOfMonths={1}
        />
      </PopoverContent>
    </Popover>
  );
}

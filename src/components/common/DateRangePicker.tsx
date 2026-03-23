'use client';

import { Dispatch, SetStateAction, ReactNode } from 'react';
import { isAfter, startOfToday } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent } from '@/components/ui/popover';

type DateRangePickerProps = {
  trigger: ReactNode;
  dateRange: DateRange | undefined;
  setDateRange: Dispatch<SetStateAction<DateRange | undefined>>;
};

export function DateRangePicker({
  trigger,
  dateRange,
  setDateRange,
}: DateRangePickerProps) {
  return (
    <Popover>
      {trigger}
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          selected={dateRange}
          onSelect={setDateRange}
          numberOfMonths={1}
          disabled={(date) => isAfter(date, startOfToday())}
        />
      </PopoverContent>
    </Popover>
  );
}

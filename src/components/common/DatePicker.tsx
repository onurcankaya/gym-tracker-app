'use client';

import { Dispatch, SetStateAction } from 'react';
import { isAfter, startOfToday } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

type DatePickerProps = {
  date: Date;
  setDate: Dispatch<SetStateAction<Date>>;
};

export function DatePicker({ date, setDate }: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-start text-left">
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(new Date(date), 'PPP') : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={new Date(date)}
          onSelect={(newDate) => newDate && setDate(newDate)}
          disabled={(date) => isAfter(date, startOfToday())}
        />
      </PopoverContent>
    </Popover>
  );
}

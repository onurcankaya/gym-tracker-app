'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  ReactNode,
  Dispatch,
  SetStateAction,
} from 'react';
import { format } from 'date-fns';
import { startCase } from 'lodash';
import { DateRange } from 'react-day-picker';
import { DatePreset } from '@/api/types/datePreset';
import { WorkoutType } from '@/api/types';
import {
  DATE_FORMAT,
  today,
  sevenDaysAgo,
  fourWeeksAgo,
  oneYearAgo,
} from '@/lib/dateUtils';

type StatsContextType = {
  title: string;
  tab: WorkoutType;
  setTab: (tab: WorkoutType) => void;
  datePreset: DatePreset;
  setDatePreset: (preset: DatePreset) => void;
  dateRange: DateRange | undefined;
  setDateRange: Dispatch<SetStateAction<DateRange | undefined>>;
  dateRangeLabel: string | undefined;
  onDatePresetChange: (value: DatePreset) => void;
};

const StatsContext = createContext<StatsContextType | undefined>(undefined);

export function StatsProvider({ children }: { children: ReactNode }) {
  const [tab, setTab] = useState(WorkoutType.ALL);
  const [datePreset, setDatePreset] = useState(DatePreset.WEEK);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: sevenDaysAgo,
    to: today,
  });

  useEffect(() => {
    if (!dateRange?.from) {
      setDatePreset(DatePreset.WEEK);
    }
  }, [tab]);

  function handleDatePresetChange(value: DatePreset) {
    setDatePreset(value);

    if (value === DatePreset.WEEK) {
      setDateRange({ from: sevenDaysAgo, to: today });
    }

    if (value === DatePreset.MONTH) {
      setDateRange({ from: fourWeeksAgo, to: today });
    }

    if (value === DatePreset.YEAR) {
      setDateRange({ from: oneYearAgo, to: today });
    }
  }

  const title = useMemo(() => {
    if (tab === WorkoutType.ALL) return 'Workout Stats';
    return `${startCase(tab)} Stats`;
  }, [tab]);

  const dateRangeLabel = useMemo(() => {
    const dateFormat = DATE_FORMAT.FULL;
    const todayFormatted = format(today, dateFormat);

    if (datePreset === DatePreset.WEEK) {
      const sevenDaysAgoFormatted = format(sevenDaysAgo, dateFormat);
      return `${sevenDaysAgoFormatted} - ${todayFormatted}`;
    }

    if (datePreset === DatePreset.MONTH) {
      const fourWeeksAgoFormatted = format(fourWeeksAgo, dateFormat);
      return `${fourWeeksAgoFormatted} - ${todayFormatted}`;
    }

    if (datePreset === DatePreset.YEAR) {
      const oneYearAgoFormatted = format(oneYearAgo, dateFormat);
      return `${oneYearAgoFormatted} - ${todayFormatted}`;
    }

    if (datePreset === DatePreset.CUSTOM) {
      if (dateRange?.from && dateRange?.to) {
        if (dateRange.from === dateRange.to) {
          return `${format(dateRange.from, dateFormat)}`;
        }
        return `${format(dateRange.from, dateFormat)} - ${format(dateRange.to, dateFormat)}`;
      }
    }
  }, [datePreset, dateRange]);

  return (
    <StatsContext.Provider
      value={{
        title,
        tab,
        setTab,
        datePreset,
        setDatePreset,
        dateRange,
        setDateRange,
        dateRangeLabel,
        onDatePresetChange: handleDatePresetChange,
      }}
    >
      {children}
    </StatsContext.Provider>
  );
}

export function useStats() {
  const context = useContext(StatsContext);

  if (!context) {
    throw new Error('useStats must be used within StatsProvider');
  }

  return context;
}

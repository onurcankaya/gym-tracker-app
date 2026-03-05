'use client';

import * as React from 'react';
import { Check, ChevronDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';

export type SelectOption = {
  label: string;
  value: string;
};

type SingleSelectProps = {
  multiSelect?: false;
  options: SelectOption[];
  selected: string;
  onChange: (selected: string) => void;
  placeholder?: string;
  className?: string;
};

type MultiSelectProps = {
  multiSelect: true;
  options: SelectOption[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  className?: string;
};

type SelectProps = SingleSelectProps | MultiSelectProps;

export function Select(props: SelectProps) {
  const { options, placeholder = 'Select', className, multiSelect } = props;
  const [open, setOpen] = React.useState(false);

  const handleSelect = (value: string) => {
    if (multiSelect) {
      const newSelected = props.selected.includes(value)
        ? props.selected.filter((item) => item !== value)
        : [...props.selected, value];
      props.onChange(newSelected);
    } else {
      props.onChange(value);
      setOpen(false);
    }
  };

  const handleRemove = (value: string) => {
    if (multiSelect) {
      props.onChange(props.selected.filter((item) => item !== value));
    }
  };

  const selectedItems = multiSelect
    ? props.selected
    : props.selected
      ? [props.selected]
      : [];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn('w-full justify-between h-auto', className)}
        >
          <div className="flex gap-1 flex-wrap flex-1 overflow-hidden">
            {selectedItems.length > 0 ? (
              multiSelect ? (
                selectedItems.map((value) => {
                  const option = options.find((opt) => opt.value === value);
                  return (
                    <Badge
                      key={value}
                      variant="outline"
                      className="shrink-0 cursor-pointer"
                    >
                      {option?.label}
                      <span
                        className="ml-1 rounded-full hover:bg-muted"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleRemove(value);
                        }}
                      >
                        <X className="h-3 w-3" />
                      </span>
                    </Badge>
                  );
                })
              ) : (
                <span>
                  {options.find((opt) => opt.value === selectedItems[0])?.label}
                </span>
              )
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </div>
          <ChevronDown className="h-4 w-4 shrink-0 opacity-50 ml-2" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <div className="min-w-48 max-h-64 overflow-auto p-1">
          {options.map((option) => {
            const isSelected = selectedItems.includes(option.value);
            return (
              <div
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className={cn(
                  'flex items-center gap-2 px-2 py-1.5 cursor-pointer rounded hover:bg-accent',
                  isSelected && 'bg-accent',
                )}
              >
                {multiSelect && (
                  <div
                    className={cn(
                      'flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                      isSelected
                        ? 'bg-primary text-primary-foreground'
                        : 'opacity-50',
                    )}
                  >
                    {isSelected && <Check className="h-3 w-3" />}
                  </div>
                )}
                <span className="flex-1">{option.label}</span>
                {!multiSelect && isSelected && <Check className="h-4 w-4" />}
              </div>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}

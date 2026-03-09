'use client';

import { Input } from '@/components/ui/input';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { cn } from '@/lib/utils';

type InputWithToggleProps = {
  value: string | number;
  onChange: (value: string) => void;
  toggleValue: string;
  onToggleChange: (value: string) => void;
  toggleOptions: { value: string; label: string }[];
  placeholder?: string;
  className?: string;
  type?: string;
};

export function InputWithToggle({
  value,
  onChange,
  toggleValue,
  onToggleChange,
  toggleOptions,
  placeholder,
  className,
  type = 'text',
}: InputWithToggleProps) {
  return (
    <div className="relative">
      <Input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn('pr-20', className)}
        required
      />
      <div className="absolute right-0 top-0">
        <ToggleGroup
          type="single"
          variant="outline"
          value={toggleValue}
          onValueChange={onToggleChange}
          spacing={0}
        >
          {toggleOptions.map((option) => (
            <ToggleGroupItem
              key={option.value}
              value={option.value}
              className="px-2 text-xs"
            >
              {option.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>
    </div>
  );
}

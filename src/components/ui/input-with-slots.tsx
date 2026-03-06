import { ReactNode } from 'react';
import { Input, InputProps } from '@/components/ui/input';
import { cn } from '@/lib/utils';

type InputWithSlotsProps = InputProps & {
  leftSlot?: ReactNode;
  rightSlot?: ReactNode;
  hasValues?: boolean;
};

export function InputWithSlots({
  leftSlot,
  rightSlot,
  hasValues,
  className,
  ...props
}: InputWithSlotsProps) {
  return (
    <div className={cn('relative w-full', className)}>
      {leftSlot && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2">
          {leftSlot}
        </div>
      )}
      <Input
        className={cn(
          leftSlot && 'pl-10',
          rightSlot && 'pr-10',
          hasValues &&
            'border-neon-green-300 focus-visible:border-neon-green-300',
        )}
        {...props}
      />
      {rightSlot && (
        <div className="absolute right-2 top-1/2 -translate-y-1/2">
          {rightSlot}
        </div>
      )}
    </div>
  );
}

import { Input } from '../ui/input';

type InputWithSuffixProps = React.ComponentProps<typeof Input> & {
  suffix: string;
};

export function InputWithSuffix({
  suffix,
  className,
  ...props
}: InputWithSuffixProps) {
  return (
    <div className="relative">
      <Input className={`pr-12 ${className}`} {...props} />
      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
        {suffix}
      </span>
    </div>
  );
}

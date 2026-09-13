import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../utils/cn';

interface ClayInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const ClayInput = forwardRef<HTMLInputElement, ClayInputProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-2 w-full">
        {label && (
          <label className="text-sm font-bold text-brand-muted ml-2">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            'w-full bg-[#EBE7F5] rounded-[20px] px-6 py-4 text-brand-text outline-none transition-all',
            'shadow-clay-inset focus:shadow-clay-active focus:bg-[#EBE7F5]',
            'placeholder:text-brand-muted/50',
            error && 'border border-red-400',
            className
          )}
          {...props}
        />
        {error && <span className="text-sm text-red-500 ml-2">{error}</span>}
      </div>
    );
  }
);
ClayInput.displayName = 'ClayInput';

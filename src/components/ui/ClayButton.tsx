import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../utils/cn';

interface ClayButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
}

export const ClayButton = forwardRef<HTMLButtonElement, ClayButtonProps>(
  ({ className, variant = 'primary', ...props }, ref) => {
    const baseClasses = 'relative inline-flex items-center justify-center rounded-[20px] px-6 py-3 text-sm font-bold transition-all active:scale-[0.92] min-h-[44px] overflow-hidden';
    
    const variants = {
      primary: 'bg-gradient-to-br from-[#A78BFA] to-[#7C3AED] text-white shadow-clay-sm hover:shadow-clay',
      secondary: 'bg-[#F4F1FA] text-brand-text shadow-clay-sm hover:shadow-clay',
      ghost: 'bg-transparent text-brand-muted hover:bg-white/40',
      danger: 'bg-red-500 text-white shadow-clay-sm hover:shadow-clay',
    };

    return (
      <button
        ref={ref}
        className={cn(baseClasses, variants[variant], className)}
        {...props}
      >
        {/* Subtle inner highlight for primary/danger buttons */}
        {(variant === 'primary' || variant === 'danger') && (
          <div className="absolute inset-0 rounded-[20px] shadow-[inset_0_2px_4px_rgba(255,255,255,0.3)] pointer-events-none" />
        )}
        <span className="relative z-10 flex items-center justify-center gap-2">{props.children}</span>
      </button>
    );
  }
);
ClayButton.displayName = 'ClayButton';

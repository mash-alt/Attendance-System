import { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../../utils/cn';

interface ClayBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  variant?: 'success' | 'warning' | 'error' | 'info' | 'default';
}

export function ClayBadge({ children, className, variant = 'default', ...props }: ClayBadgeProps) {
  const variants = {
    success: 'bg-emerald-100 text-emerald-700 shadow-[inset_0_1px_3px_rgba(16,185,129,0.2)]',
    warning: 'bg-amber-100 text-amber-700 shadow-[inset_0_1px_3px_rgba(245,158,11,0.2)]',
    error: 'bg-red-100 text-red-700 shadow-[inset_0_1px_3px_rgba(239,68,68,0.2)]',
    info: 'bg-blue-100 text-blue-700 shadow-[inset_0_1px_3px_rgba(14,165,233,0.2)]',
    default: 'bg-[#EBE7F5] text-brand-muted shadow-clay-inset',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

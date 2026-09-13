import { ReactNode } from 'react';
import { cn } from '../../utils/cn';

interface ClayCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  nested?: boolean;
}

export function ClayCard({ children, className, nested = false, ...props }: ClayCardProps) {
  return (
    <div
      className={cn(
        'bg-[#F4F1FA]/80 backdrop-blur-md',
        nested ? 'rounded-[24px] shadow-clay-sm' : 'rounded-[32px] shadow-clay',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

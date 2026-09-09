import React from 'react';
import { PriorityLevel } from '../../types';

interface PriorityBadgeProps {
  priority: PriorityLevel;
  className?: string;
  showIcon?: boolean;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({
  priority,
  className = '',
  showIcon = true,
}) => {
  switch (priority) {
    case 'CRITICAL':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[10px] font-extrabold tracking-wider uppercase bg-rose-500/20 text-rose-300 border border-rose-500/50 shadow-xs shadow-rose-500/20 ${className}`}
        >
          {showIcon && <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse shrink-0" />}
          CRITICAL
        </span>
      );
    case 'HIGH':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[10px] font-bold tracking-wider uppercase bg-orange-500/20 text-orange-300 border border-orange-500/50 ${className}`}
        >
          {showIcon && <span className="w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0" />}
          HIGH
        </span>
      );
    case 'MEDIUM':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[10px] font-bold tracking-wider uppercase bg-amber-500/20 text-amber-300 border border-amber-500/50 ${className}`}
        >
          {showIcon && <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />}
          MEDIUM
        </span>
      );
    case 'LOW':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[10px] font-medium tracking-wider uppercase bg-sky-500/20 text-sky-300 border border-sky-500/40 ${className}`}
        >
          {showIcon && <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0" />}
          LOW
        </span>
      );
    case 'INFORMATIONAL':
    default:
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[10px] font-medium tracking-wider uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 ${className}`}
        >
          {showIcon && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />}
          INFO
        </span>
      );
  }
};

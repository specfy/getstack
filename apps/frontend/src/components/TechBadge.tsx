import { Link } from '@tanstack/react-router';

import { listIndexed } from '@/lib/stack';
import { cn } from '@/lib/utils';

import type { AllowedKeys } from '@specfy/stack-analyser';
import type { ClassValue } from 'clsx';

export const TechBadge: React.FC<{
  tech: AllowedKeys;
  size?: 'l' | 'md' | 'xl';
  className?: ClassValue;
  border?: boolean;
}> = ({ tech, className, size, border }) => {
  return (
    <Link
      className={cn(
        'inline-flex gap-1.5 items-center text-gray-700 hover:text-gray-900 hover:text-shadow-xs h-7 text-xs',
        size === 'l' && 'text-[13px] h-9 text-gray-950 hover:text-shadow-none',
        size === 'xl' && 'text-sm h-9 text-gray-950 hover:text-shadow-none',
        border && 'border rounded-md px-2',
        className
      )}
      to={`/tech/$techKey`}
      params={{ techKey: tech }}
    >
      <div className={cn('w-4', size === 'xl' && 'w-5')}>
        <img src={`/favicons/${tech}.webp`} className="rounded-xs overflow-hidden" />
      </div>
      <div className="truncate text-ellipsis">{listIndexed[tech].name}</div>
    </Link>
  );
};

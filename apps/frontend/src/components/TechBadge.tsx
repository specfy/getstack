import { Link } from '@tanstack/react-router';

import { listIndexed } from '@/lib/stack';
import { cn } from '@/lib/utils';

import type { AllowedKeys } from '@specfy/stack-analyser';
import type { ClassValue } from 'clsx';

export const TechBadge: React.FC<{
  tech: AllowedKeys;
  size?: 'l' | 'md';
  className?: ClassValue;
}> = ({ tech, className, size }) => {
  const l = size === 'l';
  return (
    <Link
      className={cn(
        'flex gap-2 items-center text-gray-700 hover:text-gray-900 hover:text-shadow-xs h-7 text-xs',
        l && 'text-md h-9 text-gray-950 hover:text-shadow-none font-semibold',
        className
      )}
      to={`/tech/$techKey`}
      params={{ techKey: tech }}
    >
      <div className={cn('w-4', l && 'w-5')}>
        <img src={`/favicons/${tech}.webp`} />
      </div>
      {listIndexed[tech].name}
    </Link>
  );
};

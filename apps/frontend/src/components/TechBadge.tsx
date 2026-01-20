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
  const name = listIndexed[tech].name;
  return (
    <Link
      className={cn(
        'inline-flex h-7 items-center gap-1.5 text-xs text-gray-700 hover:text-gray-900',
        size === 'l' && 'hover:text-shadow-none h-9 text-[13px] text-gray-950',
        size === 'xl' && 'hover:text-shadow-none h-9 text-sm text-gray-950',
        border && 'border px-2',
        className
      )}
      to={`/tech/$techKey`}
      params={{ techKey: tech }}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <div className={cn('w-4', size === 'xl' && 'w-5')}>
        <img
          src={`/favicons/${tech}.webp`}
          alt={`${name} logo`}
          width={size === 'xl' ? 20 : 16}
          height={size === 'xl' ? 20 : 16}
        />
      </div>
      <div className="truncate">{name}</div>
    </Link>
  );
};

export const TechBadgeLite: React.FC<{
  tech: AllowedKeys;
  size?: 'xl';
  className?: ClassValue;
}> = ({ tech, className, size }) => {
  const name = listIndexed[tech].name;
  return (
    <div className={cn('flex items-center gap-1', className)}>
      <div className={cn('w-4', size === 'xl' && 'w-6')}>
        <img
          src={`/favicons/${tech}.webp`}
          alt={`${name} logo`}
          width={size === 'xl' ? 20 : 16}
          height={size === 'xl' ? 20 : 16}
        />
      </div>
      <div className="truncate">{name}</div>
    </div>
  );
};

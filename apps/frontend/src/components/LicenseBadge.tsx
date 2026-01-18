import { Link } from '@tanstack/react-router';

import { cn } from '@/lib/utils';

import type { ClassValue } from 'clsx';

export const LicenseBadge: React.FC<{
  licenseKey: string;
  fullName: string;
  size?: 'l' | 'md' | 'xl';
  className?: ClassValue;
  border?: boolean;
}> = ({ licenseKey, fullName, className, size, border }) => {
  return (
    <Link
      className={cn(
        'hover:text-shadow-xs inline-flex h-7 items-center gap-1.5 text-xs text-gray-700 hover:text-gray-900',
        size === 'l' && 'hover:text-shadow-none h-9 text-[13px] text-gray-950',
        size === 'xl' && 'hover:text-shadow-none h-9 text-sm text-gray-950',
        border && 'rounded-sm border px-2',
        className
      )}
      to={`/licenses/$license`}
      params={{ license: licenseKey }}
    >
      <div className="truncate text-ellipsis">{fullName}</div>
    </Link>
  );
};

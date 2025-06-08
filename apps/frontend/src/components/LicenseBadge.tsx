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
        'inline-flex gap-1.5 items-center text-gray-700 hover:text-gray-900 hover:text-shadow-xs h-7 text-xs',
        size === 'l' && 'text-[13px] h-9 text-gray-950 hover:text-shadow-none',
        size === 'xl' && 'text-sm h-9 text-gray-950 hover:text-shadow-none',
        border && 'border rounded-sm px-2',
        className
      )}
      to={`/licenses/$license`}
      params={{ license: licenseKey }}
    >
      <div className="truncate text-ellipsis">{fullName}</div>
    </Link>
  );
};

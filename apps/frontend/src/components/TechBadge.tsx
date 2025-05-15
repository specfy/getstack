import { Link } from '@tanstack/react-router';

import { listIndexed } from '@/lib/stack';

import type { AllowedKeys } from '@specfy/stack-analyser';

export const TechBadge: React.FC<{ tech: AllowedKeys }> = ({ tech }) => {
  return (
    <Link
      className="flex gap-2 items-center text-gray-700 hover:text-gray-900 hover:text-shadow-xs h-7 text-xs"
      to={`/tech/$techKey`}
      params={{ techKey: tech }}
    >
      <div className="w-4">
        <img src={`/favicons/${tech}.webp`} />
      </div>
      {listIndexed[tech].name}
    </Link>
  );
};

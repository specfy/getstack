import { IconArrowRight, IconPackage, IconStar } from '@tabler/icons-react';
import { Link } from '@tanstack/react-router';

import { TrendsBadge } from '../TrendsBadge';
import { Button } from '../ui/button';

export const TechSummary: React.FC<{
  volume: string;
  percentChange: string;
  stars?: string;
  tech: string;
}> = ({ volume, percentChange, stars, tech }) => {
  return (
    <div className="flex flex-col justify-between gap-2 rounded-md border p-4 md:flex-row">
      <div className="flex items-center gap-2">
        <div className="w-5 shrink-0">
          <IconPackage className="text-black" size={20} />
        </div>
        <div className="flex items-center gap-2 leading-5">
          <div>
            Used by <b className="font-semibold">{volume} popular GitHub repositories</b>
          </div>
          {Number(percentChange) !== 0 && <TrendsBadge pct={Number(percentChange)} size="lg" />}
        </div>
      </div>
      {stars && (
        <div className="flex items-center gap-2">
          <div className="w-5 shrink-0">
            <IconStar className="text-black" size={20} />
          </div>
          <div className="leading-5">
            <b className="font-semibold">{stars}</b> GitHub stars
          </div>
        </div>
      )}
      <div className="hidden md:block">
        <Button asChild variant={'ghost'}>
          <Link
            to="/tech/$techKey"
            params={{ techKey: tech }}
            className="!text-gray-500 no-underline"
          >
            <IconArrowRight />
          </Link>
        </Button>
      </div>
    </div>
  );
};

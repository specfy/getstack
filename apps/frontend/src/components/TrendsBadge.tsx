import { IconTrendingDown, IconTrendingUp } from '@tabler/icons-react';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

import type { TechnologyByCategoryByWeekWithTrend } from '@stackhub/backend/src/types/endpoint';

export const TrendsBadge: React.FC<{
  pct: TechnologyByCategoryByWeekWithTrend['percent_change'];
}> = ({ pct }) => {
  return (
    <Badge
      variant="outline"
      className={cn(
        'flex gap-1 rounded-lg text-tiny',
        pct > 0 ? ' text-lime-600' : ' text-red-400'
      )}
    >
      {pct > 0 ? <IconTrendingUp /> : <IconTrendingDown />}
      {pct > 9 ? Math.round(pct) : pct}%
    </Badge>
  );
};

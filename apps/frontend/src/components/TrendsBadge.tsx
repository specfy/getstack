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
        'flex gap-1 rounded-lg text-tiny border-transparent',
        pct > 0 ? ' text-emerald-600 bg-emerald-50' : ' text-red-400 bg-red-50'
      )}
    >
      {pct > 0 ? <IconTrendingUp /> : <IconTrendingDown />}
      {pct > 9 ? Math.round(pct) : pct}%
    </Badge>
  );
};

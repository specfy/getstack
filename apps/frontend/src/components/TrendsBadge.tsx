import { IconTrendingDown, IconTrendingUp } from '@tabler/icons-react';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

import type { TechnologyByCategoryByWeekWithTrend } from '@stackhub/backend/src/types/endpoint';

export const TrendsBadge: React.FC<{ row: TechnologyByCategoryByWeekWithTrend }> = ({ row }) => {
  return (
    <Badge
      variant="outline"
      className={cn(
        'flex gap-1 rounded-lg text-tiny',
        row.percent_change > 0 ? ' text-lime-600' : ' text-red-400'
      )}
    >
      {row.percent_change > 0 ? <IconTrendingUp /> : <IconTrendingDown />}
      {row.percent_change > 9 ? Math.round(row.percent_change) : row.percent_change}%
    </Badge>
  );
};

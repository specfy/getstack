import { IconTrendingDown, IconTrendingUp } from '@tabler/icons-react';

import { TT } from './TT';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

import type { TechnologyByCategoryByWeekWithTrend } from '@getstack/backend/src/types/endpoint';

export const TrendsBadge: React.FC<{
  pct: TechnologyByCategoryByWeekWithTrend['percent_change'];
}> = ({ pct }) => {
  return (
    <TT
      description={`Usage ${pct > 0 ? 'increased' : 'decreased'} by ${pct > 9 ? Math.round(pct) : pct}% in the last week`}
    >
      <Badge
        variant="outline"
        className={cn(
          'inline-flex gap-1 rounded-lg text-tiny border-transparent',
          pct > 0 ? ' text-emerald-600 bg-emerald-50' : ' text-red-400 bg-red-50'
        )}
      >
        {pct > 0 ? <IconTrendingUp /> : <IconTrendingDown />}
        {pct > 9 ? Math.round(pct) : pct}%
      </Badge>
    </TT>
  );
};

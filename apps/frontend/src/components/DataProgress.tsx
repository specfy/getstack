import { IconCheck, IconRefresh } from '@tabler/icons-react';
import dayjs from 'dayjs';

import { useData } from '@/api/useData';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export const DataProgress: React.FC = () => {
  const { data, isLoading } = useData();

  if (isLoading || !data) {
    return null;
  }

  const lastRefresh = dayjs(data.data.lastRefresh);
  const inProgress = data.data.inProgress;

  return (
    <Tooltip>
      <TooltipTrigger>
        <div className="flex gap-1 text-xs text-gray-400 group">
          {inProgress ? (
            <IconRefresh stroke={1} size={16} className="group-hover:animate-spin" />
          ) : (
            <IconCheck stroke={1} size={16} className="text-lime-700" />
          )}
          {data.data.inProgress ? 'Refreshing' : 'Fresh'}
        </div>
      </TooltipTrigger>
      <TooltipContent>
        {data.data.inProgress
          ? `Data is being refreshed. Currently showing data from: ${lastRefresh.format('MMM DD, YYYY')}`
          : `Data shown in the UI is up to date from: ${lastRefresh.format('MMM DD, YYYY')}`}
      </TooltipContent>
    </Tooltip>
  );
};

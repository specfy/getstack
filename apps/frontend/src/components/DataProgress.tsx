import { IconCheck, IconRefresh } from '@tabler/icons-react';
import dayjs from 'dayjs';

import { TT } from './TT';
import { useData } from '@/api/useData';

export const DataProgress: React.FC = () => {
  const { data, isLoading } = useData();

  if (isLoading || !data) {
    return null;
  }

  const lastRefresh = dayjs(data.data.lastRefresh);
  const inProgress = data.data.inProgress;

  return (
    <TT
      description={
        data.data.inProgress
          ? `Data is being refreshed. Currently showing data from: ${lastRefresh.format('MMM DD, YYYY')}`
          : `Data shown in the UI is up to date from: ${lastRefresh.format('MMM DD, YYYY')}`
      }
    >
      <div className="flex gap-1 text-xs text-gray-400 group">
        {inProgress ? (
          <IconRefresh stroke={1} size={16} className="group-hover:animate-spin" />
        ) : (
          <IconCheck stroke={1} size={16} className="text-lime-700" />
        )}
        Data is {data.data.inProgress ? 'refreshing' : 'fresh from this week'}
      </div>
    </TT>
  );
};

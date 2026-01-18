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
        data.data.inProgress ? (
          `Data is being refreshed. Currently showing data from: ${lastRefresh.format('MMM DD, YYYY')}`
        ) : (
          <>
            Data is up to date. Last refresh: {lastRefresh.format('MMM DD, YYYY')}. <br /> Updated
            every monday.
          </>
        )
      }
    >
      <div className="group flex items-center gap-2 border border-gray-200 p-1 px-2 text-xs text-gray-400">
        {inProgress ? (
          <>
            <div className="size-2 animate-pulse bg-cyan-600"></div>Refresh in progress...
          </>
        ) : (
          <>
            <div className="size-2 animate-pulse bg-emerald-600"></div>Last update this monday
          </>
        )}
      </div>
    </TT>
  );
};

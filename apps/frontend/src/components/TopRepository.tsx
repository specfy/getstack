import { IconStar } from '@tabler/icons-react';
import { Link } from '@tanstack/react-router';
import { useMemo } from 'react';

import { Button } from './ui/button';
import { formatQuantity } from '@/lib/number';
import { isSSR } from '@/lib/utils';

import type { RepositoryTop, TechnologyWeeklyVolume } from '@getstack/backend/src/types/endpoint';

export const TopRepositories: React.FC<{
  topRepos: RepositoryTop[];
  volume: null | TechnologyWeeklyVolume;
  title: string;
  description: string;
  emptyDesc: string;
}> = ({ topRepos, volume, title, description, emptyDesc }) => {
  const [top10, rest] = useMemo(() => {
    const copy = [...topRepos];

    const topN = !isSSR && window.outerWidth < 768 ? 8 : 9;
    const topMore = !isSSR && window.outerWidth < 768 ? 6 : 12;
    const sliced = copy.splice(0, topN);

    return [
      sliced.map((row) => {
        return { ...row, stars: formatQuantity(row.stars) };
      }),
      copy.splice(0, topMore).map((row) => {
        return { ...row, stars: formatQuantity(row.stars) };
      }),
    ];
  }, [topRepos]);

  const howMuch = useMemo(() => {
    if (!volume) {
      return '0';
    }
    return formatQuantity(Math.max(0, volume.hits - (!isSSR && window.outerWidth < 768 ? 14 : 21)));
  }, [volume]);

  return (
    <div>
      <h3 className="text-lg font-semibold font-serif">{title}</h3>
      <div className="text-xs text-neutral-400 mb-4">{description}</div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {top10.map((repo) => {
          return (
            <Link
              key={repo.id}
              className="py-4 pb-2 px-4 flex flex-col gap-3 border rounded-sm border-gray-200 hover:bg-gray-50 transition-colors"
              to="/$org/$name"
              params={{ org: repo.org, name: repo.name }}
            >
              <header className="flex gap-2">
                <div className="border rounded-md bg-gray-50 w-9 p-0.5 px-1 flex items-center justify-center shrink-0">
                  <img src={repo.avatar_url} className="w-6 h-6 rounded-sm overflow-hidden" />
                </div>
                <div className="flex flex-col truncate">
                  <div className="font-semibold text-sm truncate text-ellipsis">{repo.name}</div>
                  <div className="text-[10px] text-gray-400 truncate text-ellipsis">{repo.org}</div>
                </div>
              </header>
              <div className="text-xs text-gray-500">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1">
                    <IconStar stroke={1} size={16} />
                    <strong>{repo.stars}</strong>Stars
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
      {rest.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-4 items-center ml-1">
          {rest.map((repo) => {
            return (
              <Button
                key={repo.id}
                variant={'ghost'}
                size={'sm'}
                className="px-2 py-0 h-6 font-normal cursor-pointer text-xs text-gray-600 hover:text-gray-900"
                asChild
              >
                <Link to="/$org/$name" params={{ org: repo.org, name: repo.name }}>
                  {repo.org}/{repo.name}
                </Link>
              </Button>
            );
          })}
          {volume && howMuch !== '0' && (
            <div className="text-xs text-gray-400 px-2">{howMuch} more...</div>
          )}
        </div>
      )}

      {topRepos.length === 0 && (
        <div className="text-gray-400 italic">
          No open-source repositories are using {emptyDesc} yet.
        </div>
      )}
    </div>
  );
};

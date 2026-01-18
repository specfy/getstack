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
      <h3 className="font-serif text-lg font-semibold">{title}</h3>
      <div className="mb-4 text-xs text-neutral-400">{description}</div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {top10.map((repo) => {
          return (
            <Link
              key={repo.id}
              className="flex flex-col gap-3 border border-gray-200 p-4 transition-colors hover:bg-gray-50"
              to="/$org/$name"
              params={{ org: repo.org, name: repo.name }}
              aria-description={`${repo.org}/${repo.name} is using ${emptyDesc}`}
            >
              <header className="flex gap-2">
                <div className="flex w-9 shrink-0 items-center justify-center border bg-gray-50 p-0.5 px-1">
                  <img
                    src={repo.avatar_url}
                    className="size-6 overflow-hidden rounded-sm"
                    alt={`${repo.org} logo`}
                    width={24}
                    height={24}
                  />
                </div>
                <div className="flex flex-col truncate">
                  <div className="truncate text-sm font-semibold">{repo.name}</div>
                  <div className="truncate text-[10px] text-gray-400">{repo.org}</div>
                </div>
              </header>
              <div className="text-xs text-gray-500">
                <div className="flex flex-col">
                  <span className="text-xs text-gray-400">Stars</span>
                  <strong className="font-mono">{repo.stars}</strong>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
      {rest.length > 0 && (
        <div className="ml-1 mt-4 flex flex-wrap items-center gap-1">
          {rest.map((repo) => {
            return (
              <Button
                key={repo.id}
                variant={'ghost'}
                size={'sm'}
                className="h-6 cursor-pointer px-2 py-0 text-xs font-normal text-gray-600 hover:text-gray-900"
                asChild
              >
                <Link to="/$org/$name" params={{ org: repo.org, name: repo.name }}>
                  {repo.org}/{repo.name}
                </Link>
              </Button>
            );
          })}
          {volume && howMuch !== '0' && (
            <div className="px-2 text-xs text-gray-400">{howMuch} more...</div>
          )}
        </div>
      )}

      {topRepos.length === 0 && (
        <div className="italic text-gray-400">
          No open-source repositories are using {emptyDesc} yet.
        </div>
      )}
    </div>
  );
};

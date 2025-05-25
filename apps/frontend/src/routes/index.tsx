import { Link, createFileRoute } from '@tanstack/react-router';
import { useMemo } from 'react';

import { useTop } from '@/api/useTop';
import { Newsletter } from '@/components/Newsletter';
import { Search } from '@/components/Search';
import { TechBadge } from '@/components/TechBadge';
import { TrendsBadge } from '@/components/TrendsBadge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { formatQuantity } from '@/lib/number';
import { categories, categoryOrder } from '@/lib/stack';

import type { TechType } from '@specfy/stack-analyser';

const Index: React.FC = () => {
  const { data, isLoading } = useTop();

  const sorted = useMemo(() => {
    if (!data?.data) {
      return [];
    }

    return [...data.data].sort(
      (a, b) => categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category)
    );
  }, [data]);

  return (
    <div className="">
      <div className="text-center mb-14 mt-14">
        <h1 className="text-4xl font-semibold font-serif">Discover Open Source Trends</h1>
        <p className="text-lg font-light text-gray-600">
          Explore the most popular technologies and repositories, refreshed every week
        </p>
      </div>
      <div className="flex justify-center items-center gap-4">
        <Search onPick={() => null} inline />
        <Button variant={'default'}>Search</Button>
      </div>
      <Try />
      <div className="text-xs text-neutral-400 mt-14 text-pretty">
        Most popular tech per category by number of repositories
      </div>
      <div className="mt-2 grid grid-cols-1 gap-6 md:grid-cols-3">
        {isLoading && (
          <>
            <Skeleton className="h-20" />
            <Skeleton className="h-20" />
            <Skeleton className="h-20" />
            <Skeleton className="h-20" />
            <Skeleton className="h-20" />
            <Skeleton className="h-20" />
          </>
        )}
        {sorted.map(({ category, rows }, index) => {
          const def = categories[category as TechType];
          const Icon = def.icon;
          return (
            <>
              {index === 12 && (
                <div className="flex flex-col justify-center items-center px-4 py-10 md:col-span-3">
                  <Newsletter />
                </div>
              )}
              <Link
                key={index}
                to={`/category/$category`}
                params={{ category }}
                className="border rounded flex flex-col justify-between hover:shadow-lg transition-shadow duration-300 bg-white p-1 h-[250px]"
              >
                <div className="p-4 h-full">
                  <div className="flex items-center mb-6 gap-4">
                    <div className="w-8 h-8 bg-neutral-100 rounded-md p-1 border">
                      <Icon size={22} />
                    </div>
                    <h4 className="text-md font-semibold font-serif">{def.name}</h4>
                  </div>
                  <ul className="flex flex-col gap-3">
                    {rows.map((row, rowIndex) => {
                      const formatted = formatQuantity(row.current_hits);
                      return (
                        <li key={rowIndex}>
                          <div className="flex items-center justify-between text-xs h-5">
                            <TechBadge tech={row.tech} border />
                            <div className="flex gap-1 items-center">
                              {row.previous_hits > 0 &&
                                (row.percent_change > 0.5 || row.percent_change < -0.5) && (
                                  <TrendsBadge pct={row.percent_change} />
                                )}
                              <div className="font-semibold w-8 text-right">{formatted}</div>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </Link>
            </>
          );
        })}
      </div>
    </div>
  );
};

type Highlight =
  | { type: 'repo'; org: string; name: string }
  | { type: 'tech'; name: string; displayName: string };

const highlights: Highlight[] = [
  { type: 'repo', org: 'n8n-io', name: 'n8n' },
  { type: 'repo', org: 'NangoHQ', name: 'nango' },
  { type: 'tech', name: 'mistralai', displayName: 'Mistral AI' },
  { type: 'tech', name: 'vite', displayName: 'Vite' },
  { type: 'tech', name: 'clickhouse', displayName: 'ClickHouse' },
];

function getRandomSample<T>(arr: T[], n: number): T[] {
  // Shuffle a copy and slice the first n elements for unique random sample
  return [...arr].sort(() => Math.random() - 0.5).slice(0, n);
}

const Try: React.FC = () => {
  const randomHighlights = useMemo(() => getRandomSample(highlights, 3), []);
  return (
    <div className="flex justify-center mt-8 items-center gap-4">
      <div className="text-gray-600 font-serif text-sm">Try</div>
      <div className="flex gap-2">
        {randomHighlights.map((item) => {
          if (item.type === 'repo') {
            return (
              <Button
                key={item.org + item.name}
                variant={'ghost'}
                size={'sm'}
                className="opacity-50 grayscale-100 hover:grayscale-0 focus:grayscale-100 hover:opacity-100 focus:opacity-100 transition-all"
                asChild
              >
                <Link to={`/$org/$name`} params={{ org: item.org, name: item.name }}>
                  <div className={'w-4'}>
                    <img
                      src={`/favicons/${item.name.toLowerCase()}.webp`}
                      className="rounded-xs overflow-hidden"
                    />
                  </div>
                  <div className="truncate text-ellipsis">{item.name}</div>
                </Link>
              </Button>
            );
          } else {
            return (
              <Button
                key={item.name}
                variant={'ghost'}
                size={'sm'}
                className="opacity-50 grayscale-100 hover:grayscale-0 focus:grayscale-100 hover:opacity-100 focus:opacity-100 transition-all"
                asChild
              >
                <Link to={`/tech/$techKey`} params={{ techKey: item.name }}>
                  <div className={'w-4'}>
                    <img
                      src={`/favicons/${item.name.toLowerCase()}.webp`}
                      className="rounded-xs overflow-hidden"
                    />
                  </div>
                  <div className="truncate text-ellipsis">{item.displayName}</div>
                </Link>
              </Button>
            );
          }
        })}
      </div>
    </div>
  );
};

export const Route = createFileRoute('/')({
  component: Index,
});

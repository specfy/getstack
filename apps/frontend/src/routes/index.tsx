import { IconTrendingDown, IconTrendingUp } from '@tabler/icons-react';
import { Link, createFileRoute } from '@tanstack/react-router';
import { useMemo } from 'react';

import { useTop } from '@/api/useTop';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { stackDefinition, supportedIndexed } from '@/lib/stack';
import { cn } from '@/lib/utils';

import type { TechType } from '@specfy/stack-analyser';

const stackOrder: TechType[] = [
  // Popular
  'language',
  'db',
  'ai',

  // Tools
  'framework',
  'saas',
  'tool',

  // Store
  'cloud',
  'storage',
  'hosting',

  // UI
  'auth',
  'ui',
  'analytics',

  // CI
  'ci',
  'test',
  'monitoring',

  // Events
  'notification',
  'queue',
  'api',

  // Other app
  'etl',
  'app',
  'network',

  // Deprecated
  'messaging',
];

const Index: React.FC = () => {
  const { data, isLoading } = useTop();

  const sorted = useMemo(() => {
    if (!data?.data) {
      return [];
    }

    return [...data.data].sort(
      (a, b) => stackOrder.indexOf(a.category) - stackOrder.indexOf(b.category)
    );
  }, [data]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="">
      <div className="text-center mb-14 mt-14">
        <h1 className="text-4xl font-bold">Discover Open Source Trends</h1>
        <p className="text-lg text-gray-600">
          Explore the most popular technologies and repositories
        </p>
      </div>
      <div className="flex justify-center items-center mb-14 gap-4">
        <Input
          placeholder="Search technology, repository..."
          className="w-2/3 p-4 text-lg border rounded-l-md"
        />
        <Button variant={'default'}>Search</Button>
      </div>
      <div className="text-xs text-neutral-400 mb-2">
        Most popular technology found per category
      </div>
      <div className="grid grid-cols-3 gap-6">
        {sorted.map(({ category, rows }, index) => {
          const def = stackDefinition[category as TechType];
          const Icon = def.icon;
          return (
            <Link
              key={index}
              to={`/category/$category`}
              params={{ category }}
              className="border rounded flex flex-col justify-between hover:shadow-lg transition-shadow duration-300 bg-white p-1 h-[230px]"
            >
              <div className="bg-neutral-50 p-4 h-full">
                <div className="flex items-center mb-6 gap-4">
                  <div className="w-8 h-8 bg-neutral-100 rounded-md p-1 border">
                    <Icon size={22} />
                  </div>
                  <h4 className="text-md font-semibold">{def.name}</h4>
                </div>
                <ul className="flex flex-col gap-3 ml-1">
                  {rows.map((row, rowIndex) => {
                    return (
                      <li key={rowIndex}>
                        <div className="flex justify-between text-xs">
                          <div className="flex gap-2 items-center">
                            <div className="w-4">
                              <img src={`/favicons/${row.tech}.webp`} />
                            </div>
                            {supportedIndexed[row.tech].name}
                          </div>
                          <div className="flex gap-1 items-center">
                            {row.previous_hits > 0 &&
                              (row.percent_change > 2 || row.percent_change < -2) && (
                                <Badge
                                  variant="outline"
                                  className={cn(
                                    'flex gap-1 rounded-lg text-tiny',
                                    row.percent_change > 0
                                      ? 'border-lime-600 text-lime-600'
                                      : 'border-red-400 text-red-400'
                                  )}
                                >
                                  {row.percent_change > 0 ? (
                                    <IconTrendingUp />
                                  ) : (
                                    <IconTrendingDown />
                                  )}{' '}
                                  {row.percent_change}%
                                </Badge>
                              )}
                            <div className="font-semibold w-8 text-right">{row.current_hits}</div>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export const Route = createFileRoute('/')({
  component: Index,
});

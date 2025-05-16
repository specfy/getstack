import { Link, createFileRoute } from '@tanstack/react-router';
import { useMemo } from 'react';

import { useTop } from '@/api/useTop';
import { TechBadge } from '@/components/TechBadge';
import { TrendsBadge } from '@/components/TrendsBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
        Most popular tech per category by number of repositories
      </div>
      <div className="grid grid-cols-3 gap-6">
        {sorted.map(({ category, rows }, index) => {
          const def = categories[category as TechType];
          const Icon = def.icon;
          return (
            <Link
              key={index}
              to={`/category/$category`}
              params={{ category }}
              className="border rounded flex flex-col justify-between hover:shadow-lg transition-shadow duration-300 bg-white p-1 h-[250px]"
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
                    const formatted = formatQuantity(row.current_hits);
                    return (
                      <li key={rowIndex}>
                        <div className="flex items-center justify-between text-xs h-5">
                          <TechBadge tech={row.tech} />
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
          );
        })}
      </div>
    </div>
  );
};

export const Route = createFileRoute('/')({
  component: Index,
});

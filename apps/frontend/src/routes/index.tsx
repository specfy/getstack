import { Link, createFileRoute } from '@tanstack/react-router';
import { useMemo } from 'react';

import { useTop } from '@/api/useTop';
import { stackDefinition, supportedIndexed } from '@/lib/stack';

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

  // Other SaaS+TOol
  'auth',
  'notification',
  'queue',

  // Events
  'monitoring',
  'analytics',
  'messaging',

  // Other
  'ci',
  'api',
  'app',
  'etl',
  'network',
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
      <div className="grid grid-cols-3 gap-6">
        {sorted.map(({ category, rows }, index) => {
          const def = stackDefinition[category as TechType];
          const Icon = def.icon;
          return (
            <Link
              key={index}
              to={`/category/$category`}
              params={{ category }}
              className="border rounded flex flex-col justify-between hover:shadow-lg transition-shadow duration-300 bg-white p-1 h-[200px]"
            >
              <div className="bg-neutral-50 p-4 h-full">
                <div className="flex items-center mb-4 gap-4">
                  <div className="w-8 h-8 bg-neutral-100 rounded-md p-1 border">
                    <Icon size={22} />
                  </div>
                  <h4 className="text-md font-semibold">{def.name}</h4>
                </div>
                <ul className="flex flex-col gap-2 ml-1">
                  {rows.map((row, rowIndex) => {
                    return (
                      <li key={rowIndex}>
                        <div className="flex justify-between text-xs">
                          <div>{supportedIndexed[row.tech].name}</div>
                          <div className="font-semibold">{row.hits}</div>
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

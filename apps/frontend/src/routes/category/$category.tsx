import { ResponsiveBump } from '@nivo/bump';
import { IconTrendingDown, IconTrendingUp } from '@tabler/icons-react';
import { createFileRoute } from '@tanstack/react-router';
import { useMemo } from 'react';

import { useCategory } from '@/api/useCategory';
import { Badge } from '@/components/ui/badge';
import { stackDefinition, supportedIndexed } from '@/lib/stack';
import { cn } from '@/lib/utils';

import type { BumpSerie } from '@nivo/bump';
import type { TechType } from '@specfy/stack-analyser';

const Category: React.FC = () => {
  const { category } = Route.useParams();

  const cat = stackDefinition[category as TechType];
  const { data, isLoading } = useCategory({ name: category });

  const chartData = useMemo(() => {
    if (!data) {
      return [];
    }

    const group: Record<string, BumpSerie<any, unknown>> = {};
    for (const row of data.data.top) {
      if (!(row.tech in group)) {
        group[row.tech] = { id: row.tech, data: [] };
      }
      const week = Number.parseInt(row.date_week.split('-')[1], 10);
      const date = new Date();
      date.setMonth(0);
      date.setDate(1);
      date.setDate(date.getDate() + (week - 1) * 7);
      group[row.tech].data.push({ x: row.date_week, y: row.position });
    }

    console.log(group);
    return Object.values(group);
  }, [data]);

  if (!cat) {
    return (
      <div>
        <h2 className="text-2xl">Not found</h2>
      </div>
    );
  }

  if (isLoading) {
    return <div>Loading</div>;
  }

  if (!data) {
    return null;
  }

  return (
    <div>
      <header className="mb-10">
        <h2 className="flex gap-4 text-2xl font-semibold">
          <div className="w-8 h-8 bg-neutral-100 rounded-md p-1 border">
            <cat.icon size={22} />
          </div>{' '}
          {cat.name}
        </h2>
      </header>

      <div className="mt-10">
        <h3 className="text-lg font-semibold mb-4">Top 10 Technologies Over Weeks</h3>
        <div style={{ height: 300 }}>
          <ResponsiveBump
            data={chartData}
            colors={{ scheme: 'tableau10' }}
            lineWidth={2}
            activeLineWidth={4}
            inactiveLineWidth={2}
            inactiveOpacity={0.15}
            pointSize={4}
            activePointSize={16}
            inactivePointSize={0}
            pointColor={{ theme: 'background' }}
            pointBorderWidth={3}
            activePointBorderWidth={3}
            pointBorderColor={{ from: 'serie.color' }}
            enableGridX={false}
            axisTop={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: '',
              legendPosition: 'middle',
              legendOffset: -36,
              truncateTickAt: 0,
            }}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: '',
              legendPosition: 'middle',
              legendOffset: 32,
              truncateTickAt: 0,
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: 'ranking',
              legendPosition: 'middle',
              legendOffset: -40,
              truncateTickAt: 0,
            }}
            margin={{ top: 40, right: 100, bottom: 40, left: 60 }}
            axisRight={null}
          />
        </div>
      </div>

      <div className="w-1/3 border border-gray-300 rounded-sm p-4">
        <div className="flex flex-col gap-3 ml-1">
          {data.data.list.map((row) => {
            return (
              <div className="flex justify-between text-xs h-5" key={row.tech}>
                <div className="flex gap-2 items-center">
                  <div className="w-4">
                    <img src={`/favicons/${row.tech}.webp`} />
                  </div>
                  {supportedIndexed[row.tech].name}
                </div>
                <div className="flex gap-1 items-center">
                  {row.previous_hits > 0 && (row.percent_change > 2 || row.percent_change < -2) && (
                    <Badge
                      variant="outline"
                      className={cn(
                        'flex gap-1 rounded-lg text-tiny',
                        row.percent_change > 0
                          ? 'border-lime-600 text-lime-600'
                          : 'border-red-400 text-red-400'
                      )}
                    >
                      {row.percent_change > 0 ? <IconTrendingUp /> : <IconTrendingDown />}{' '}
                      {row.percent_change}%
                    </Badge>
                  )}
                  <div className="font-semibold w-8 text-right">{row.current_hits}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export const Route = createFileRoute('/category/$category')({
  component: Category,
});

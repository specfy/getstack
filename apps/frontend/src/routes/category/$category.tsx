import { ResponsiveAreaBump } from '@nivo/bump';
import { ResponsivePie } from '@nivo/pie';
import { IconTrendingDown, IconTrendingUp } from '@tabler/icons-react';
import { createFileRoute } from '@tanstack/react-router';
import { useMemo } from 'react';

import { useCategory } from '@/api/useCategory';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { formatQuantity } from '@/lib/number';
import { listIndexed, stackDefinition } from '@/lib/stack';
import { cn } from '@/lib/utils';

import type { AreaBumpSerie } from '@nivo/bump';
import type { TechType } from '@specfy/stack-analyser';

const Category: React.FC = () => {
  const { category } = Route.useParams();

  const cat = stackDefinition[category as TechType];
  const { data, isLoading } = useCategory({ name: category });

  const [topNData, pieData] = useMemo(() => {
    if (!data) {
      return [[], []];
    }

    const topN: Record<
      string,
      AreaBumpSerie<
        { x: number | string; y: number; color: string },
        { tech: string; color: string }
      >
    > = {};
    for (const row of data.data.top) {
      if (!(row.tech in topN)) {
        const indexed = listIndexed[row.tech];
        topN[row.tech] = { id: indexed.name, tech: row.tech, color: indexed.color, data: [] };
      }
      const week = Number.parseInt(row.date_week.split('-')[1], 10);
      const date = new Date();
      date.setMonth(0);
      date.setDate(1);
      date.setDate(date.getDate() + (week - 1) * 7);
      topN[row.tech].data.push({
        x: row.date_week,
        y: Number.parseInt(row.hits, 10),
        color: topN[row.tech].color,
      });
    }

    const pie: { id: string; value: number; color: string }[] = [];
    for (const row of data.data.list) {
      const indexed = listIndexed[row.tech];
      pie.push({
        id: indexed.name,
        value: row.current_hits,
        color: indexed.color,
      });
    }

    return [Object.values(topN), pie];
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
        <h3 className="text-lg font-semibold mb-4">Top 10 over time</h3>
        <Card style={{ height: 300 }}>
          <ResponsiveAreaBump
            data={topNData!}
            margin={{ top: 1, right: 100, bottom: 20, left: 40 }}
            spacing={10}
            colors={{ scheme: 'paired' }}
            // colors={{ datum: 'data.color' }}
            borderColor={{
              from: 'color',
              modifiers: [['darker', 0.2]],
            }}
            startLabel={false}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: '',
              legendPosition: 'middle',
              legendOffset: 32,
              truncateTickAt: 0,
            }}
          />
        </Card>
      </div>

      <div className="grid grid-cols-2 mt-10 gap-10">
        <div>
          <h3 className="text-lg font-semibold mb-4">All tracked</h3>
          <Card>
            <div className="flex flex-col gap-3 px-4">
              {data.data.list.map((row) => {
                const formatted = formatQuantity(row.current_hits);
                return (
                  <div className="flex justify-between text-xs h-5" key={row.tech}>
                    <div className="flex gap-2 items-center">
                      <div className="w-4">
                        <img src={`/favicons/${row.tech}.webp`} />
                      </div>
                      {listIndexed[row.tech].name}
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
                            {row.percent_change > 0 ? <IconTrendingUp /> : <IconTrendingDown />}{' '}
                            {row.percent_change}%
                          </Badge>
                        )}
                      <div className="font-semibold w-8 text-right">{formatted}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4">Repartition</h3>
          <Card style={{ height: 350 }}>
            <ResponsivePie
              data={pieData}
              margin={{ top: 10, right: 30, bottom: 30, left: 10 }}
              innerRadius={0.5}
              padAngle={0.7}
              cornerRadius={3}
              colors={{ scheme: 'paired' }}
              // colors={{ datum: 'data.color' }}
              activeOuterRadiusOffset={8}
              borderWidth={1}
              borderColor={{
                from: 'color',
                modifiers: [['darker', 0.1]],
              }}
              arcLinkLabelsSkipAngle={10}
              arcLinkLabelsTextColor="#333333"
              arcLinkLabelsThickness={2}
              arcLinkLabelsColor={{ from: 'color' }}
              arcLabelsSkipAngle={10}
              arcLabelsTextColor={{
                from: 'color',
                modifiers: [['darker', 1]],
              }}
              defs={[
                {
                  id: 'dots',
                  type: 'patternDots',
                  background: 'inherit',
                  color: 'rgba(255, 255, 255, 0.3)',
                  size: 4,
                  padding: 1,
                  stagger: true,
                },
                {
                  id: 'lines',
                  type: 'patternLines',
                  background: 'inherit',
                  color: 'rgba(255, 255, 255, 0.3)',
                  rotation: -45,
                  lineWidth: 6,
                  spacing: 10,
                },
              ]}
            />
          </Card>
        </div>
      </div>
    </div>
  );
};

export const Route = createFileRoute('/category/$category')({
  component: Category,
});

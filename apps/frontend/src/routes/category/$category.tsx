import { ResponsiveAreaBump } from '@nivo/bump';
import { ResponsivePie } from '@nivo/pie';
import { createFileRoute } from '@tanstack/react-router';
import { useMemo } from 'react';

import { useCategory, useCategoryLeaderboard } from '@/api/useCategory';
import { TechBadge } from '@/components/TechBadge';
import { TrendsBadge } from '@/components/TrendsBadge';
import { Card } from '@/components/ui/card';
import { formatQuantity } from '@/lib/number';
import type { CategoryDefinition } from '@/lib/stack';
import { listIndexed, stackDefinition } from '@/lib/stack';

import type { AreaBumpSerie } from '@nivo/bump';
import type { TechItem, TechType } from '@specfy/stack-analyser';
import type { ExtendedTechItem } from '@stackhub/backend/dist/utils/stacks';

const Category: React.FC = () => {
  const { category } = Route.useParams();

  const cat = stackDefinition[category as TechType] as CategoryDefinition | undefined;
  const { data, isLoading } = useCategory({ name: category });
  const { data: leaderboard } = useCategoryLeaderboard({ name: category });

  const topNData = useMemo(() => {
    if (!data) {
      return [];
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

    return Object.values(topN);
  }, [data, category]);

  const [pieData, nonFoundTech] = useMemo(() => {
    if (!leaderboard) {
      return [[], []];
    }

    const discoveredTech = new Set(leaderboard.data.map((row) => row.tech));
    const nonFound: (ExtendedTechItem & TechItem)[] = [];

    const pie: { id: string; value: number; color: string }[] = [];
    for (const row of leaderboard.data) {
      const indexed = listIndexed[row.tech];
      pie.push({ id: indexed.name, value: row.current_hits, color: indexed.color });
    }

    // Identify undiscovered tech by diffing listIndexed for the category with discoveredTech
    for (const item of Object.values(listIndexed)) {
      if (item.type === category && !discoveredTech.has(item.key)) {
        nonFound.push(item);
      }
    }

    return [pie, nonFound];
  }, [leaderboard, category]);

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
      <header className="mb-10 flex flex-col gap-2">
        <h2 className="flex gap-4 ">
          <div className="w-12 h-12 bg-neutral-100 rounded-md p-1 border">
            <cat.icon size={39} />
          </div>{' '}
          <div>
            <div className="text-xs text-gray-400">Category</div>
            <div className="text-2xl font-semibold">{cat.name}</div>
          </div>
        </h2>
        <h3 className="text-lg text-neutral-500">{cat.description}</h3>
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

      <div className="grid grid-cols-3 mt-10 gap-10">
        <div className="col-span-1">
          <h3 className="text-lg font-semibold mb-4">Leaderboard</h3>
          <div className="text-xs text-neutral-400 mb-2">
            Every {cat.name} by number of repositories
          </div>
          <Card>
            <div className="flex flex-col px-4">
              {leaderboard?.data.map((row) => {
                const formatted = formatQuantity(row.current_hits);
                return (
                  <div className="flex justify-between items-center" key={row.tech}>
                    <TechBadge tech={row.tech} />
                    <div className="flex gap-1 items-center">
                      {row.previous_hits > 0 &&
                        (row.percent_change > 0.5 || row.percent_change < -0.5) && (
                          <TrendsBadge pct={row.percent_change} />
                        )}
                      <div className="font-semibold w-8 text-right text-xs">{formatted}</div>
                    </div>
                  </div>
                );
              })}
              {nonFoundTech.length > 0 && (
                <div className="border-t-1 pt-2 mt-2">
                  <div className="text-neutral-400 text-xs mb-2">Never found</div>
                  {nonFoundTech.map((row) => (
                    <div
                      className="flex justify-between items-center text-xs text-gray-400"
                      key={row.key}
                    >
                      <TechBadge tech={row.key} />
                      <div className="font-semibold w-8 text-right">0</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </div>
        <div className="col-span-2">
          <h3 className="text-lg font-semibold mb-4">Repartition</h3>
          <div className="text-xs text-neutral-400 mb-2">
            Every {cat.name} by number of repositories
          </div>
          <Card style={{ height: 350 }}>
            <ResponsivePie
              data={pieData}
              margin={{ top: 20, right: 30, bottom: 30, left: 10 }}
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

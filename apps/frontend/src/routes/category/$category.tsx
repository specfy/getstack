import { ResponsiveAreaBump } from '@nivo/bump';
import { ResponsivePie } from '@nivo/pie';
import { IconTrendingDown, IconTrendingUp } from '@tabler/icons-react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, notFound } from '@tanstack/react-router';
import { useMemo } from 'react';

import { optionsCategoryLeaderboardOptions, optionsGetCategory } from '@/api/useCategory';
import { DataProgress } from '@/components/DataProgress';
import { NotFound } from '@/components/NotFound';
import { Report } from '@/components/Report';
import { TT } from '@/components/TT';
import { TechBadge } from '@/components/TechBadge';
import { TrendsBadge } from '@/components/TrendsBadge';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { APP_URL } from '@/lib/envs';
import { formatQuantity } from '@/lib/number';
import { seo } from '@/lib/seo';
import type { CategoryDefinition } from '@/lib/stack';
import { categories, listIndexed } from '@/lib/stack';
import { cn } from '@/lib/utils';

import type { TechItemWithExtended } from '@getstack/backend/dist/utils/stacks';
import type { TechnologyByCategoryByWeekWithTrend } from '@getstack/backend/src/types/endpoint';
import type { AreaBumpSerie } from '@nivo/bump';
import type { TechType } from '@specfy/stack-analyser';

const Category: React.FC = () => {
  const { category } = Route.useParams();

  const cat = categories[category as TechType] as CategoryDefinition | undefined;
  const { data } = Route.useLoaderData();
  const { data: leaderboard } = useSuspenseQuery(
    optionsCategoryLeaderboardOptions({ name: category })
  );

  const topNData = useMemo(() => {
    const topN: Record<
      string,
      AreaBumpSerie<{ x: number | string; y: number }, { tech: string }>
    > = {};

    for (const row of data.top) {
      if (!(row.tech in topN)) {
        const indexed = listIndexed[row.tech];
        topN[row.tech] = { id: indexed.name, tech: row.tech, data: [] };
      }
      const week = Number.parseInt(row.date_week.split('-')[1], 10);
      const date = new Date();
      date.setMonth(0);
      date.setDate(1);
      date.setDate(date.getDate() + (week - 1) * 7);
      topN[row.tech].data.push({
        x: row.date_week,
        y: Number.parseInt(row.hits, 10),
      });
    }

    return Object.values(topN);
  }, [data, category]);

  const { pie, winner, looser, nonFoundTech, top10, rest } = useMemo(() => {
    const tmp: { id: string; value: number }[] = [];
    let up: TechnologyByCategoryByWeekWithTrend | undefined;
    let down: TechnologyByCategoryByWeekWithTrend | undefined;
    for (const row of leaderboard.data) {
      const indexed = listIndexed[row.tech];
      tmp.push({ id: indexed.name, value: row.current_hits });
      if ((!up || row.percent_change > up.percent_change) && row.percent_change > 0.1) {
        up = row;
      } else if ((!down || row.percent_change < down.percent_change) && row.percent_change < -0.1) {
        down = row;
      }
    }

    // Identify undiscovered tech by diffing listIndexed for the category with discoveredTech
    const discoveredTech = new Set(leaderboard.data.map((row) => row.tech));
    const nonFound: TechItemWithExtended[] = [];
    for (const item of Object.values(listIndexed)) {
      if (item.type === category && !discoveredTech.has(item.key)) {
        nonFound.push(item);
      }
    }

    return {
      pie: tmp,
      winner: up,
      looser: down,
      nonFoundTech: nonFound,
      top10: leaderboard.data.slice(0, 10),
      rest: leaderboard.data.slice(10),
    };
  }, [leaderboard]);

  if (!cat) {
    return <NotFound />;
  }

  return (
    <div>
      <header className="mb-10 flex flex-col gap-2 mt-10">
        <div className="flex gap-4 ">
          <div className="w-14 h-14 bg-neutral-100 rounded-md p-1 border">
            <cat.icon size={46} />
          </div>{' '}
          <div className="flex flex-col gap-1">
            <div className="text-sm text-gray-400 leading-5">Category</div>
            <h1 className="text-3xl font-semibold font-serif leading-8">{cat.name}</h1>
          </div>
        </div>
        <h3 className="mt-5 max-w-2xl text-pretty text-gray-600 md:text-lg font-serif font-light">
          {cat.description}
        </h3>
      </header>

      <div className="mt-10">
        <h3 className="text-lg font-semibold mb-1 font-serif">Top {top10.length}</h3>
        <div className="grid md:grid-cols-6 md:gap-14">
          <div className="md:col-span-2">
            <div className="text-xs text-neutral-400 pt-1.5">
              By number of repositories in GitHub
            </div>
            <Card className="border-transparent p-0">
              <div className="flex flex-col gap-1 ">
                {top10.map((row) => {
                  const formatted = formatQuantity(row.current_hits);
                  const name = listIndexed[row.tech].name;
                  return (
                    <div
                      className="flex justify-between items-center"
                      key={row.tech}
                      aria-description={`${name} is used by ${formatted} repositories`}
                    >
                      <TechBadge tech={row.tech} size="l" border />
                      <div className="flex gap-1 items-center">
                        {row.previous_hits > 0 &&
                          (row.percent_change > 0.5 || row.percent_change < -0.5) && (
                            <TrendsBadge pct={row.percent_change} />
                          )}
                        <TT description={`${name} is used by ${formatted} repositories`}>
                          <div className="font-semibold w-8 text-right text-xs">{formatted}</div>
                        </TT>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
          <div className="md:col-span-4">
            <div className="flex justify-between items-center">
              <div className="text-xs text-neutral-400">Top {top10.length} over time</div>
              <div>
                <DataProgress />
              </div>
            </div>
            <Card style={{ height: Math.max(200, top10.length * 40) }} className="mt-4">
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
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 mt-10 gap-y-10 md:gap-x-14">
        <div className="md:col-span-1">
          <hr />

          {(rest.length > 0 || nonFoundTech.length > 0) && (
            <Card className="border-transparent p-0 mt-10">
              <div className="flex flex-col gap-1">
                {rest.map((row) => {
                  const formatted = formatQuantity(row.current_hits);
                  return (
                    <div className="flex justify-between items-center" key={row.tech}>
                      <TechBadge tech={row.tech} size="md" border />
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
                  <div className={cn(rest.length > 0 && 'border-t-1 pt-10 mt-10')}>
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
          )}
        </div>
        <div className="col-span-2">
          <div className="grid md:grid-cols-2 gap-6">
            {winner && (
              <Card>
                <CardHeader className="relative">
                  <CardDescription>Best</CardDescription>
                  <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
                    <TechBadge tech={winner.tech} size="xl" />
                  </CardTitle>
                  <div className="absolute right-4 top-0">
                    <TrendsBadge pct={winner.percent_change} />
                  </div>
                </CardHeader>

                <CardFooter className="flex-col items-start gap-1 text-sm">
                  <div className="line-clamp-1 flex gap-2 font-medium">
                    Trending up this week <IconTrendingUp className="size-4" />
                  </div>
                  <div className="text-muted-foreground">
                    Found in {winner.trend} more repo{winner.trend > 1 && 's'}
                  </div>
                </CardFooter>
              </Card>
            )}
            {looser && (
              <Card>
                <CardHeader className="relative">
                  <CardDescription>Worst</CardDescription>
                  <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
                    <TechBadge tech={looser.tech} size="xl" />
                  </CardTitle>
                  <div className="absolute right-4 top-0">
                    <TrendsBadge pct={looser.percent_change} />
                  </div>
                </CardHeader>

                <CardFooter className="flex-col items-start gap-1 text-sm">
                  <div className="line-clamp-1 flex gap-2 font-medium">
                    Trending down this week <IconTrendingDown className="size-4" />
                  </div>
                  <div className="text-muted-foreground">
                    Found in {looser.trend} less repo{looser.trend > 1 && 's'}
                  </div>
                </CardFooter>
              </Card>
            )}
          </div>
          <h3 className="text-lg font-semibold mt-10 font-serif">Full Repartition</h3>
          <div className="text-xs text-neutral-400 mb-4">
            Every {cat.name} by number of repositories using this technology in GitHub
          </div>
          <Card style={{ height: 350 }}>
            <ResponsivePie
              data={pie}
              margin={{ top: 20, right: 100, bottom: 30, left: 100 }}
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
          <div className="mt-10">
            <Report />
          </div>
        </div>
      </div>
    </div>
  );
};

export const Route = createFileRoute('/category/$category')({
  loader: async ({ params: { category }, context }) => {
    const cat = categories[category as TechType] as CategoryDefinition | undefined;

    if (!cat) {
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw notFound();
    }

    const data = await context.queryClient.ensureQueryData(optionsGetCategory({ name: category }));
    await context.queryClient.ensureQueryData(
      optionsCategoryLeaderboardOptions({ name: category })
    );
    return data;
  },
  head: (ctx) => {
    const cat = categories[ctx.params.category as TechType] as CategoryDefinition | undefined;
    if (!cat) {
      return {};
    }

    const url = `${APP_URL}/category/${ctx.params.category}`;
    return {
      meta: [
        ...seo({
          title: `${cat.name} trends - getStack`,
          description: `Discover most popular ${cat.name} and alternatives across open-source GitHub repositories`,
          url,
        }),
      ],
      links: [{ rel: 'canonical', href: url }],
    };
  },
  component: Category,
});

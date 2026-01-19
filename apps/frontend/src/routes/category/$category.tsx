import { ResponsiveAreaBump } from '@nivo/bump';
import { ResponsivePie } from '@nivo/pie';
import { IconTrendingDown, IconTrendingUp } from '@tabler/icons-react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Link, createFileRoute, notFound } from '@tanstack/react-router';
import { addWeeks, formatDate, startOfISOWeek } from 'date-fns';
import { useMemo, useState } from 'react';

import { optionsCategoryLeaderboardOptions, optionsGetCategory } from '@/api/useCategory';
import { DataProgress } from '@/components/DataProgress';
import { NotFound } from '@/components/NotFound';
import { Report } from '@/components/Report';
import { TechBadge, TechBadgeLite } from '@/components/TechBadge';
import { TrendsBadge } from '@/components/TrendsBadge';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AREA_BUMP_GRAY_10, calculateAreaBumpTickValues, hexToRgba } from '@/lib/chart';
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
  const [hoveredTech, setHoveredTech] = useState<null | string>(null);

  const cat = categories[category as TechType] as CategoryDefinition | undefined;
  const { data } = Route.useLoaderData();
  const { data: leaderboard } = useSuspenseQuery(
    optionsCategoryLeaderboardOptions({ name: category })
  );

  const [topNData, tickValues] = useMemo(() => {
    const topN: Record<
      string,
      AreaBumpSerie<{ x: number | string; y: number }, { tech: string }>
    > = {};

    for (const row of data.top) {
      if (!(row.tech in topN)) {
        const indexed = listIndexed[row.tech];
        topN[row.tech] = { id: indexed.name, tech: row.tech, data: [] };
      }

      const [year, week] = row.date_week.split('-').map(Number);
      const parsedDate = addWeeks(startOfISOWeek(new Date(year, 0, 1)), week - 1);

      topN[row.tech].data.push({
        x: formatDate(parsedDate, 'MMM dd'),
        y: Number.parseInt(row.hits, 10),
      });
    }

    const tmp = Object.values(topN);

    return [tmp, calculateAreaBumpTickValues(tmp)];
  }, [data, category]);

  const seriesColorByTech = useMemo(() => {
    const m = new Map<string, string>();
    for (let i = 0; i < topNData.length; i++) {
      const serie = topNData[i] as unknown as { tech?: string };
      if (typeof serie.tech === 'string') {
        m.set(serie.tech, AREA_BUMP_GRAY_10[i % AREA_BUMP_GRAY_10.length] ?? '#737373');
      }
    }
    return m;
  }, [topNData]);

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
    <div className="relative mx-auto max-w-screen-xl px-4">
      <header className="my-10 flex flex-col gap-2">
        <div className="flex gap-4 ">
          <div className="flex size-20 items-center justify-center border bg-neutral-100 p-1">
            <cat.icon size={70} />
          </div>
          <div className="flex flex-col gap-3">
            <div className="font-mono text-[10px] leading-5 text-gray-400 ">Category</div>

            <h1 className="font-serif text-5xl font-semibold leading-8">{cat.name}</h1>
          </div>
        </div>
        <div className="text-s mt-2 max-w-2xl text-pretty font-mono font-light text-gray-600">
          {cat.description}
        </div>
      </header>

      <div className="mt-14">
        <div className="grid md:grid-cols-6 md:gap-8">
          <div className="md:col-span-2">
            <h3 className="font-serif text-lg font-semibold">
              Top {top10.length} by number of repositories
            </h3>
            <p className="font-mono text-xs text-gray-400">
              Every {cat.name} by number of repositories using this technology in GitHub
            </p>
            <Card className="border-transparent p-0">
              <div className="flex flex-col gap-1 ">
                {top10.map((row, i) => {
                  const formatted = formatQuantity(row.current_hits);
                  const name = listIndexed[row.tech].name;
                  return (
                    <Link
                      key={row.tech}
                      className={cn(
                        'group flex h-6 cursor-pointer items-center justify-between border bg-white px-4 py-5 text-xs transition-colors hover:bg-gray-50',
                        hoveredTech === row.tech && 'bg-gray-50'
                      )}
                      aria-description={`${name} is used by ${formatted} repositories`}
                      to={`/tech/$techKey`}
                      params={{ techKey: row.tech }}
                      onMouseEnter={() => setHoveredTech(row.tech)}
                      onMouseLeave={() => setHoveredTech(null)}
                      onFocus={() => setHoveredTech(row.tech)}
                      onBlur={() => setHoveredTech(null)}
                    >
                      <div className="flex items-center gap-4">
                        <span className="w-4 font-mono text-gray-300">#{i + 1}</span>{' '}
                        <TechBadgeLite tech={row.tech} size="xl" />
                      </div>
                      <div className="flex items-center gap-1">
                        {row.previous_hits > 0 &&
                          (row.percent_change > 0.5 || row.percent_change < -0.5) && (
                            <TrendsBadge pct={row.percent_change} />
                          )}
                        <div className="flex items-center justify-end text-xs font-semibold tabular-nums">
                          <span className="inline-block transition-transform duration-200">
                            {formatted}
                          </span>
                          <span className="text-muted-foreground group-hover:max-w-18 ml-1 inline-block max-w-0 overflow-hidden whitespace-nowrap font-light opacity-0 transition-all duration-200 group-hover:opacity-100">
                            repositories
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </Card>
          </div>
          <div className="md:col-span-4">
            <div className="mt-10 flex items-center justify-between pt-0.5">
              <div className="font-mono text-xs text-neutral-400">Trends over time</div>
              <div>
                <DataProgress />
              </div>
            </div>
            <Card style={{ height: 456 }} className="mt-4 !p-0">
              <ResponsiveAreaBump
                data={topNData}
                margin={{ top: 10, right: 100, bottom: 30, left: 35 }}
                colors={(serie) => {
                  const tech = (serie as unknown as { tech?: string }).tech;
                  const base = (tech && seriesColorByTech.get(tech)) ?? '#737373';

                  if (!hoveredTech || !tech) return base;
                  return tech === hoveredTech ? base : hexToRgba(base, 0.15);
                }}
                theme={{
                  axis: {
                    ticks: {
                      text: {
                        fill: 'var(--muted-foreground)',
                        fontSize: 10,
                        fontFamily: 'var(--font-mono)',
                      },
                    },
                  },
                }}
                spacing={10}
                enableGridX={false}
                startLabel={false}
                axisTop={null}
                axisBottom={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                  legend: '',
                  legendPosition: 'middle',
                  legendOffset: 32,
                  truncateTickAt: 0,
                  tickValues,
                }}
              />
            </Card>
          </div>
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-y-10 md:grid-cols-3 md:gap-x-14">
        <div className="md:col-span-1">
          <hr />

          {(rest.length > 0 || nonFoundTech.length > 0) && (
            <Card className="mt-10 border-transparent p-0">
              <div className="flex flex-col gap-1">
                {rest.map((row) => {
                  const formatted = formatQuantity(row.current_hits);
                  return (
                    <div className="flex items-center justify-between" key={row.tech}>
                      <TechBadge tech={row.tech} size="md" border />
                      <div className="flex items-center gap-1">
                        {row.previous_hits > 0 &&
                          (row.percent_change > 0.5 || row.percent_change < -0.5) && (
                            <TrendsBadge pct={row.percent_change} />
                          )}
                        <div className="w-8 text-right text-xs font-semibold">{formatted}</div>
                      </div>
                    </div>
                  );
                })}
                {nonFoundTech.length > 0 && (
                  <div className={cn(rest.length > 0 && 'border-t-1 mt-10 pt-10')}>
                    <div className="mb-2 text-xs text-neutral-400">Never found</div>
                    {nonFoundTech.map((row) => (
                      <div
                        className="flex items-center justify-between text-xs text-gray-400"
                        key={row.key}
                      >
                        <TechBadge tech={row.key} />
                        <div className="w-8 text-right font-semibold">0</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>
        <div className="col-span-2">
          <div className="grid gap-6 md:grid-cols-2">
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
          <h3 className="mt-10 font-serif text-lg font-semibold">Full Repartition</h3>
          <div className="mb-4 text-xs text-neutral-400">
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

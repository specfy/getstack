import { ResponsiveAreaBump } from '@nivo/bump';
import { ResponsiveTreeMap } from '@nivo/treemap';
import { IconTrendingDown, IconTrendingUp } from '@tabler/icons-react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Link, createFileRoute, notFound } from '@tanstack/react-router';
import { addWeeks, formatDate, startOfISOWeek } from 'date-fns';
import { useMemo, useState } from 'react';
import { useDebounce } from 'react-use';

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
import type {
  TechnologyByCategoryByWeekWithTrend,
  TechnologyTopN,
} from '@getstack/backend/src/types/endpoint';
import type { AreaBumpSerie } from '@nivo/bump';
import type { TechType } from '@specfy/stack-analyser';

const Category: React.FC = () => {
  const { category } = Route.useParams();

  const cat = categories[category as TechType] as CategoryDefinition | undefined;
  const { data } = Route.useLoaderData();
  const { data: leaderboard } = useSuspenseQuery(
    optionsCategoryLeaderboardOptions({ name: category })
  );

  const { pie, winner, looser, nonFoundTech, rest } = useMemo(() => {
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
      rest: leaderboard.data.slice(10),
    };
  }, [leaderboard]);

  const treeMapData = useMemo(() => {
    return { id: 'root', children: pie };
  }, [pie]);

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

      <Top10 data={data.top} leaderboard={leaderboard.data} category={cat} />

      <div className="mt-10" style={{ height: 350 }}>
        <ResponsiveTreeMap
          data={treeMapData}
          identity="id"
          value="value"
          leavesOnly
          margin={{ top: 10, right: 0, bottom: 10, left: 0 }}
          colors={AREA_BUMP_GRAY_10}
          borderWidth={1}
          borderColor={{
            from: 'color',
            modifiers: [['darker', 0.1]],
          }}
          label={(node) => {
            const w = (node as unknown as { width?: number }).width ?? 0;
            const h = (node as unknown as { height?: number }).height ?? 0;

            const hits = formatQuantity(node.value);

            // When the tile is small, show only hits.
            if (w < 100 || h < 18 || w * h < 2000) return hits;

            return `${node.id} (${hits})`;
          }}
          labelSkipSize={19}
          orientLabel={false}
          labelTextColor={{ from: 'color', modifiers: [['darker', 3]] }}
          parentLabelTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
          tooltip={({ node }) => (
            <div className="bg-background rounded-md border px-2 py-1 text-xs shadow-sm">
              <div className="font-medium">{node.id}</div>
              <div className="text-muted-foreground">{formatQuantity(node.value as number)}</div>
            </div>
          )}
        />
      </div>

      <div className="mt-10">
        {(rest.length > 0 || nonFoundTech.length > 0) && (
          <div className="grid grid-cols-3 gap-2">
            {rest.map((row, i) => {
              return <TechBloc position={i + 11} key={row.tech} row={row} />;
            })}
            {nonFoundTech.map((row, i) => {
              return (
                <TechBloc
                  key={row.key}
                  position={i + 10 + rest.length + 1}
                  row={{
                    category: category as TechType,
                    tech: row.key,
                    current_hits: 0,
                    previous_hits: 0,
                    trend: 0,
                    percent_change: 0,
                  }}
                  className="opacity-50"
                />
              );
            })}
          </div>
        )}
      </div>
      <div className="col-span-2">
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
      <div className="mt-10">
        <Report />
      </div>
    </div>
  );
};

export const Top10: React.FC<{
  data: TechnologyTopN[];
  leaderboard: TechnologyByCategoryByWeekWithTrend[];
  category: CategoryDefinition;
}> = ({ data, leaderboard, category }) => {
  const [hoveredTech, setHoveredTech] = useState<null | string>(null);
  const [debouncedHoveredTech, setDebouncedHoveredTech] = useState<null | string>(null);
  useDebounce(() => setDebouncedHoveredTech(hoveredTech), 100, [hoveredTech]);
  const top10 = useMemo(() => {
    return leaderboard.slice(0, 10);
  }, [leaderboard]);

  const [topNData, tickValues] = useMemo(() => {
    const topN: Record<
      string,
      AreaBumpSerie<{ x: number | string; y: number }, { tech: string }>
    > = {};

    for (const row of data) {
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
  }, [data]);

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

  return (
    <div className="mt-14">
      <div className="grid md:grid-cols-6 md:gap-8">
        <div className="md:col-span-2">
          <h3 className="font-serif text-lg font-semibold">
            Top {top10.length} by number of repositories
          </h3>
          <p className="font-mono text-xs text-gray-400">
            Every {category.name} by number of repositories using this technology in GitHub
          </p>
          <Card className="border-transparent p-0">
            <div className="flex flex-col gap-1 ">
              {top10.map((row, i) => {
                return (
                  <TechBloc
                    position={i + 1}
                    key={row.tech}
                    row={row}
                    hoveredTech={hoveredTech}
                    onMouseEnter={() => setHoveredTech(row.tech)}
                    onMouseLeave={() => setHoveredTech(null)}
                    onFocus={() => setHoveredTech(row.tech)}
                    onBlur={() => setHoveredTech(null)}
                  />
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

                if (!debouncedHoveredTech || !tech) return base;
                return tech === debouncedHoveredTech ? base : hexToRgba(base, 0.15);
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
  );
};

export const TechBloc: React.FC<
  {
    row: TechnologyByCategoryByWeekWithTrend;
    hoveredTech?: null | string;
    position: number;
    className?: string;
  } & React.AnchorHTMLAttributes<HTMLAnchorElement>
> = ({ row, hoveredTech, position, className, ...props }) => {
  const formatted = formatQuantity(row.current_hits);
  const tech = listIndexed[row.tech];

  return (
    <Link
      className={cn(
        'group flex h-6 cursor-pointer items-center justify-between border bg-white px-4 py-5 text-xs transition-colors hover:bg-gray-50',
        hoveredTech === row.tech && 'bg-gray-50',
        className
      )}
      aria-description={`${tech.name} is used by ${formatted} repositories`}
      {...props}
      to={`/tech/$techKey`}
      params={{ techKey: row.tech }}
    >
      <div className="flex items-center gap-4">
        <span className="w-5 font-mono text-gray-300">#{position}</span>
        <TechBadgeLite tech={row.tech} size="xl" />
      </div>
      <div className="flex items-center gap-1">
        {row.previous_hits > 0 && (row.percent_change > 0.5 || row.percent_change < -0.5) && (
          <TrendsBadge pct={row.percent_change} />
        )}
        <div className="flex items-center justify-end text-xs font-semibold tabular-nums">
          <span className="inline-block transition-transform duration-200">{formatted}</span>
          <span className="text-muted-foreground group-hover:max-w-18 ml-1 inline-block max-w-0 overflow-hidden whitespace-nowrap font-light opacity-0 transition-all duration-200 group-hover:opacity-100">
            repositories
          </span>
        </div>
      </div>
    </Link>
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

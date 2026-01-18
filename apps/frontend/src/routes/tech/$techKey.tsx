import { ResponsiveLine } from '@nivo/line';
import {
  IconBrandGithub,
  IconDots,
  IconStar,
  IconTrendingDown,
  IconTrendingUp,
  IconWorld,
} from '@tabler/icons-react';
import { Link, createFileRoute, notFound } from '@tanstack/react-router';
import { addWeeks, startOfISOWeek } from 'date-fns';
import { useMemo } from 'react';

import { optionsCategoryLeaderboardOptions, useCategoryLeaderboard } from '@/api/useCategory';
import {
  optionsGetTechnology,
  optionsRelatedTechnologyOptions,
  useRelatedTechnology,
} from '@/api/useTechnology';
import { DataProgress } from '@/components/DataProgress';
import { NotFound } from '@/components/NotFound';
import { Report } from '@/components/Report';
import { TT } from '@/components/TT';
import { TechBadge } from '@/components/TechBadge';
import { TopRepositories } from '@/components/TopRepository';
import { TrendsBadge } from '@/components/TrendsBadge';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { APP_URL } from '@/lib/envs';
import { formatQuantity } from '@/lib/number';
import { seo } from '@/lib/seo';
import { categories, listIndexed } from '@/lib/stack';
import { cn } from '@/lib/utils';

import type { TechItemWithExtended } from '@getstack/backend/dist/utils/stacks';
import type { TechnologyByCategoryByWeekWithTrend } from '@getstack/backend/src/types/endpoint';
import type { LineSeries } from '@nivo/line';
import type { AllowedKeys } from '@specfy/stack-analyser';

const Tech: React.FC = () => {
  const { techKey } = Route.useParams();

  const tech = listIndexed[techKey as AllowedKeys] as TechItemWithExtended | undefined;
  const { data } = Route.useLoaderData();
  const { data: leaderboard, isLoading: isLoadingLeaderboard } = useCategoryLeaderboard({
    name: tech?.type,
  });

  const [current, trend, diff] = useMemo(() => {
    if (data.volume.length <= 0) {
      return [null, null, 0];
    }

    const crr = data.volume.at(-1)!;
    if (data.volume.length <= 1) {
      return [crr, null, 0];
    }

    const lastWeek = data.volume.at(-2)!;
    const pct = (crr.hits * 100) / lastWeek.hits - 100;
    return [
      crr,
      pct > 0.5 || pct < -0.5 ? Number.parseFloat(pct.toFixed(1)) : null,
      Math.abs(crr.hits - lastWeek.hits),
    ];
  }, [data]);

  const [repoCount, stars] = useMemo(() => {
    if (!current) {
      return ['0', '0'];
    }
    return [formatQuantity(current.hits), formatQuantity(data.cumulatedStars)];
  }, [current]);

  const chartData = useMemo<LineSeries[]>(() => {
    return [
      {
        id: 'volume',
        data: data.volume.map((r) => {
          // Parse YYYY-WW into a valid date
          const [year, week] = r.date_week.split('-').map(Number);
          const parsedDate = addWeeks(startOfISOWeek(new Date(year, 0, 1)), week - 1);
          return { y: r.hits, x: parsedDate };
        }),
      },
    ];
  }, [data]);

  const [position, inCategory] = useMemo<
    [number, ({ position: number } & TechnologyByCategoryByWeekWithTrend)[]]
  >(() => {
    if (!leaderboard) {
      return [0, []];
    }

    const tmp = leaderboard.data.findIndex((v) => v.tech === techKey);
    if (tmp === -1) {
      return [
        0,
        leaderboard.data.slice(0, 4).map((item, index) => {
          return { ...item, position: index + 1 };
        }),
      ];
    }

    const start = Math.max(0, tmp - 2);
    const end = Math.min(leaderboard.data.length, tmp === 0 ? 4 : tmp + 3);

    const surroundingTechs = leaderboard.data.slice(start, end).map((item, index) => {
      return { ...item, position: start + index + 1 };
    });

    return [tmp + 1, surroundingTechs];
  }, [leaderboard, techKey]);

  if (!tech) {
    return <NotFound />;
  }

  return (
    <div className="relative mx-auto max-w-screen-xl px-4">
      <header className="mt-10 flex justify-between gap-2">
        <div className="flex items-start gap-4">
          <div className="flex size-20 items-center justify-center border bg-white p-2">
            <img
              src={`/favicons/${tech.key}.webp`}
              alt={`${tech.name} logo`}
              width={64}
              height={64}
            />
          </div>{' '}
          <div className="flex flex-col gap-3">
            <Link
              to="/category/$category"
              params={{ category: tech.type }}
              className="font-mono text-[10px] leading-5 text-gray-400 hover:text-gray-900"
            >
              Category [{categories[tech.type].name}]
            </Link>
            <h1 className="font-serif text-5xl font-semibold leading-8">{tech.name}</h1>
          </div>
        </div>
        {position > 0 && (
          <div
            aria-description={`${tech.name} is ranked #${position} in ${categories[tech.type].name}`}
            className="flex flex-col items-end font-mono"
          >
            <div className="text-right text-[10px] text-gray-500">position in category</div>
            <div className="flex items-start text-right font-serif text-4xl font-semibold">
              <span className="font-normal ">#</span>
              <span className="text-7xl">{position}</span>
            </div>
          </div>
        )}
      </header>
      {tech.description && (
        <div className="text-s mt-2 max-w-2xl text-pretty font-mono font-light text-gray-600">
          {tech.description}
        </div>
      )}

      <div className="mt-10">
        <div className="mb-2 flex justify-end">
          <DataProgress />
        </div>
        {data.volume.length > 0 && (
          <div className="grid grid-cols-1 gap-y-4 md:grid-cols-4 md:gap-4">
            <Card className="">
              <CardHeader className="relative">
                <CardDescription>GitHub Repositories</CardDescription>
                <CardTitle className="@[250px]/card:text-3xl font-mono text-4xl font-semibold tabular-nums">
                  {repoCount}
                </CardTitle>

                {trend !== null && (
                  <div className="absolute right-4 top-0">
                    <TrendsBadge pct={trend} />
                  </div>
                )}
              </CardHeader>
              {trend === null ? (
                <CardFooter className="flex-col items-start gap-1 font-mono text-xs leading-tight text-gray-400">
                  No noticeable change in usage since last week
                </CardFooter>
              ) : (
                <CardFooter className="flex-col items-start gap-1 text-sm">
                  {trend > 0 ? (
                    <>
                      <div className="line-clamp-1 flex gap-2 font-medium">
                        Trending up this week <IconTrendingUp className="size-4" />
                      </div>
                      <div className="text-muted-foreground">
                        Found in {diff} more repo{diff > 1 && 's'}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="line-clamp-1 flex gap-2 font-medium">
                        Trending down this week <IconTrendingDown className="size-4" />
                      </div>
                      <div className="text-muted-foreground">
                        Removed in {diff} repo{diff > 1 && 's'}
                      </div>
                    </>
                  )}
                </CardFooter>
              )}
            </Card>
            <Card style={{ height: 'auto', minHeight: '200px' }} className="col-span-3 py-0">
              <ResponsiveLine
                data={chartData}
                margin={{ top: 20, right: 25, bottom: 20, left: 25 }}
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
                xScale={{ type: 'time', format: '%Y-%m-%d', useUTC: false }}
                xFormat="time:%b %d"
                enableArea={true}
                axisTop={null}
                axisRight={null}
                colors={['black']}
                areaOpacity={0.05}
                enableGridX={false}
                enableGridY={false}
                pointSize={6}
                pointColor={'black'}
                pointBorderWidth={2}
                pointBorderColor={'white'}
                pointLabelYOffset={-12}
                enableTouchCrosshair={true}
                useMesh={true}
                role="application"
                curve="monotoneX"
                yScale={{
                  type: 'linear',
                  min: 0,
                  max: 'auto',
                  stacked: true,
                  reverse: false,
                }}
                axisBottom={{
                  tickSize: 1,
                  tickPadding: 6,
                  tickRotation: 0,
                  legend: '',
                  legendOffset: 11,
                  legendPosition: 'middle',
                  truncateTickAt: 0,
                  format: '%b',
                }}
                axisLeft={null}
              />
            </Card>
          </div>
        )}
      </div>

      <div className="mt-14 grid grid-cols-1 gap-14 md:grid-cols-10">
        <div className="order-2 flex flex-col gap-14 md:order-1 md:col-span-7">
          <TopRepositories
            topRepos={data.topRepos}
            title={`Top repositories using ${tech.name}`}
            description={`Most popular GitHub repositories that import or use ${tech.name}`}
            emptyDesc={tech.name}
            volume={current}
          />

          <Related tech={tech} />
        </div>
        <div className="order-1 mt-0 flex flex-col gap-5 md:order-2 md:col-span-3">
          <div className="grid grid-cols-2 gap-2 md:gap-4">
            {tech.github && (
              <TT description={`https://github.com/${tech.github}`}>
                <a
                  href={`https://github.com/${tech.github}?utm_source=getstack.dev`}
                  target="_blank"
                >
                  <Button variant="outline" className="w-full cursor-pointer justify-start">
                    <IconBrandGithub stroke={1} /> GitHub
                  </Button>
                </a>
              </TT>
            )}
            <TT description={tech.website}>
              <a href={`${tech.website}?utm_source=getstack.dev`} target="_blank">
                <Button variant="outline" className="w-full cursor-pointer justify-start">
                  <IconWorld stroke={1} /> Website
                </Button>
              </a>
            </TT>
          </div>
          {isLoadingLeaderboard && <Skeleton className="h-20 w-full " />}
          {position > 0 && (
            <div className="">
              <Card>
                <CardHeader className="relative">
                  <CardDescription className="flex items-center gap-2">
                    <IconStar stroke={2} size={18} />
                    Cumulated Stars
                  </CardDescription>
                  <CardTitle className="@[250px]/card:text-3xl flex items-center gap-2 font-mono text-2xl font-semibold tabular-nums">
                    {stars}
                  </CardTitle>
                </CardHeader>
              </Card>
            </div>
          )}
          <div className="mt-1 border-t pt-5">
            <h3 className="text-sm text-gray-500">
              <Link
                to="/category/$category"
                params={{ category: tech.type }}
                className="font-semibold text-gray-800"
              >
                [{categories[tech.type].name}]
              </Link>{' '}
              leaderboard
            </h3>
            <div className="ml-1 mt-3 flex flex-col gap-2 text-sm">
              {position > 3 && (
                <div className=" text-xs text-gray-400">
                  <IconDots stroke={1} size={18} />
                </div>
              )}
              {inCategory.map((row) => {
                const is = row.tech === techKey;
                return (
                  <div className="flex items-center gap-4" key={row.tech}>
                    <div
                      className={cn(
                        'text-md w-4 font-mono font-semibold tabular-nums text-gray-400',
                        is && 'text-lg text-gray-600'
                      )}
                    >
                      #{row.position}
                    </div>
                    <TechBadge
                      tech={row.tech}
                      className={cn(is && ' text-gray-900')}
                      size={is ? 'xl' : 'md'}
                      border
                    />
                  </div>
                );
              })}
              {leaderboard &&
                leaderboard.data.length > 4 &&
                leaderboard.data.length > position + 2 && (
                  <div className=" text-xs text-gray-400">
                    <IconDots stroke={1} size={18} />
                  </div>
                )}
            </div>
          </div>

          <div className="mt-1 border-t pt-5">
            <Report />
          </div>
        </div>
      </div>
    </div>
  );
};

const Related: React.FC<{ tech: TechItemWithExtended }> = ({ tech }) => {
  const { data, isFetching } = useRelatedTechnology({ name: tech.key });

  if (!data || data.data.length <= 0) {
    return null;
  }

  return (
    <div>
      <h3 className="font-serif text-lg font-semibold">Most likely to be used with</h3>{' '}
      <div className="mb-4 text-xs text-neutral-400">
        Project using this technology also uses those, ordered by popularity
      </div>
      {isFetching && (
        <>
          <Skeleton className="h-[20px] w-[100px]" />
          <Skeleton className="h-[20px] w-[100px]" />
          <Skeleton className="h-[20px] w-[100px]" />
        </>
      )}
      <div className="flex w-full flex-wrap items-start gap-2">
        {data.data.map((row) => {
          return <TechBadge size="md" tech={row.tech} key={row.tech} border />;
        })}
      </div>
    </div>
  );
};

// const RelatedByCategory: React.FC<{ tech: TechItemWithExtended }> = ({ tech }) => {
//   const { data, isLoading } = useRelatedTechnology({ name: tech.key });

//   const groups = useMemo<[TechType, AllowedKeys[]][]>(() => {
//     if (!data) {
//       return [];
//     }

//     const tmp: Record<string, AllowedKeys[]> = {};
//     for (const row of data.data) {
//       if (row.category === tech.type) {
//         continue;
//       }
//       if (!(row.category in tmp)) {
//         tmp[row.category] = [];
//       }
//       tmp[row.category].push(row.tech);
//     }

//     return Object.entries(tmp) as unknown as [TechType, AllowedKeys[]][];
//   }, [data]);

//   return (
//     <div>
//       <h3 className="text-lg font-semibold mb-4">Most likely to be used with</h3>
//       {isLoading && (
//         <>
//           <Skeleton className="w-[100px] h-[20px]" />
//           <Skeleton className="w-[100px] h-[20px]" />
//           <Skeleton className="w-[100px] h-[20px]" />
//         </>
//       )}
//       <div className="flex flex-col w-full gap-4 items-start">
//         {groups.length > 0 &&
//           groups.map(([cat, keys]) => {
//             return (
//               <div className="flex w-full gap-2">
//                 <div className="text-xs text-gray-400 w-1/6">{categories[cat].name}</div>
//                 <div className="w-4/6 flex gap-2">
//                   {keys.map((row) => {
//                     return <TechBadge size="l" tech={row} key={row} border />;
//                   })}
//                 </div>
//               </div>
//             );
//           })}
//       </div>
//     </div>
//   );
// };

export const Route = createFileRoute('/tech/$techKey')({
  loader: async ({ params: { techKey }, context }) => {
    const tech = listIndexed[techKey as AllowedKeys] as TechItemWithExtended | undefined;
    if (!tech) {
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw notFound();
    }

    const data = await context.queryClient.ensureQueryData(
      optionsGetTechnology({ name: tech.key })
    );
    await context.queryClient.ensureQueryData(
      optionsCategoryLeaderboardOptions({ name: tech.type })
    );
    await context.queryClient.ensureQueryData(optionsRelatedTechnologyOptions({ name: tech.key }));

    return data;
  },
  head: (ctx) => {
    const tech = listIndexed[ctx.params.techKey as AllowedKeys] as TechItemWithExtended | undefined;
    const url = `${APP_URL}/tech/${tech?.key}`;
    if (!tech) {
      return {};
    }

    return {
      meta: [
        ...seo({
          title: `${tech.name} trends - getStack`,
          description: `Discover ${tech.name} usage and alternatives across the most popular open-source GitHub repositories`,
          url,
        }),
      ],
      links: [{ rel: 'canonical', href: url }],
    };
  },
  component: Tech,
});

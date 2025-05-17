import { ResponsiveLine } from '@nivo/line';
import {
  IconBrandGithub,
  IconDots,
  IconStar,
  IconTrendingDown,
  IconTrendingUp,
  IconWorld,
} from '@tabler/icons-react';
import { Link, createFileRoute } from '@tanstack/react-router';
import { addWeeks, format, startOfISOWeek } from 'date-fns';
import { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';

import { useCategoryLeaderboard } from '@/api/useCategory';
import { useRelatedTechnology, useTechnology } from '@/api/useTechnology';
import { NotFound } from '@/components/NotFound';
import { Report } from '@/components/Report';
import { TechBadge } from '@/components/TechBadge';
import { TrendsBadge } from '@/components/TrendsBadge';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatQuantity } from '@/lib/number';
import { categories, listIndexed } from '@/lib/stack';
import { cn } from '@/lib/utils';

import type { LineSeries } from '@nivo/line';
import type { AllowedKeys } from '@specfy/stack-analyser';
import type { TechItemWithExtended } from '@stackhub/backend/dist/utils/stacks';
import type {
  RepositoryTop,
  TechnologyByCategoryByWeekWithTrend,
  TechnologyWeeklyVolume,
} from '@stackhub/backend/src/types/endpoint';

const Tech: React.FC = () => {
  const { techKey } = Route.useParams();

  const tech = listIndexed[techKey as AllowedKeys] as TechItemWithExtended | undefined;
  const { data, isLoading } = useTechnology({ name: tech?.key });
  const { data: leaderboard, isLoading: isLoadingLeaderboard } = useCategoryLeaderboard({
    name: tech?.type,
  });

  const [current, trend, diff] = useMemo(() => {
    if (!data || data.data.volume.length <= 0) {
      return [null, null, 0];
    }

    const crr = data.data.volume.at(-1)!;
    if (data.data.volume.length <= 1) {
      return [crr, null, 0];
    }

    const lastWeek = data.data.volume.at(-2)!;
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
    return [formatQuantity(current.hits), formatQuantity(data!.data.cumulatedStars)];
  }, [current]);

  const chartData = useMemo<LineSeries[]>(() => {
    if (!data) {
      return [];
    }
    return [
      {
        id: 'volume',
        data: data.data.volume.map((r) => {
          // Parse YYYY-WW into a valid date
          const [year, week] = r.date_week.split('-').map(Number);
          const parsedDate = addWeeks(startOfISOWeek(new Date(year, 0, 1)), week - 1);
          const formattedDate = format(parsedDate, 'MMM dd');
          return { y: r.hits, x: formattedDate };
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
  if (isLoading) {
    return (
      <div>
        <header className="flex gap-2 justify-between mt-10">
          <h2 className="flex gap-4 items-center">
            <div className="w-12 h-12 bg-neutral-100 rounded-md p-1 border">
              <Skeleton className="h-full w-full" />
            </div>
            <div className="flex flex-col gap-1">
              <Skeleton className="h-2 w-10" />
              <div className="text-2xl font-semibold leading-6">
                <Skeleton className="h-10 w-50 max-w-2xl" />
              </div>
            </div>
          </h2>
        </header>
        <Skeleton className="h-10 w-full mt-4" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-y-4 md:gap-4 mt-10">
          <Skeleton className="h-20 w-full " />
          <Skeleton className="h-20 w-full " />
        </div>
      </div>
    );
  }
  if (!data) {
    return null;
  }

  return (
    <div>
      <Helmet>
        <title>{tech.name} - useStack</title>
        <meta name="description" content={tech.description} />
        <link rel="canonical" href={`/tech/${tech.key}`} />
      </Helmet>
      <header className="flex gap-2 justify-between mt-10">
        <h2 className="flex gap-4 items-center">
          <div className="w-12 h-12 bg-neutral-100 rounded-md p-1 border flex items-center">
            <img src={`/favicons/${tech.key}.webp`} className="rounded-md overflow-hidden" />
          </div>{' '}
          <div className="flex flex-col gap-1">
            <Link
              to="/category/$category"
              params={{ category: tech.type }}
              className="text-xs text-gray-400 leading-3"
            >
              {categories[tech.type].name}
            </Link>
            <div className="text-2xl font-semibold leading-6">{tech.name}</div>
          </div>
        </h2>
        {position > 0 && (
          <div>
            <div className="text-[10px] text-right text-gray-500">position in category</div>
            <div className="text-4xl text-right font-semibold text-gray-400">
              <span className="font-normal text-gray-400">#</span>
              {position}
            </div>
          </div>
        )}
      </header>
      {tech.description && (
        <div className="mt-4 max-w-2xl text-pretty text-gray-600 md:text-lg">
          {tech.description}
        </div>
      )}
      {isLoadingLeaderboard && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-y-4 md:gap-4 mt-10">
          <Skeleton className="h-20 w-full " />
          <Skeleton className="h-20 w-full " />
        </div>
      )}
      {position > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-y-4 md:gap-4 mt-10">
          <Card>
            <CardHeader className="relative">
              <CardDescription>Repositories</CardDescription>
              <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
                {repoCount}
              </CardTitle>

              {trend !== null && (
                <div className="absolute right-4 top-0">
                  <TrendsBadge pct={trend} />
                </div>
              )}
            </CardHeader>
            {trend === null ? (
              <CardFooter className="flex-col items-start gap-1 text-sm">
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
          <Card style={{ height: 176 }} className="py-0 col-span-3">
            <ResponsiveLine
              data={chartData}
              margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
              xScale={{ type: 'point' }}
              enableArea={true}
              axisTop={null}
              axisRight={null}
              enableGridX={false}
              enableGridY={false}
              pointSize={5}
              pointColor={{ theme: 'background' }}
              pointBorderWidth={2}
              pointBorderColor={{ from: 'seriesColor' }}
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
              }}
              axisLeft={null}
            />
          </Card>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-10 gap-14 mt-14">
        <div className="md:col-span-7 flex flex-col gap-14 order-2 md:order-1">
          <TopRepositories topRepos={data.data.topRepos} tech={tech} volume={current} />

          <Related tech={tech} />
        </div>
        <div className="md:col-span-3 mt-0 flex flex-col gap-5 order-1 md:order-2">
          <div className="grid gap-2 grid-cols-2 md:gap-4">
            {tech.github && (
              <a href={`https://github.com/${tech.github}?ref=usestack.dev`} target="_blank">
                <Button variant="outline" className="cursor-pointer w-full">
                  <IconBrandGithub stroke={1} /> GitHub
                </Button>
              </a>
            )}
            <a href={`${tech.website}?ref=usestack.dev`} target="_blank">
              <Button variant="outline" className="cursor-pointer w-full">
                <IconWorld stroke={1} /> Website
              </Button>
            </a>
          </div>
          {isLoadingLeaderboard && <Skeleton className="h-20 w-full " />}
          {position > 0 && (
            <div className="border-t pt-5">
              <Card>
                <CardHeader className="relative">
                  <CardDescription className="flex gap-2 items-center">
                    <IconStar stroke={2} size={18} />
                    Cumulated Stars
                  </CardDescription>
                  <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums flex gap-2 items-center">
                    {stars}
                  </CardTitle>
                </CardHeader>
              </Card>
            </div>
          )}
          <div className="border-t pt-5 mt-1">
            <h3 className="text-sm text-gray-500">
              More in{' '}
              <Link
                to="/category/$category"
                params={{ category: tech.type }}
                className="font-semibold text-gray-800"
              >
                {categories[tech.type].name}
              </Link>
            </h3>
            <div className="text-sm ml-1 mt-3 flex flex-col gap-1">
              {position > 3 && (
                <div className=" text-xs text-gray-400">
                  <IconDots stroke={1} size={18} />
                </div>
              )}
              {inCategory.map((row) => {
                const is = row.tech === techKey;
                return (
                  <div className="flex items-center gap-4">
                    <div
                      className={cn(
                        'text-gray-400 font-semibold text-md w-4',
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

          <div className="border-t pt-5 mt-1">
            <Report />
          </div>
        </div>
      </div>
    </div>
  );
};

const topN = 9;
const topMore = 12;
const topTotal = topN + topMore;

export const TopRepositories: React.FC<{
  topRepos: RepositoryTop[];
  volume: null | TechnologyWeeklyVolume;
  tech: TechItemWithExtended;
}> = ({ topRepos, volume, tech }) => {
  const [top10, rest] = useMemo(() => {
    const copy = [...topRepos];
    const sliced = copy.splice(0, topN);

    return [
      sliced.map((row) => {
        return { ...row, stars: formatQuantity(row.stars) };
      }),
      copy.splice(0, topMore).map((row) => {
        return { ...row, stars: formatQuantity(row.stars) };
      }),
    ];
  }, [topRepos]);

  const howMuch = useMemo(() => {
    if (!volume) {
      return '0';
    }
    return formatQuantity(volume.hits - topMore);
  }, [volume]);

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Top repositories using {tech.name}</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {top10.map((repo) => {
          return (
            <Link
              key={repo.url}
              className="py-2 pb-2 px-4 flex flex-col gap-3 border rounded-sm border-gray-200 hover:bg-gray-50 transition-colors"
              to="/$org/$name"
              params={{ org: repo.org, name: repo.name }}
            >
              <header className="flex gap-2">
                <div className="border rounded-md bg-gray-50 w-9 p-0.5 px-1 flex items-center shrink-0">
                  <img src={repo.avatar_url} className="w-6 h-6 rounded-md overflow-hidden" />
                </div>
                <div className="flex flex-col">
                  <div className="font-semibold text-sm truncate text-ellipsis">{repo.name}</div>
                  <div className="text-[10px] text-gray-400 truncate text-ellipsis">{repo.org}</div>
                </div>
              </header>
              <div className="text-xs text-gray-500">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1">
                    <IconStar stroke={1} size={16} />
                    <strong>{repo.stars}</strong>Stars
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
      {rest.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-4 items-center ml-1">
          {rest.map((repo) => {
            return (
              <Button
                variant={'ghost'}
                size={'sm'}
                className="px-2 py-0 h-6 font-normal cursor-pointer text-xs text-gray-600 hover:text-gray-900"
                asChild
              >
                <Link key={repo.url} to="/$org/$name" params={{ org: repo.org, name: repo.name }}>
                  {repo.org}/{repo.name}
                </Link>
              </Button>
            );
          })}
          {volume && volume.hits > topTotal && (
            <div className="text-xs text-gray-400 px-2">{howMuch} more...</div>
          )}
        </div>
      )}

      {topRepos.length === 0 && (
        <div className="text-gray-400 italic">
          No open-source repositories are using {tech.name} yet.
        </div>
      )}
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
      <h3 className="text-lg font-semibold mb-4">Most likely to be used with</h3>
      {isFetching && (
        <>
          <Skeleton className="w-[100px] h-[20px]" />
          <Skeleton className="w-[100px] h-[20px]" />
          <Skeleton className="w-[100px] h-[20px]" />
        </>
      )}
      <div className="flex flex-wrap w-full gap-2 items-start">
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
  component: Tech,
});

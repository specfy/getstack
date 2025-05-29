import { ResponsiveLine } from '@nivo/line';
import {
  IconDots,
  IconLicense,
  IconStar,
  IconTrendingDown,
  IconTrendingUp,
} from '@tabler/icons-react';
import { Link, createFileRoute } from '@tanstack/react-router';
import { addWeeks, format, startOfISOWeek } from 'date-fns';
import { useMemo } from 'react';

import { optionsGetLicense, useLicense, useLicensesLeaderboard } from '@/api/useLicense';
import { LicenseBadge } from '@/components/LicenseBadge';
import { NotFound } from '@/components/NotFound';
import { Report } from '@/components/Report';
import { TopRepositories } from '@/components/TopRepository';
import { TrendsBadge } from '@/components/TrendsBadge';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatQuantity } from '@/lib/number';
import { APP_URL, seo } from '@/lib/seo';
import { cn } from '@/lib/utils';

import type { LicenseLeaderboard } from '@getstack/backend/src/types/endpoint';
import type { LineSeries } from '@nivo/line';

const License: React.FC = () => {
  const { license } = Route.useParams();

  const { data, isError, isLoading } = useLicense({ key: license });
  const { data: leaderboard, isLoading: isLoadingLeaderboard } = useLicensesLeaderboard();

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
    [number, ({ position: number } & LicenseLeaderboard)[]]
  >(() => {
    if (!leaderboard) {
      return [0, []];
    }

    const tmp = leaderboard.data.findIndex((v) => v.license === license);
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
  }, [leaderboard, license]);

  if (isError) {
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

  const lic = data.data.license;
  return (
    <div>
      <header className="flex gap-2 justify-between mt-10">
        <h2 className="flex gap-4 items-center">
          <div className="w-12 h-12 bg-neutral-100 rounded-md p-1 border flex items-center justify-center">
            <IconLicense size={30} />
          </div>
          <div className="flex flex-col gap-1">
            <Link
              to="/licenses/$license"
              params={{ license }}
              className="text-xs text-gray-400 leading-3"
            >
              License
            </Link>
            <div className="text-2xl font-semibold leading-6 font-serif">{license}</div>
          </div>
        </h2>
        {position > 0 && (
          <div>
            <div className="text-[10px] text-right text-gray-500">position in category</div>
            <div className="text-4xl text-right font-semibold text-gray-400 font-serif">
              <span className="font-normal text-gray-400">#</span>
              {position}
            </div>
          </div>
        )}
      </header>
      <div className="mt-2 max-w-2xl text-pretty text-gray-600 md:text-lg font-serif font-light">
        {lic.description}
      </div>
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
              <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums font-serif">
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

      {position > 0 && (
        <div className="text-xs text-neutral-400 mb-2 text-right mt-2">
          Number of open-source repositories in GitHub using this license
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-10 gap-14 mt-14">
        <div className="md:col-span-7 flex flex-col gap-14 order-2 md:order-1">
          <TopRepositories
            topRepos={data.data.topRepos}
            title={`Top repositories under ${license} License`}
            description={`Most popular GitHub repositories that are ${license}`}
            emptyDesc={license}
            volume={current}
          />
        </div>
        <div className="md:col-span-3 mt-0 flex flex-col gap-5 order-1 md:order-2">
          {isLoadingLeaderboard && <Skeleton className="h-20 w-full " />}
          {position > 0 && (
            <div className="border-t pt-5">
              <Card>
                <CardHeader className="relative">
                  <CardDescription className="flex gap-2 items-center">
                    <IconStar stroke={2} size={18} />
                    Cumulated Stars
                  </CardDescription>
                  <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums flex gap-2 items-center font-serif">
                    {stars}
                  </CardTitle>
                </CardHeader>
              </Card>
            </div>
          )}
          <div className="border-t pt-5 mt-1">
            <h3 className="text-sm text-gray-500">
              More alternatives{' '}
              <Link to="/licenses" className="font-semibold text-gray-800">
                licenses
              </Link>
            </h3>
            <div className="text-sm ml-1 mt-3 flex flex-col gap-1">
              {position > 3 && (
                <div className=" text-xs text-gray-400">
                  <IconDots stroke={1} size={18} />
                </div>
              )}
              {inCategory.map((row) => {
                const is = row.license === license;
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
                    <LicenseBadge
                      license={row.license}
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

export const Route = createFileRoute('/licenses/$license')({
  loader: async ({ params: { license }, context }) => {
    const data = await context.queryClient.ensureQueryData(optionsGetLicense({ key: license }));
    return data;
  },
  head: (ctx) => {
    const data = ctx.loaderData?.data;
    if (!data) {
      return {};
    }
    const url = `${APP_URL}/licenses/${ctx.params.license}`;

    return {
      meta: [
        ...seo({
          title: `${data.license.key} usage and trends - getStack`,
          description: `Discover ${data.license.key} License usage across the most popular open-source GitHub repositories`,
          url,
        }),
      ],
      links: [{ rel: 'canonical', href: url }],
    };
  },
  component: License,
});

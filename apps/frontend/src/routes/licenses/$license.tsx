import { ResponsiveLine } from '@nivo/line';
import {
  IconCheck,
  IconCircle,
  IconDots,
  IconLicense,
  IconStar,
  IconTrendingDown,
  IconTrendingUp,
  IconX,
} from '@tabler/icons-react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Link, createFileRoute } from '@tanstack/react-router';
import { subWeeks, format, startOfISOWeek } from 'date-fns';
import { useMemo } from 'react';

import { optionsGetLicense, optionsLicensesLeaderboard, useLicense } from '@/api/useLicense';
import { LicenseBadge } from '@/components/LicenseBadge';
import { LoadingHeader } from '@/components/LoadingHeader';
import { NotFound } from '@/components/NotFound';
import { Report } from '@/components/Report';
import { TopRepositories } from '@/components/TopRepository';
import { TrendsBadge } from '@/components/TrendsBadge';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { calculateTickValues } from '@/lib/chart';
import { APP_URL } from '@/lib/envs';
import { formatQuantity } from '@/lib/number';
import { seo } from '@/lib/seo';
import { cn } from '@/lib/utils';

import type { APILicenseLeaderboard } from '@getstack/backend/src/types/endpoint';
import type { LineSeries } from '@nivo/line';

const License: React.FC = () => {
  const { license } = Route.useParams();

  const { data, isError, isLoading } = useLicense({ key: license });
  const { data: leaderboard } = useSuspenseQuery(optionsLicensesLeaderboard());

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
          const [year] = r.date_week.split('-').map(Number);
          const parsedDate = startOfISOWeek(subWeeks(new Date(year!, 0, 1), 1));
          const formattedDate = format(parsedDate, 'MMM dd');
          return { y: r.hits, x: formattedDate };
        }),
      },
    ];
  }, [data]);

  const tickValues = useMemo(() => {
    if (!chartData[0]?.data.length) return [];
    return calculateTickValues(chartData[0].data.map((d) => d.x));
  }, [chartData]);

  const [position, inCategory] = useMemo<
    [number, ({ position: number } & APILicenseLeaderboard)[]]
  >(() => {
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
    return <LoadingHeader />;
  }
  if (!data) {
    return null;
  }

  const lic = data.data.license;
  return (
    <div>
      <header className="flex gap-2 justify-between mt-10">
        <div className="flex gap-4 items-center">
          <div className="w-14 h-14 bg-neutral-100 rounded-md p-1 border flex items-center justify-center">
            <IconLicense size={30} />
          </div>
          <div className="flex flex-col gap-1">
            <Link to="/licenses" className="text-sm text-gray-400 leading-5">
              License
            </Link>
            <h1 className="text-3xl font-semibold leading-8 font-serif">{lic.full_name}</h1>
          </div>
        </div>
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
      <div className="flex flex-col md:flex-row gap-10 mt-6">
        <div
          className="md:w-10/20 text-pretty text-gray-800 md:text-lg font-serif font-light"
          aria-description={`${lic.full_name} explained and meaning`}
        >
          {lic.description}
        </div>
        <div className="md:w-11/20 flex gap-10 justify-end">
          {lic.permissions.length > 0 && (
            <div className="">
              <h3 className="text-md font-semibold mb-1 font-serif">Permissions</h3>
              {lic.permissions.map((permission, i) => {
                return (
                  <div key={i} className="flex items-center gap-2 text-sm text-gray-500">
                    <div className="size-4 text-green-500">
                      <IconCheck size={16} />
                    </div>
                    {permission}
                  </div>
                );
              })}
            </div>
          )}
          {lic.limitations.length > 0 && (
            <div className="">
              <h3 className="text-md font-semibold mb-1 font-serif">Limitations</h3>
              {lic.limitations.map((limitation, i) => {
                return (
                  <div key={i} className="flex items-center gap-2 text-sm text-gray-500">
                    <div className="size-4 text-red-500">
                      <IconX size={16} />
                    </div>
                    {limitation}
                  </div>
                );
              })}
            </div>
          )}
          {lic.conditions.length > 0 && (
            <div className="">
              <h3 className="text-md font-semibold mb-1 font-serif">Conditions</h3>
              {lic.conditions.map((condition, i) => {
                return (
                  <div key={i} className="flex items-center gap-2 text-sm text-gray-500 ">
                    <div className="size-4 text-yellow-500">
                      <IconCircle size={15} />
                    </div>
                    {condition}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

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
          <Card style={{ height: 'auto', minHeight: '180px' }} className="py-0 col-span-3">
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
                tickValues,
              }}
              axisLeft={null}
            />
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-10 gap-14 mt-14">
        <div className="md:col-span-7 flex flex-col gap-14 order-2 md:order-1">
          <TopRepositories
            topRepos={data.data.topRepos}
            title={`Top repositories under ${lic.full_name}`}
            description={`Most popular GitHub repositories that are ${license}`}
            emptyDesc={license}
            volume={current}
          />
        </div>
        <div className="md:col-span-3 mt-0 flex flex-col gap-5 order-1 md:order-2">
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
                  <div className="flex items-center gap-4" key={row.license}>
                    <div
                      className={cn(
                        'text-gray-400 font-semibold text-md w-4',
                        is && 'text-lg text-gray-600'
                      )}
                    >
                      #{row.position}
                    </div>
                    <LicenseBadge
                      licenseKey={row.license}
                      fullName={row.full_name}
                      className={cn(is && ' text-gray-900')}
                      size={is ? 'xl' : 'md'}
                      border
                    />
                  </div>
                );
              })}
              {leaderboard.data.length > 4 && leaderboard.data.length > position + 2 && (
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
          title: `${data.license.full_name} usage and trends - getStack`,
          description: `Discover ${data.license.full_name} usage across the most popular open-source GitHub repositories`,
          url,
        }),
      ],
      links: [{ rel: 'canonical', href: url }],
    };
  },
  component: License,
});

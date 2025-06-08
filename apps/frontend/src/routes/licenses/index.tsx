import { ResponsiveAreaBump } from '@nivo/bump';
import { ResponsivePie } from '@nivo/pie';
import { IconLicense, IconTrendingDown, IconTrendingUp } from '@tabler/icons-react';
import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useMemo, useState } from 'react';

import { useLicenses, useLicensesLeaderboard } from '@/api/useLicense';
import { LicenseBadge } from '@/components/LicenseBadge';
import { Report } from '@/components/Report';
import { TrendsBadge } from '@/components/TrendsBadge';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { APP_URL } from '@/lib/envs';
import { formatQuantity } from '@/lib/number';
import { seo } from '@/lib/seo';

import type { APILicenseLeaderboard } from '@getstack/backend/src/types/endpoint';
import type { AreaBumpSerie } from '@nivo/bump';

const Licenses: React.FC = () => {
  const { data, isError, isLoading } = useLicenses();
  const { data: leaderboard } = useLicensesLeaderboard();
  const [pie, setPie] = useState<{ id: string; value: number }[]>([]);
  const [top10, setTop10] = useState<APILicenseLeaderboard[]>([]);
  const [rest, setRest] = useState<APILicenseLeaderboard[]>([]);
  const [winner, setWinner] = useState<APILicenseLeaderboard>();
  const [looser, setLooser] = useState<APILicenseLeaderboard>();

  const topNData = useMemo(() => {
    if (!data) {
      return [];
    }

    const topN: Record<
      string,
      AreaBumpSerie<{ x: number | string; y: number }, { id: string }>
    > = {};

    for (const row of data.data.top) {
      if (!(row.full_name in topN)) {
        topN[row.full_name] = { id: row.full_name, data: [] };
      }
      const week = Number.parseInt(row.date_week.split('-')[1], 10);
      const date = new Date();
      date.setMonth(0);
      date.setDate(1);
      date.setDate(date.getDate() + (week - 1) * 7);
      topN[row.full_name].data.push({
        x: row.date_week,
        y: Number.parseInt(row.hits, 10),
      });
    }

    return Object.values(topN);
  }, [data]);

  useEffect(() => {
    if (!leaderboard) {
      return;
    }

    const tmp: { id: string; value: number }[] = [];
    let up: APILicenseLeaderboard | undefined;
    let down: APILicenseLeaderboard | undefined;
    for (const row of leaderboard.data) {
      tmp.push({ id: row.full_name, value: row.current_hits });
      if ((!up || row.percent_change > up.percent_change) && row.percent_change > 0.1) {
        up = row;
      } else if ((!down || row.percent_change < down.percent_change) && row.percent_change < -0.1) {
        down = row;
      }
    }
    setPie(tmp);
    setWinner(up);
    setLooser(down);

    setTop10(leaderboard.data.slice(0, 10));
    setRest(leaderboard.data.slice(10));
  }, [leaderboard]);

  if (isError) {
    return null;
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

  if (!leaderboard) {
    return null;
  }

  return (
    <div>
      <header className="mb-10 flex flex-col gap-2 mt-10">
        <h2 className="flex gap-4 ">
          <div className="w-12 h-12 bg-neutral-100 rounded-md p-1 border">
            <IconLicense size={39} />
          </div>
          <div>
            <div className="text-3xl font-semibold font-serif leading-14">Licenses</div>
          </div>
        </h2>
        <h3 className="mt-2 max-w-2xl text-pretty text-gray-600 md:text-lg font-serif font-light">
          Discover the most popular open source licenses used across GitHub repositories. This
          ranking shows which licenses are trending and how their adoption evolves over time.
        </h3>
      </header>

      <div className="mt-10">
        <h3 className="text-lg font-semibold mb-1 font-serif">Top {top10.length}</h3>
        <div className="grid md:grid-cols-6 md:gap-14">
          <div className="md:col-span-2">
            <div className="text-xs text-neutral-400 mb-4">By number of repositories in GitHub</div>
            <Card className="border-transparent p-0">
              <div className="flex flex-col gap-1 ">
                {top10.map((row) => {
                  const formatted = formatQuantity(row.current_hits);
                  return (
                    <div className="flex justify-between items-center" key={row.license}>
                      <LicenseBadge
                        licenseKey={row.license}
                        fullName={row.full_name}
                        size="l"
                        border
                      />
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
              </div>
            </Card>
          </div>
          <div className="md:col-span-4">
            <div className="text-xs text-neutral-400 mb-4">Top {top10.length} over time</div>
            <Card style={{ height: Math.max(200, top10.length * 40) }}>
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

          {rest.length > 0 && (
            <Card className="border-transparent p-0 mt-10">
              <div className="flex flex-col gap-1">
                {rest.map((row) => {
                  const formatted = formatQuantity(row.current_hits);
                  console.log(row);
                  return (
                    <div className="flex justify-between items-center" key={row.license}>
                      <LicenseBadge
                        licenseKey={row.license}
                        fullName={row.full_name}
                        size="md"
                        border
                      />
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
                    <LicenseBadge
                      licenseKey={winner.license}
                      fullName={winner.full_name}
                      size="xl"
                    />
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
                    <LicenseBadge
                      licenseKey={looser.license}
                      fullName={looser.full_name}
                      size="xl"
                    />
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
            Every License by number of repositories using it in GitHub
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

export const Route = createFileRoute('/licenses/')({
  head: () => {
    const url = `${APP_URL}/licenses`;
    return {
      meta: [
        ...seo({
          title: `Licenses usage and trends - getStack`,
          description: `Discover the most popular licenses in the Open-Source world. Extracted from the most popular GitHub repositories every week`,
          url,
        }),
      ],
      links: [{ rel: 'canonical', href: url }],
    };
  },
  component: Licenses,
});

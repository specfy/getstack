import { ResponsiveAreaBump } from '@nivo/bump';
import { ResponsiveTreeMap } from '@nivo/treemap';
import { IconLicense, IconTrendingDown, IconTrendingUp } from '@tabler/icons-react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useMemo, useState } from 'react';

import { optionsGetLicenses, optionsLicensesLeaderboard } from '@/api/useLicense';
import { DataProgress } from '@/components/DataProgress';
import { LicenseBadge } from '@/components/LicenseBadge';
import { Report } from '@/components/Report';
import { TrendsBadge } from '@/components/TrendsBadge';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AREA_BUMP_GRAY_10, calculateAreaBumpTickValues } from '@/lib/chart';
import { APP_URL } from '@/lib/envs';
import { formatQuantity } from '@/lib/number';
import { seo } from '@/lib/seo';

import type { APILicenseLeaderboard } from '@getstack/backend/src/types/endpoint';
import type { AreaBumpSerie } from '@nivo/bump';

const Licenses: React.FC = () => {
  const { data } = Route.useLoaderData();
  const { data: leaderboard } = useSuspenseQuery(optionsLicensesLeaderboard());
  const [pie, setPie] = useState<{ id: string; value: number }[]>([]);
  const [top10, setTop10] = useState<APILicenseLeaderboard[]>([]);
  const [rest, setRest] = useState<APILicenseLeaderboard[]>([]);
  const [winner, setWinner] = useState<APILicenseLeaderboard>();
  const [looser, setLooser] = useState<APILicenseLeaderboard>();

  const topNData = useMemo(() => {
    const topN: Record<
      string,
      AreaBumpSerie<{ x: number | string; y: number }, { id: string }>
    > = {};

    for (const row of data.top) {
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

  const tickValues = useMemo(() => calculateAreaBumpTickValues(topNData), [topNData]);

  const treeMapData = useMemo(() => {
    return { id: 'root', children: pie };
  }, [pie]);

  useEffect(() => {
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

  return (
    <div className="relative mx-auto max-w-screen-xl px-4">
      <header className="my-10 flex flex-col gap-2">
        <h1 className="flex gap-4 ">
          <div className="size-12 rounded-md border bg-neutral-100 p-1">
            <IconLicense size={39} />
          </div>
          <div>
            <div className="leading-14 font-serif text-3xl font-semibold">Licenses</div>
          </div>
        </h1>
        <h3 className="mt-2 max-w-2xl text-pretty font-serif font-light text-gray-600 md:text-lg">
          Discover the most popular open source licenses used across GitHub repositories. This
          ranking shows which licenses are trending and how their adoption evolves over time.
        </h3>
      </header>

      <div className="mt-10">
        <h3 className="mb-1 font-serif text-lg font-semibold">Top {top10.length}</h3>
        <div className="grid md:grid-cols-6 md:gap-14">
          <div className="md:col-span-2">
            <div className="pt-1.5 text-xs text-neutral-400">
              By number of repositories in GitHub
            </div>
            <Card className="border-transparent p-0">
              <div className="flex flex-col gap-1 ">
                {top10.map((row) => {
                  const formatted = formatQuantity(row.current_hits);
                  return (
                    <div className="flex items-center justify-between" key={row.license}>
                      <LicenseBadge
                        licenseKey={row.license}
                        fullName={row.full_name}
                        size="l"
                        border
                      />
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
              </div>
            </Card>
          </div>
          <div className="md:col-span-4">
            <div className="flex items-center justify-between">
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
                colors={AREA_BUMP_GRAY_10}
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

          {rest.length > 0 && (
            <Card className="mt-10 border-transparent p-0">
              <div className="flex flex-col gap-1">
                {rest.map((row) => {
                  const formatted = formatQuantity(row.current_hits);
                  return (
                    <div className="flex items-center justify-between" key={row.license}>
                      <LicenseBadge
                        licenseKey={row.license}
                        fullName={row.full_name}
                        size="md"
                        border
                      />
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
          <h3 className="mt-10 font-serif text-lg font-semibold">Full Repartition</h3>
          <div className="mb-4 text-xs text-neutral-400">
            Every License by number of repositories using it in GitHub
          </div>
          <Card style={{ height: 350 }}>
            <ResponsiveTreeMap
              data={treeMapData}
              identity="id"
              value="value"
              leavesOnly
              margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
              colors={AREA_BUMP_GRAY_10}
              borderWidth={1}
              borderColor={{
                from: 'color',
                modifiers: [['darker', 0.1]],
              }}
              label={(node) => {
                const w = (node as unknown as { width?: number }).width ?? 0;
                const h = (node as unknown as { height?: number }).height ?? 0;

                const hits = formatQuantity(node.value as number);

                if (w < 90 || h < 18 || w * h < 1800) return hits;

                return `${node.id} ${hits}`;
              }}
              labelSkipSize={14}
              labelTextColor={{ from: 'color', modifiers: [['darker', 3]] }}
              parentLabelTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
              tooltip={({ node }) => (
                <div className="rounded-md border bg-background px-2 py-1 text-xs shadow-sm">
                  <div className="font-medium">{node.id}</div>
                  <div className="text-muted-foreground">{formatQuantity(node.value as number)}</div>
                </div>
              )}
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
  loader: async ({ context }) => {
    const data = await context.queryClient.ensureQueryData(optionsGetLicenses());
    return data;
  },
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

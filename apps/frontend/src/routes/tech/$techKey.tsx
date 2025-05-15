import { ResponsiveLine } from '@nivo/line';
import { IconStar, IconTrendingDown, IconTrendingUp } from '@tabler/icons-react';
import { Link, createFileRoute } from '@tanstack/react-router';
import { useMemo } from 'react';

import { useTechnology } from '@/api/useTechnology';
import { TrendsBadge } from '@/components/TrendsBadge';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { formatQuantity } from '@/lib/number';
import { listIndexed } from '@/lib/stack';

import type { LineSeries } from '@nivo/line';
import type { AllowedKeys } from '@specfy/stack-analyser';
import type { TechItemExtended } from '@stackhub/backend/dist/utils/stacks';
import type { RepositoryTop, TechnologyWeeklyVolume } from '@stackhub/backend/src/types/endpoint';

const Tech: React.FC = () => {
  const { techKey } = Route.useParams();

  const tech = listIndexed[techKey as AllowedKeys] as TechItemExtended | undefined;
  const { data, isLoading } = useTechnology({ name: tech?.key });

  const [current, trend, diff] = useMemo(() => {
    if (!data || data.data.volume.length <= 0) {
      return [null, null, 0];
    }

    const crr = data.data.volume.at(-1)!;
    if (data.data.volume.length <= 1) {
      return [crr, null, 0];
    }

    const lastWeek = data.data.volume.at(-2)!;
    const pct = ((crr.hits - lastWeek.hits) / lastWeek.hits) * 100;
    return [
      crr,
      pct > 0.5 || pct < -0.05 ? Number.parseFloat(pct.toFixed(1)) : null,
      Math.abs(crr.hits - lastWeek.hits),
    ];
  }, [data]);

  const repoCount = useMemo(() => {
    if (!current) {
      return '0';
    }
    return formatQuantity(current.hits);
  }, [current]);

  const chartData = useMemo<LineSeries[]>(() => {
    if (!data) {
      return [];
    }
    return [
      {
        id: 'volume',
        data: data.data.volume.map((r) => {
          return { y: r.hits, x: r.date_week };
        }),
      },
    ];
  }, [data]);

  if (!tech) {
    return (
      <div>
        <h2 className="text-2xl">Not found</h2>
      </div>
    );
  }
  if (isLoading) {
    return <>Loading</>;
  }
  if (!data) {
    return null;
  }

  return (
    <div>
      <header className="mb-10 flex flex-col gap-2">
        <h2 className="flex gap-4 ">
          <div className="w-12 h-12 bg-neutral-100 rounded-md p-1 border">
            <img src={`/favicons/${tech.key}.webp`} />
          </div>{' '}
          <div>
            <div className="text-xs text-gray-400">Technology</div>
            <div className="text-2xl font-semibold">{tech.name}</div>
          </div>
        </h2>
      </header>
      <div className="grid grid-cols-4 gap-4">
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
              No change in usage since last week
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
            curve="cardinal"
            yScale={{
              type: 'linear',
              min: 'auto',
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
            axisLeft={false}
          />
        </Card>
      </div>
      <TopRepositories topRepos={data.data.topRepos} tech={tech} volume={current} />
    </div>
  );
};

const topN = 10;
const topMore = 20;
const topTotal = topN + topMore;

export const TopRepositories: React.FC<{
  topRepos: RepositoryTop[];
  volume: null | TechnologyWeeklyVolume;
  tech: TechItemExtended;
}> = ({ topRepos, volume, tech }) => {
  const [top10, rest] = useMemo(() => {
    const copy = [...topRepos];
    const sliced = copy.splice(0, topN);

    return [
      sliced.map((row) => {
        return { ...row, stars: formatQuantity(row.stars) };
      }),
      copy.map((row) => {
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
    <div className="mt-10">
      <h3 className="text-lg font-semibold mb-4">Top repositories using {tech.name}</h3>
      <div className="grid grid-cols-5 gap-4">
        {top10.map((repo) => {
          return (
            <Link
              key={repo.url}
              className="py-1 pb-2 px-4 flex flex-col gap-3 border rounded-sm border-gray-100 hover:bg-gray-50 transition-colors"
              to="/$org/$name"
              params={{ org: repo.org, name: repo.name }}
            >
              <header>
                <div className="font-semibold text-sm truncate">{repo.name}</div>
                <div className="text-[10px] text-gray-400">{repo.org}</div>
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
              <Link key={repo.url} to="/$org/$name" params={{ org: repo.org, name: repo.name }}>
                <Button
                  variant={'ghost'}
                  size={'sm'}
                  className="px-2 py-0 h-6 font-normal cursor-pointer text-xs text-gray-600 hover:text-gray-900"
                >
                  {repo.org}/{repo.name}
                </Button>
              </Link>
            );
          })}
          {volume && volume.hits > topTotal && (
            <div className="text-xs text-gray-400">{howMuch} more...</div>
          )}
        </div>
      )}
    </div>
  );
};

export const Route = createFileRoute('/tech/$techKey')({
  component: Tech,
});

import { IconBrandGithub, IconClock, IconStar, IconWorld } from '@tabler/icons-react';
import { createFileRoute } from '@tanstack/react-router';
import { formatDistanceToNowStrict } from 'date-fns';
import { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';

import { useRepository } from '@/api/useRepository';
import { NotFound } from '@/components/NotFound';
import { Report } from '@/components/Report';
import { TechBadge } from '@/components/TechBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatQuantity } from '@/lib/number';
import { categories, categoryOrder } from '@/lib/stack';

import type { AllowedKeys, TechType } from '@specfy/stack-analyser';

const Repo: React.FC = () => {
  const { org, name } = Route.useParams();
  const { data, isLoading, error } = useRepository({ org, name });

  const groups = useMemo<[TechType, AllowedKeys[]][]>(() => {
    if (!data?.data) {
      return [];
    }

    const tmp: Record<string, AllowedKeys[]> = {};
    for (const row of data.data.techs) {
      if (!(row.category in tmp)) {
        tmp[row.category] = [];
      }
      tmp[row.category].push(row.tech);
    }

    const tmp2 = Object.entries(tmp) as [TechType, AllowedKeys[]][];

    return tmp2.sort((a, b) => categoryOrder.indexOf(a[0]) - categoryOrder.indexOf(b[0]));
  }, [data]);

  const lastAnalyzed = useMemo(() => {
    if (!data) {
      return '';
    }
    return formatDistanceToNowStrict(data.data.repo.last_analyzed_at);
  }, [data]);

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

  if (error) {
    return <NotFound />;
  }

  if (!data) {
    return null;
  }

  const repo = data.data.repo;

  const url = `https://getstack.dev/${org}/${name}`;
  const title = `${org}/${name} < Repository - getStack`;
  const desc = `Technology analysis for the GitHub repository ${org}/${name}`;
  const image = `http://localhost:3000/1/repositories/${org}/${name}/image`;
  return (
    <div>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={desc} />
        <link rel="canonical" href={url} />
        <meta itemProp="image" content={image} />

        <meta property="og:url" content={url} />
        <meta property="twitter:url" content={url} />
        <meta name="twitter:title" content={title} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={desc} />
        <meta property="twitter:description" content={desc} />
        <meta property="og:image" content={image} />
        <meta property="twitter:image" content={image} />
      </Helmet>

      <header className="flex gap-2 justify-between items-end mt-10">
        <h2 className="flex gap-4 items-center">
          <div className="w-12 h-12 bg-neutral-100 rounded-md p-1 border">
            {repo.avatar_url ? (
              <img src={repo.avatar_url} className="rounded-md overflow-hidden" />
            ) : (
              <img src={`/favicons/github.webp`} />
            )}
          </div>
          <div className="flex flex-col gap-1">
            <div className="text-xs text-gray-400 leading-3">GitHub repository</div>
            <div className="text-2xl font-semibold leading-6">
              <span className="text-gray-500 text-xl">{repo.org} /</span> {repo.name}
            </div>
          </div>
        </h2>
      </header>
      {repo.description && (
        <div className="mt-4 max-w-2xl text-pretty text-gray-600 md:text-lg">
          {repo.description}
        </div>
      )}
      <main className="mt-14 flex flex-col-reverse flex-col md:flex-row gap-10">
        <div className="md:w-4/6">
          <h3 className="text-lg font-semibold mb-4">Technologies</h3>
          {repo.ignored ? (
            <div className="text-gray-600 italic ">
              This repository has been excluded from our automatic analysis{' '}
              <span className="text-gray-400 text-xs">({repo.ignored_reason})</span>
            </div>
          ) : (
            <div className="flex flex-col gap-1 items-start">
              {groups.length > 0 &&
                groups.map(([cat, keys]) => {
                  return (
                    <div className="grid grid-cols-12 items-start border-t pt-4 w-full pb-4">
                      <div className="col-span-3 text-xs text-gray-400">{categories[cat].name}</div>
                      <div className="col-span-9 flex gap-x-2 gap-y-2 flex-wrap">
                        {keys.map((row) => {
                          return <TechBadge tech={row} key={row} size="l" border />;
                        })}
                      </div>
                    </div>
                  );
                })}
              {groups.length <= 0 && (
                <div className="text-gray-600 italic ">
                  No technologies were found in this repository.
                </div>
              )}
            </div>
          )}
        </div>
        <div className="md:w-2/6">
          <div className="flex gap-4 mb-4">
            <a href={`${repo.url}?ref=getstack.dev`} target="_blank" className="grow w-full">
              <Button variant="outline" className="cursor-pointer w-full">
                <IconBrandGithub stroke={1} /> GitHub
              </Button>
            </a>
            {repo.homepage_url && (
              <a
                href={`${repo.homepage_url}?ref=getstack.dev`}
                target="_blank"
                className="grow w-full"
              >
                <Button variant="outline" className="cursor-pointer w-full">
                  <IconWorld stroke={1} /> Homepage
                </Button>
              </a>
            )}
          </div>
          <Card>
            {/* <CardHeader>About</CardHeader> */}
            <CardContent>
              <div>
                <div className="flex items-center gap-3 py-1">
                  <p className="flex items-center gap-1.5 text-gray-500 text-sm">
                    <IconStar size={18} />
                    Stars
                  </p>
                  <hr className="flex-1" />
                  <span className="text-sm font-semibold">{formatQuantity(repo.stars)}</span>
                </div>
                <div className="flex items-center gap-3 py-1">
                  <p className="flex items-center gap-1.5 text-gray-500 text-sm">
                    <IconClock size={18} />
                    Last Fetched
                  </p>
                  <hr className="flex-1" />
                  <span className="text-sm font-semibold">{lastAnalyzed}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="mt-10">
            <Report />
          </div>
        </div>
      </main>
    </div>
  );
};

export const Route = createFileRoute('/$org/$name')({
  component: Repo,
});

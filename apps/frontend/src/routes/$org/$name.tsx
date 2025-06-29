import {
  IconBrandGithub,
  IconClock,
  IconGitFork,
  IconLicense,
  IconStar,
  IconWeight,
  IconWorld,
} from '@tabler/icons-react';
import { Link, createFileRoute } from '@tanstack/react-router';
import { formatDistanceToNowStrict } from 'date-fns';
import { useMemo } from 'react';

import { optionsGetRepository, useRepository } from '@/api/useRepository';
import { LoadingHeader } from '@/components/LoadingHeader';
import { NotFound } from '@/components/NotFound';
import { Report } from '@/components/Report';
import { TechBadge } from '@/components/TechBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { API_URL, APP_URL } from '@/lib/envs';
import { formatQuantity, formatSize } from '@/lib/number';
import { seo } from '@/lib/seo';
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
    return <LoadingHeader />;
  }

  if (error) {
    return <NotFound />;
  }

  if (!data) {
    return null;
  }

  const repo = data.data.repo;
  const licenses = data.data.licenses;

  return (
    <div>
      <header className="flex gap-2 justify-between items-end mt-10">
        <div className="flex gap-4 items-center">
          <div className="w-14 h-14 bg-neutral-100 rounded-md p-1 border">
            {repo.avatar_url ? (
              <img
                src={repo.avatar_url}
                className="rounded-md overflow-hidden"
                alt={`${repo.org} logo`}
                width={56}
                height={56}
              />
            ) : (
              <img src={`/favicons/github.webp`} alt="GitHub logo" width={56} height={56} />
            )}
          </div>
          <div className="flex flex-col gap-1">
            <div className="text-sm text-gray-400 leading-5">GitHub repository</div>
            <h1 className="text-3xl font-semibold leading-8">
              <span className="text-gray-500 text-2xl">{repo.org} /</span> {repo.name}
            </h1>
          </div>
        </div>
      </header>
      {repo.description && (
        <div className="mt-5 max-w-2xl text-pretty text-gray-600 md:text-lg font-serif">
          {repo.description}
        </div>
      )}
      <main className="mt-14 flex flex-col-reverse md:flex-row gap-10">
        <div className="md:w-4/6">
          <h3 className="text-lg font-semibold font-serif">Built with</h3>{' '}
          <div className="text-xs text-neutral-400 mb-4">
            List of all the technologies this repository is using, automatically extracted every
            week.
          </div>
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
          <div className="mt-10 md:hidden">
            <Report />
          </div>
        </div>
        <div className="md:w-2/6">
          <div className="flex gap-4 mb-4">
            <a href={`${repo.url}?utm_source=getstack.dev`} target="_blank" className="grow w-full">
              <Button variant="outline" className="cursor-pointer w-full">
                <IconBrandGithub stroke={1} /> GitHub
              </Button>
            </a>
            {repo.homepage_url && (
              <a
                href={`${repo.homepage_url}?utm_source=getstack.dev`}
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
                    <IconGitFork size={18} />
                    Forks
                  </p>
                  <hr className="flex-1" />
                  <span className="text-sm font-semibold">{formatQuantity(repo.forks)}</span>
                </div>
                <div className="flex items-center gap-3 py-1">
                  <p className="flex items-center gap-1.5 text-gray-500 text-sm">
                    <IconWeight size={18} />
                    Size
                  </p>
                  <hr className="flex-1" />
                  <span className="text-sm font-semibold">{formatSize(repo.size)}</span>
                </div>
                <div className="flex items-center gap-3 py-1">
                  <p className="flex items-center gap-1.5 text-gray-500 text-sm">
                    <IconClock size={18} />
                    Last Analyzed
                  </p>
                  <hr className="flex-1" />
                  <span className="text-sm font-semibold">{lastAnalyzed}</span>
                </div>
                <div className="flex items-start gap-3 py-1">
                  <Link className="flex items-center gap-1.5 text-gray-500 text-sm" to="/licenses">
                    <IconLicense size={18} />
                    License{licenses.length > 1 ? 's' : ''}
                  </Link>
                  <hr className="flex-1 mt-2.5" />
                  <span className="text-sm font-semibold text-right">
                    {licenses.map((license) => {
                      return (
                        <Link
                          key={license.license}
                          to="/licenses/$license"
                          params={{ license: license.license }}
                          className="block"
                        >
                          {license.full_name}
                        </Link>
                      );
                    })}
                    {licenses.length <= 0 && 'n/a'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="mt-10 hidden md:block">
            <Report />
          </div>
        </div>
      </main>
    </div>
  );
};

export const Route = createFileRoute('/$org/$name')({
  loader: async ({ params, context }) => {
    const data = await context.queryClient.ensureQueryData(optionsGetRepository(params));
    return data;
  },
  head: (ctx) => {
    const repo = ctx.loaderData?.data;
    if (!repo) {
      return {};
    }

    const url = `${APP_URL}/${ctx.params.org}/${ctx.params.name}`;
    const image = `${API_URL}/1/repositories/${ctx.params.org}/${ctx.params.name}/image`;
    return {
      meta: [
        ...seo({
          title: `${ctx.params.org}/${ctx.params.name} on GitHub - getStack`,
          description: `Discover ${ctx.params.org}/${ctx.params.name}'s technology stack`,
          url,
          image,
        }),
      ],
      links: [{ rel: 'canonical', href: url }],
    };
  },
  component: Repo,
});

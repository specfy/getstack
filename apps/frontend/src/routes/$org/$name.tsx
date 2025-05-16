import { IconBrandGithub } from '@tabler/icons-react';
import { createFileRoute } from '@tanstack/react-router';
import { useMemo } from 'react';

import { useRepository } from '@/api/useRepository';
import { NotFound } from '@/components/NotFound';
import { TechBadge } from '@/components/TechBadge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
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

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2 mt-10">
        <Skeleton className="h-[30px] w-1/2" />
        <Skeleton className="h-[20px] w-full" />
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

  return (
    <div>
      <header className="flex gap-2 justify-between items-end mt-10">
        <h2 className="flex gap-4 items-center">
          <div className="w-12 h-12 bg-neutral-100 rounded-md p-1 border">
            <img src={`/favicons/github.webp`} />
          </div>
          <div className="flex flex-col gap-1">
            <div className="text-xs text-gray-400 leading-3">GitHub repository</div>
            <div className="text-2xl font-semibold  leading-6">
              {repo.org}/{repo.name}
            </div>
          </div>
        </h2>
        <div>
          <a href={`${repo.url}?ref=usestack.dev`} target="_blank">
            <Button variant="outline" className="cursor-pointer w-full">
              <IconBrandGithub stroke={1} /> GitHub
            </Button>
          </a>
        </div>
      </header>
      <main className="mt-14">
        <div className="w-2/3 flex flex-col gap-4 items-start">
          {groups.length > 0 &&
            groups.map(([cat, keys]) => {
              return (
                <div className="flex flex-wrap items-center border-b w-full pb-4">
                  <div className="text-xs text-gray-400 w-1/7">{categories[cat].name}</div>
                  <div className="flex gap-4 flex-wrap ">
                    {keys.map((row) => {
                      return <TechBadge tech={row} key={row} />;
                    })}
                  </div>
                </div>
              );
            })}
        </div>
      </main>
    </div>
  );
};

export const Route = createFileRoute('/$org/$name')({
  component: Repo,
});

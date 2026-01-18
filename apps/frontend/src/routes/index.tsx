import { IconArrowRight } from '@tabler/icons-react';
import { Link, createFileRoute, useNavigate } from '@tanstack/react-router';
import { useMemo } from 'react';

import { optionsGetTop } from '@/api/useTop';
import { DataProgress } from '@/components/DataProgress';
import { Newsletter } from '@/components/Newsletter';
import { Search } from '@/components/Search';
import { TT } from '@/components/TT';
import { TechBadge } from '@/components/TechBadge';
import { TrendsBadge } from '@/components/TrendsBadge';
import { Button } from '@/components/ui/button';
import { APP_URL } from '@/lib/envs';
import { formatQuantity } from '@/lib/number';
import { categories, categoryGroup, listIndexed } from '@/lib/stack';

import type { TechnologyByCategoryByWeekWithTrend } from '@getstack/backend/src/types/endpoint';
import type { TechType } from '@specfy/stack-analyser';

interface Group {
  name: string;
  description: string;
  categories: { category: TechType; rows: TechnologyByCategoryByWeekWithTrend[] }[];
}

const Index: React.FC = () => {
  const { data } = Route.useLoaderData();

  const groupedData = useMemo(() => {
    // Create groups structure
    const groups: Group[] = [];

    for (const group of categoryGroup) {
      const groupCategories = [];

      for (const cat of group.categories) {
        const categoryData = data.find((item) => item.category === cat);
        if (categoryData && categoryData.rows.length > 0) {
          groupCategories.push({
            category: cat,
            rows: categoryData.rows,
          });
        }
      }

      if (groupCategories.length > 0) {
        groups.push({
          name: group.name,
          description: group.description,
          categories: groupCategories,
        });
      }
    }

    return groups;
  }, [data]);

  return (
    <div className="relative">
      <HeroSection />

      <div className="mx-auto max-w-screen-xl px-4 py-8">
        <div className="relative mt-2 space-y-14">
          <div className="absolute right-0 top-0">
            <DataProgress />
          </div>
          {groupedData.map((group, groupIndex) => {
            return <CategoryBlock key={group.name} groupIndex={groupIndex} group={group} />;
          })}
        </div>
      </div>
    </div>
  );
};

type Highlight =
  | { type: 'repo'; org: string; name: string }
  | { type: 'tech'; name: string; displayName: string };

const highlights: Highlight[] = [
  { type: 'tech', name: 'tanstackstart', displayName: 'TanStack Start' },
  { type: 'repo', name: 'n8n', org: 'n8n-io' },
  { type: 'tech', name: 'betterauth', displayName: 'Better Auth' },
];

const Try: React.FC = () => {
  return (
    <div className="flex items-center justify-center gap-3">
      <div className="font-serif text-sm font-medium text-gray-600">TRY:</div>
      <div className="flex gap-2">
        {highlights.map((item) => {
          if (item.type === 'repo') {
            return (
              <Button
                key={item.org + item.name}
                variant={'outline'}
                size={'sm'}
                className="border-gray-200 bg-gray-50 text-gray-700 transition-all hover:bg-gray-100 hover:text-gray-900"
                asChild
              >
                <Link to={`/$org/$name`} params={{ org: item.org, name: item.name }}>
                  <div className={'w-4'}>
                    <img
                      src={`/favicons/${item.name.toLowerCase()}.webp`}
                      className="rounded-xs overflow-hidden"
                      alt={`${item.name} logo`}
                      width={16}
                      height={16}
                    />
                  </div>
                  <div className="truncate">
                    {item.org}/{item.name}
                  </div>
                </Link>
              </Button>
            );
          } else {
            return (
              <Button
                key={item.name}
                variant={'outline'}
                size={'sm'}
                className="border-gray-200 bg-gray-50 text-gray-700 transition-all hover:bg-gray-100 hover:text-gray-900"
                asChild
              >
                <Link to={`/tech/$techKey`} params={{ techKey: item.name }}>
                  <div className={'w-4'}>
                    <img
                      src={`/favicons/${item.name.toLowerCase()}.webp`}
                      className="rounded-xs overflow-hidden"
                      alt={`${item.displayName} logo`}
                      width={16}
                      height={16}
                    />
                  </div>
                  <div className="truncate">{item.displayName}</div>
                </Link>
              </Button>
            );
          }
        })}
      </div>
    </div>
  );
};

const HeroSection: React.FC = () => {
  return (
    <div className="relative z-10 border-b border-gray-200 pb-12 pt-10 text-center">
      {/* eslint-disable-next-line tailwindcss/no-contradicting-classname */}
      <div className="pointer-events-none absolute inset-0 z-[-1] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

      <div className="mx-auto max-w-screen-xl">
        <h1 className="leading-20 mb-4 font-serif text-[5em] font-semibold text-gray-900">
          Discover <br /> Technology Trends
        </h1>
        <p className="mb-8 text-lg font-light text-gray-600">
          Analyzing over 50k repositories to deliver real-time insights on the modern tech stack.
          Updated weekly.
        </p>

        <div className="mx-auto mb-6 flex max-w-2xl items-center justify-center gap-3 border border-gray-200 bg-white">
          <div className="flex-1">
            <Search onPick={() => null} inline />
          </div>
          <Button
            variant={'default'}
            className="!rounded-none bg-black !px-9 !py-6 text-xs text-white hover:bg-gray-800"
          >
            SEARCH
          </Button>
        </div>

        <Try key={1} />
      </div>
    </div>
  );
};

const CategoryBlock: React.FC<{
  group: Group;
  groupIndex: number;
}> = ({ group, groupIndex }) => {
  const navigate = useNavigate();

  return (
    <div>
      {groupIndex === 2 && (
        <div className="flex flex-col items-center justify-center px-4 py-10 md:col-span-3">
          <Newsletter />
        </div>
      )}
      <div className="mb-4 flex flex-col">
        <h3 className="font-serif text-lg font-semibold text-gray-900">{group.name}</h3>
        <p className="text-muted-foreground text-xs">{group.description}</p>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {group.categories.map(({ category, rows }, index) => {
          const def = categories[category as TechType];
          const Icon = def.icon;
          return (
            <div
              className="flex cursor-pointer flex-col justify-between border border-gray-200 bg-gray-50/50 p-1 transition-shadow duration-300 hover:shadow-md"
              onClick={() => {
                void navigate({
                  to: '/category/$category',
                  params: { category },
                });
              }}
            >
              <div className="h-full p-4">
                <Link
                  key={index}
                  to={`/category/$category`}
                  params={{ category }}
                  className="mb-6 flex items-center justify-between gap-3 border-b border-b-gray-200 pb-3"
                >
                  <div className="flex items-center gap-2">
                    <div className="size-8 p-1.5">
                      <Icon size={20} />
                    </div>
                    <h3 className="font-serif text-sm font-semibold uppercase text-gray-900">
                      {def.name}
                    </h3>
                  </div>
                  <div>
                    <Button
                      variant={'ghost'}
                      size={'sm'}
                      className="text-gray-300 hover:text-gray-900"
                    >
                      <IconArrowRight />
                    </Button>
                  </div>
                </Link>
                <ul className="flex flex-col gap-2">
                  {rows.map((row, rowIndex) => {
                    const formatted = formatQuantity(row.current_hits);
                    const name = listIndexed[row.tech].name;
                    return (
                      <TT
                        description={`${name} is used by ${formatted} oss repositories`}
                        side="right"
                        align="center"
                      >
                        <Link
                          key={rowIndex}
                          aria-description={`${name} is used by ${formatted} repositories`}
                          to={`/tech/$techKey`}
                          params={{ techKey: row.tech }}
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          <div className="flex h-6 items-center justify-between border bg-white px-4 py-5 text-xs">
                            <div className="flex items-center gap-2">
                              <TechBadge tech={row.tech} />
                            </div>
                            <div className="flex items-center gap-1">
                              {row.previous_hits > 0 &&
                                (row.percent_change > 0.5 || row.percent_change < -0.5) && (
                                  <TrendsBadge pct={row.percent_change} />
                                )}
                              <div className="text-right font-mono font-medium text-gray-900">
                                {formatted}
                              </div>
                            </div>
                          </div>
                        </Link>
                      </TT>
                    );
                  })}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const Route = createFileRoute('/')({
  loader: async ({ context }) => {
    const data = await context.queryClient.ensureQueryData(optionsGetTop());
    return data;
  },
  head: () => {
    return {
      links: [{ rel: 'canonical', href: APP_URL }],
    };
  },
  component: Index,
});

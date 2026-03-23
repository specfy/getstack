import { IconHome } from '@tabler/icons-react';
import { Link, createFileRoute, notFound } from '@tanstack/react-router';
import ReactMarkdown from 'react-markdown';

import { optionsGetCategoryTrends } from '@/api/useCategoryTop';
import { TechDescription } from '@/components/TechDescription';
import { BadgeRepo } from '@/components/content/BadgeRepo';
import { HTop } from '@/components/content/Heading';
import { Image } from '@/components/content/Image';
import { TechSummary } from '@/components/content/TechSummary';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { APP_URL } from '@/lib/envs';
import { formatQuantity } from '@/lib/number';
import { seo } from '@/lib/seo';
import { categories, listIndexed } from '@/lib/stack';

import type { AllowedKeys, TechItem } from '@specfy/stack-analyser';

function categoryTopMetaDescription(introductionMarkdown: string): string {
  const first: string = introductionMarkdown.split(/\n\n+/)[0] ?? introductionMarkdown;
  /* eslint-disable unicorn/prefer-string-replace-all -- ES2020 lib; chained .replace(/g) */
  const plain: string = first
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
  /* eslint-enable unicorn/prefer-string-replace-all */
  return plain.length > 220 ? `${plain.slice(0, 217)}…` : plain;
}

const TopCategoryPage: React.FC = () => {
  const { data } = Route.useLoaderData();
  const { introduction, items } = data;

  const cat = categories[data.category as TechType];

  const now = new Date();

  return (
    <div className="relative mx-auto mt-20 max-w-screen-xl px-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">
              <IconHome stroke={1} size={16} />
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <BreadcrumbPage>Trends</BreadcrumbPage>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Top 10 {cat.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <article className="prose container w-full max-w-none py-8 md:w-3/4 lg:w-2/3">
        <h1 className="my-4 text-4xl font-bold">
          {`Top ${cat.name} in ${now.toLocaleString('en-US', { month: 'long' })} ${now.getFullYear()}`}
        </h1>
        <div className="">
          <ReactMarkdown>{`${introduction}`}</ReactMarkdown>
        </div>

        {items.map((item, index) => {
          const row = item.leaderboard;
          const tech = listIndexed[row.tech as AllowedKeys] as TechItem | undefined;
          const displayName = tech?.name ?? row.tech;
          const volume = formatQuantity(row.current_hits);
          const pct = String(row.percent_change);

          return (
            <section key={row.tech} className="mt-8">
              <HTop position={index + 1} tech={row.tech}>
                {displayName}
              </HTop>
              <Link to="/tech/$techKey" params={{ techKey: row.tech }}>
                <Image src={`/website/${row.tech}.png`} alt={displayName} />
              </Link>
              <TechSummary volume={volume} percentChange={pct} tech={row.tech} />

              <ReactMarkdown>{item.longDescription}</ReactMarkdown>
              {item.topRepos.length > 0 ? (
                <div className="flex items-center">
                  <div>Notable repositories using {displayName} include </div>
                  {item.topRepos.map((repo, i) => (
                    <span key={repo.id} className="inline-flex shrink-0 grow-0">
                      {i > 0 && (i === item.topRepos.length - 1 ? ' and ' : ', ')}
                      <BadgeRepo avatar_url={repo.avatar_url} name={repo.name} org={repo.org} />
                    </span>
                  ))}
                  .
                </div>
              ) : null}
              <Link to="/tech/$techKey" params={{ techKey: row.tech }}>
                <Button className="mt-4" variant="outline" size="sm">
                  More about {displayName}
                </Button>
              </Link>
            </section>
          );
        })}
      </article>
    </div>
  );
};

export const Route = createFileRoute('/trends/$category/$slug')({
  loader: async ({ params: { slug, category }, context }) => {
    if (!(category in categories)) {
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw notFound();
    }

    const data = await context.queryClient.ensureQueryData(
      optionsGetCategoryTrends({ category, slug })
    );
    return data;
  },
  head: (ctx) => {
    if (!ctx.loaderData) {
      return {};
    }

    const data = ctx.loaderData.data;
    const cat = categories[data.category as TechType];

    const url = `${APP_URL}/trends/${ctx.params.category}/${data.slug}`;
    const now = new Date();
    const title = `Top ${cat.name} in ${now.toLocaleString('en-US', { month: 'long' })} ${now.getFullYear()}`;
    const description = categoryTopMetaDescription(data.introduction);
    return {
      meta: [
        ...seo({
          title,
          description,
          url,
        }),
      ],
      links: [{ rel: 'canonical', href: url }],
    };
  },
  component: TopCategoryPage,
});

/* eslint-disable @typescript-eslint/only-throw-error */
import { MDXContent } from '@content-collections/mdx/react';
import { IconHome } from '@tabler/icons-react';
import { Link, createFileRoute, notFound, redirect } from '@tanstack/react-router';

import { optionsGetPost } from '@/api/usePosts';
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
import { seo } from '@/lib/seo';
import { listCategories } from '@/lib/stack';

const BlogPost: React.FC = () => {
  const post = Route.useLoaderData();

  return (
    <div className="mt-20">
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
              <Link to="/blog">Blog</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{post.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <article className="prose max-w-none container py-8 w-full md:w-3/4 lg:w-2/3">
        <h1 className="text-4xl font-bold mt-4 mb-4">{post.title}</h1>
        <div className="mb-10 h-7 flex items-center gap-3">
          <a
            href={post.metadata.authorUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 !text-gray-900 no-underline  text-xs"
          >
            <img
              src={post.metadata.avatarUrl}
              className="h-6 w-6 rounded-full bg-gray-50"
              alt={`${post.metadata.author} avatar`}
              width={24}
              height={24}
            />
            <div className="text-sm leading-3">{post.metadata.author}</div>
          </a>
          <time dateTime={post.created_at} className="text-gray-500 text-xs">
            {new Date(post.created_at).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </time>
          {post.categories.data.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">in</span>
              <div className="flex items-center gap-2">
                {post.categories.data.map((category) => {
                  const name = listCategories.find((c) => c.key === category);
                  return (
                    <Link
                      key={category}
                      to="/category/$category"
                      params={{ category: name?.key ?? '' }}
                      className="text-xs !text-gray-500 no-underline"
                    >
                      {name?.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
        <MDXContent
          code={post.content}
          components={{
            BadgeRepo: BadgeRepo,
            HTop: HTop,
            Image: Image,
            Button: Button,
            TechSummary: TechSummary,
            Link: Link,
          }}
        />
      </article>
    </div>
  );
};

export const Route = createFileRoute('/blog/$slug')({
  loader: async ({ params, context }) => {
    const paramSlug = params.slug as string;
    const lastDashIndex = paramSlug.lastIndexOf('-');
    if (lastDashIndex === -1) {
      throw notFound();
    }

    const id = Number.parseInt(paramSlug.slice(Math.max(0, lastDashIndex + 1)), 10);
    if (Number.isNaN(id)) {
      throw notFound();
    }

    const slug = paramSlug.slice(0, Math.max(0, lastDashIndex));

    const data = await context.queryClient.ensureQueryData(optionsGetPost(id));

    if (data.metadata.slug !== slug) {
      throw redirect({ to: '/blog/$slug', params: { slug: `${data.metadata.slug}-${data.id}` } });
    }

    return data;
  },
  head: (ctx) => {
    const data = ctx.loaderData;
    if (!data) {
      return {};
    }
    const url = `${APP_URL}/blog/${data.metadata.slug}-${data.id}`;
    const ldJson = {
      '@context': 'https://schema.org',
      '@type': 'NewsArticle',
      headline: data.title,
      image: [`${APP_URL}${data.metadata.image}`],
      datePublished: data.created_at,
      dateModified: data.updated_at,
      author: [
        {
          '@type': 'Person',
          name: data.metadata.author,
          url: data.metadata.authorUrl,
        },
      ],
    };
    return {
      meta: [
        ...seo({
          title: `${data.title} - getStack blog`,
          description: data.summary,
          url,
          image: `${APP_URL}${data.metadata.image}`,
        }),
        { name: 'article:published_time', content: data.created_at },
        { name: 'article:modified_time', content: data.updated_at },
        { name: 'article:author', content: data.metadata.author },
        { name: 'article:section', content: data.categories?.data.join(',') ?? '' },
        { name: 'article:tag', content: data.techs?.data.join(',') ?? '' },
      ],
      links: [{ rel: 'canonical', href: url }],
      scripts: [{ type: 'application/ld+json', children: JSON.stringify(ldJson) }],
    };
  },
  component: BlogPost,
});

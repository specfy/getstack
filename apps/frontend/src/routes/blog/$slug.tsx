/* eslint-disable @typescript-eslint/only-throw-error */
import { MDXContent } from '@content-collections/mdx/react';
import { IconHome } from '@tabler/icons-react';
import { Link, createFileRoute, notFound, redirect } from '@tanstack/react-router';
import { allPosts } from 'content-collections';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { APP_URL } from '@/lib/envs';
import { seo } from '@/lib/seo';

const BlogPost: React.FC = () => {
  const post = Route.useLoaderData();
  // const isMdx = post._meta.fileName.endsWith('.mdx');

  // return <div>Hello</div>;
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
      <article className="prose max-w-none container py-8 md:w-2/3">
        <MDXContent code={post.mdx} />
      </article>
    </div>
  );
};

export const Route = createFileRoute('/blog/$slug')({
  loader: ({ params }) => {
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
    const post = allPosts.find((p) => p.id === id);
    if (!post) {
      throw notFound();
    }
    if (post.slug !== slug) {
      throw redirect({ to: '/blog/$slug', params: { slug: `${post.slug}-${post.id}` } });
    }
    return post;
  },
  head: (ctx) => {
    const data = ctx.loaderData;
    if (!data) {
      return {};
    }
    const url = `${APP_URL}/blog/${data.slug}-${data.id}`;

    return {
      meta: [
        ...seo({
          title: `${data.title} - getStack blog`,
          description: data.summary,
          url,
        }),
      ],
      links: [{ rel: 'canonical', href: url }],
    };
  },
  component: BlogPost,
});

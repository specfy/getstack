/* eslint-disable @typescript-eslint/only-throw-error */
import { MDXContent } from '@content-collections/mdx/react';
import { IconHome } from '@tabler/icons-react';
import { Link, createFileRoute, notFound, redirect } from '@tanstack/react-router';

import { optionsGetPost } from '@/api/usePosts';
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
        {/* <post.content /> */}
        <MDXContent code={post.content} />
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

    return {
      meta: [
        ...seo({
          title: `${data.title} - getStack blog`,
          description: data.summary,
          url,
          image: data.metadata.image,
        }),
      ],
      links: [{ rel: 'canonical', href: url }],
    };
  },
  component: BlogPost,
});

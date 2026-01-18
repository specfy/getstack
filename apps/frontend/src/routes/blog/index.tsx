import { IconHome } from '@tabler/icons-react';
import { Link, createFileRoute } from '@tanstack/react-router';
import dayjs from 'dayjs';

import { optionsGetPosts } from '@/api/usePosts';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { APP_URL } from '@/lib/envs';
import { seo } from '@/lib/seo';

const Blog: React.FC = () => {
  const posts = Route.useLoaderData();

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
            <BreadcrumbPage>Blog</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 md:mx-0 md:max-w-none md:grid-cols-3">
        {posts.map((post) => {
          const date = dayjs(post.updated_at);
          return (
            <Link
              className="block"
              to="/blog/$slug"
              params={{ slug: `${post.metadata.slug}-${post.id}` }}
              key={post.id}
            >
              <Card className="duration-30 pt-0 transition-shadow hover:shadow-lg">
                <img src={post.metadata.imageCover || post.metadata.image} alt={post.title} />
                <CardHeader>
                  <CardTitle>
                    <h2 className="text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
                      <a href={`/blog/${post.metadata.slug}-${post.id}`}>{post.title}</a>
                    </h2>
                  </CardTitle>
                  <time dateTime={post.updated_at} className="text-xs text-gray-500">
                    {date.format('MMM DD, YYYY')}
                  </time>
                </CardHeader>
                <CardContent className="text-sm text-gray-500">{post.summary}</CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export const Route = createFileRoute('/blog/')({
  loader: async ({ context }) => {
    const data = await context.queryClient.ensureQueryData(optionsGetPosts());
    return data;
  },
  head: () => {
    const url = `${APP_URL}/blog`;
    return {
      meta: [
        ...seo({
          title: `Blog - getStack`,
          description: 'Read our latest blog posts',
          url,
        }),
      ],
      links: [{ rel: 'canonical', href: url }],
    };
  },
  component: Blog,
});

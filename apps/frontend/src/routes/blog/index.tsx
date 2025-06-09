import { IconHome } from '@tabler/icons-react';
import { Link, createFileRoute } from '@tanstack/react-router';
import { allPosts } from 'content-collections';
import dayjs from 'dayjs';

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
            <BreadcrumbPage>Blog</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
        {posts.posts.map((post) => {
          const date = dayjs(post.publishedAt);

          return (
            <Link className="block" to="/blog/$slug" params={{ slug: `${post.slug}-${post.id}` }}>
              <Card key={post.id} className="pt-0 hover:shadow-lg transition-shadow duration-30">
                <img src={post.image} alt="" />
                <CardHeader>
                  <CardTitle>
                    <h2 className="text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
                      <a href={`/blog/${post.id}-${post.slug}`}>{post.title}</a>
                    </h2>
                  </CardTitle>
                  <time dateTime={post.publishedAt.toISOString()} className="text-gray-500 text-xs">
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
  loader: () => {
    return {
      posts: allPosts,
    };
  },
  head: () => {
    const url = `${APP_URL}/blog/`;
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

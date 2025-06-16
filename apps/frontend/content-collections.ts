import { defineCollection, defineConfig } from '@content-collections/core';
import { compileMarkdown } from '@content-collections/markdown';
import { compileMDX } from '@content-collections/mdx';
import { z } from 'zod';

const posts = defineCollection({
  name: 'posts',
  directory: 'src/posts',
  include: '**.mdx',
  schema: z.object({
    id: z.number(),
    title: z.string(),
    summary: z.string(),
    slug: z.string(),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
    author: z.string(),
    avatarUrl: z.string().url(),
    authorUrl: z.string().url(),
    image: z.string(),
    imageCover: z.string().optional(),
  }),

  transform: async (document, context) => {
    const html = await compileMarkdown(context, document);
    const mdx = await compileMDX(context, document);
    return {
      ...document,
      slug: document.slug,
      html,
      mdx,
    };
  },
});

export default defineConfig({
  collections: [posts],
});

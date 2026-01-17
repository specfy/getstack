// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck in dockerfile it's not present
import { allPosts } from '../../../frontend/.content-collections/generated/index.js';
import { db } from '../db/client.js';
import { defaultLogger, logError } from '../utils/logger.js';

import type { PostsInsert } from '../db/types.db.js';

const logger = defaultLogger.child({ svc: 'blog-index' });

// npx tsx --env-file=.env apps/backend/src/scripts/blogIndex.ts

async function main(): Promise<void> {
  try {
    if (!Array.isArray(allPosts)) {
      throw new TypeError('allPosts is not an array');
    }

    logger.info(`Found ${allPosts.length} posts to index`);

    // Upsert each post
    for (const post of allPosts) {
      const metadata: PostsInsert['metadata'] = {
        author: post.author,
        slug: post.slug,
        avatarUrl: post.avatarUrl,
        authorUrl: post.authorUrl,
        image: post.image,
        imageCover: post.imageCover,
      };

      const postData: PostsInsert = {
        id: post.id,
        title: post.title,
        content: post.mdx,
        summary: post.summary,
        techs: { data: 'techs' in post ? (post.techs as string[]) : [] },
        categories: { data: 'categories' in post ? (post.categories as string[]) : [] },
        metadata,
        created_at: new Date(post.publishedAt),
        updated_at: new Date(post.updatedAt),
      };

      await db
        .insertInto('posts')
        .values(postData)
        .onConflict((oc) =>
          oc.column('id').doUpdateSet({
            title: postData.title,
            content: postData.content,
            summary: postData.summary,
            techs: postData.techs,
            categories: postData.categories,
            metadata: postData.metadata,
            updated_at: postData.updated_at,
          })
        )
        .execute();

      logger.info(`Indexed post: ${post.title}`);
    }

    logger.info('Finished indexing all posts');
  } catch (err) {
    logError(new Error('Failed to index posts'), err);
    throw err;
  }
}

await main();

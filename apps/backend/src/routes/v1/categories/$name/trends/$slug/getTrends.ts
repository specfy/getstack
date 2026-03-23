import { listIndexed } from '@specfy/stack-analyser/dist/common/techs.generated.js';
import { z } from 'zod';

import { getOrCache } from '../../../../../../models/cache.js';
import { getCategoryTrendsRow } from '../../../../../../models/categoryTrends.js';
import { getActiveWeek } from '../../../../../../models/progress.js';
import { getRepositories } from '../../../../../../models/repositories.js';
import { getTechInfo } from '../../../../../../models/techInfo.js';
import {
  getTopRepositoriesForTechnology,
  getTopTechnologiesWithTrendByCategory,
} from '../../../../../../models/technologies.js';
import { categories } from '../../../../../../utils/stacks.js';

import type {
  APIGetCategoryTrends,
  CategoryTopItem,
  RepositoryTop,
} from '../../../../../../types/endpoint.js';
import type { AllowedKeys, TechType } from '@specfy/stack-analyser';
import type { FastifyInstance, FastifyPluginCallback } from 'fastify';

const schemaParams = z.object({
  name: z.string().refine((val) => categories.includes(val as TechType), {
    message: 'Invalid category',
  }),
});

function techDisplayName(tech: string): string {
  const item = listIndexed[tech as AllowedKeys];
  return item.name;
}

function buildLeadersParagraph(leaders: { tech: string }[]): string {
  if (leaders.length === 0) {
    return '';
  }

  const names = leaders.map((t) => techDisplayName(t.tech));
  if (names.length === 1) {
    return `In this week's data, **${names[0]}** appears in the most repositories in this category.`;
  }

  if (names.length === 2) {
    return `By repository count, **${names[0]}** and **${names[1]}** are the two most common entries this week.`;
  }

  return `By repository count, **${names[0]}**, **${names[1]}**, and **${names[2]}** are the three most common entries this week.`;
}

async function buildCategoryTrendsPayload(
  category: TechType,
  introduction: string
): Promise<{
  intro: { introduction: string; dynamicParagraph: string };
  items: CategoryTopItem[];
}> {
  const weeks = await getActiveWeek();
  const leaderboard = await getTopTechnologiesWithTrendByCategory({
    category,
    currentWeek: weeks.currentWeek,
    previousWeek: weeks.previousWeek,
  });
  const top10 = leaderboard.slice(0, 10);
  const dynamicParagraph = buildLeadersParagraph(top10.slice(0, 3));

  const items: CategoryTopItem[] = await Promise.all(
    top10.map(async (row) => {
      const [info, topReposRaw] = await Promise.all([
        getTechInfo(row.tech),
        getTopRepositoriesForTechnology({ tech: row.tech, currentWeek: weeks.currentWeek }),
      ]);
      const topIds = topReposRaw.slice(0, 3).map((r) => r.id);
      const reposRows = topIds.length > 0 ? await getRepositories({ ids: topIds }) : [];
      const byGithubId = new Map(reposRows.map((r) => [r.github_id, r]));
      const topRepos: RepositoryTop[] = topIds
        .map((id) => byGithubId.get(id))
        .filter((r): r is NonNullable<typeof r> => r !== undefined)
        .map((r) => ({
          id: r.id,
          name: r.name,
          org: r.org,
          stars: r.stars,
          avatar_url: r.avatar_url,
        }));

      return {
        leaderboard: row,
        longDescription: info?.long_description ?? '',
        topRepos,
      };
    })
  );

  return {
    intro: {
      introduction,
      dynamicParagraph,
    },
    items,
  };
}

export const getCategoryTrends: FastifyPluginCallback = (fastify: FastifyInstance) => {
  fastify.get<APIGetCategoryTrends>('/categories/:name/trends/:slug', async (req, reply) => {
    const valParams = schemaParams.safeParse(req.params);
    if (valParams.error) {
      return reply.status(400).send({ error: { code: '400_invalid_params', status: 400 } });
    }

    const params = valParams.data;

    const row = await getCategoryTrendsRow(params.name);
    if (row === null) {
      return reply.status(404).send({ error: { code: '404_not_found', status: 404 } });
    }

    const weeks = await getActiveWeek();
    const payload = await getOrCache({
      keys: ['getCategoryTrends', row.id, weeks.currentWeek, weeks.previousWeek],
      fn: () => buildCategoryTrendsPayload(row.category as TechType, row.introduction),
    });

    reply.status(200).send({
      success: true,
      data: {
        ...row,
        items: payload.items,
      },
    });
  });
};

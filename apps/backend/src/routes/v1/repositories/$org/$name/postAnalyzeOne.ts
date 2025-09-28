import * as z from 'zod';

import { db } from '../../../../../db/client.js';
import { createRepository, getRepository } from '../../../../../models/repositories.js';
import {
  createRepositoryAnalysis,
  getRepositoryAnalysis,
  updateRepositoryAnalysis,
} from '../../../../../models/repositoriesAnalysis.js';
import { analyze } from '../../../../../processor/analyzer.js';
import { cleanAnalysis } from '../../../../../utils/analyzer.js';
import { notFound } from '../../../../../utils/apiErrors.js';
import { envs } from '../../../../../utils/env.js';
import { githubToRepo, octokit } from '../../../../../utils/github.js';
import { defaultLogger } from '../../../../../utils/logger.js';

import type { APIPostAnalyzeOne } from '../../../../../types/endpoint.js';
import type { RestEndpointMethodTypes } from '@octokit/rest';
import type { FastifyInstance, FastifyPluginCallback } from 'fastify';

const logger = defaultLogger.child({ svc: 'api.analyze' });

const schemaParams = z.object({
  org: z.string().max(255),
  name: z.string().max(255),
});

const analysisTTL = 1000 * 60 * 60 * 24;

export const postAnalyzeOne: FastifyPluginCallback = (fastify: FastifyInstance) => {
  fastify.post<APIPostAnalyzeOne>(
    '/repositories/:org/:name/analyze',
    {
      config: {
        rateLimit: { max: 5, timeWindow: 60_000 },
      },
    },
    async (req, reply) => {
      const valParams = schemaParams.safeParse(req.params);
      if (valParams.error) {
        return reply.status(400).send({ error: { code: '400_invalid_params', status: 400 } });
      }

      const params = valParams.data;

      // First we fetch to know if it exists, if it's a private repo, etc.
      let repoGithub: RestEndpointMethodTypes['repos']['get']['response']['data'];
      try {
        const res = await octokit.rest.repos.get({ owner: params.org, repo: params.name });
        repoGithub = res.data;
      } catch (err) {
        console.error(err);
        return notFound(reply);
      }

      let repo = await getRepository(params);
      if (!repo) {
        // Ignore manual repo by default
        const ignored = repoGithub.size > envs.ANALYZE_MAX_SIZE ? 'too_big' : 'manual';
        repo = await createRepository(githubToRepo(repoGithub, ignored));
      } else if (repo.ignored && repo.ignored_reason !== 'manual') {
        return reply.status(200).send({ success: true, data: { repo, analysis: null } });
      }

      const repoAnalysis = await getRepositoryAnalysis(db, repo.id);
      // Recently analyzed
      if (repoAnalysis && repoAnalysis.last_manual_at.getTime() + analysisTTL > Date.now()) {
        return reply
          .status(200)
          .send({ success: true, data: { repo, analysis: repoAnalysis.analysis } });
      }

      logger.info(`Processing one ${params.org}/${params.name}`);
      const analysis = await analyze(
        {
          branch: repoGithub.default_branch,
          name: repoGithub.name,
          org: repoGithub.owner.login,
        },
        logger
      );

      await db.transaction().execute(async (trx) => {
        if (repoAnalysis) {
          await updateRepositoryAnalysis({
            trx,
            id: repoAnalysis.id,
            input: { analysis: analysis.toJson(), last_manual_at: new Date() },
          });
        } else {
          await createRepositoryAnalysis(trx, {
            repository_id: repo.id,
            analysis: cleanAnalysis(analysis.toJson()),
            last_manual_at: new Date(),
          });
        }
      });

      reply.status(200).send({
        success: true,
        data: { repo, analysis: analysis.toJson() },
      });
    }
  );
};

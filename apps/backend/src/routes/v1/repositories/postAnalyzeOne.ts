import { z } from 'zod';

import { getRepository } from '../../../models/repositories.js';
import { analyze, saveAnalysis, savePreviousIfStale } from '../../../processor/analyzer.js';
import { formatToYearWeek } from '../../../utils/date.js';
import { defaultLogger } from '../../../utils/logger.js';

import type { FastifyInstance, FastifyPluginCallback } from 'fastify';

const logger = defaultLogger.child({ svc: 'api.analyze' });

const schemaParams = z.object({
  org: z.string().max(255),
  name: z.string().max(255),
});

export const postAnalyzeOne: FastifyPluginCallback = (fastify: FastifyInstance) => {
  fastify.post('/repositories/:org/:name', async (req, reply) => {
    const valParams = schemaParams.safeParse(req.params);
    if (valParams.error) {
      return reply.status(400).send({ error: { code: 'invalid_params' } });
    }

    const params = valParams.data;

    logger.info(`Processing one ${params.org}/${params.name}`);

    const repo = await getRepository(params);
    if (!repo) {
      return reply.status(404).send({ error: { code: '404_not_found' } });
    }

    const dateWeek = formatToYearWeek(new Date());
    try {
      const withPrevious = await savePreviousIfStale(repo, dateWeek);
      if (!withPrevious) {
        const res = await analyze(repo, logger);
        await saveAnalysis({ repo, res, dateWeek });
        logger.info(`Done`);
      }
    } catch (err) {
      logger.error(`Failed to process`, err);
      reply.status(500).send({ error: { code: 'failed_to_process' } });
      return;
    }

    reply.status(200).send({
      success: true,
    });
  });
};

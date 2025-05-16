import { z } from 'zod';

import { getRepository } from '../../../../../models/repositories.js';
import { analyze, saveAnalysis, savePreviousIfStale } from '../../../../../processor/analyzer.js';
import { notFound } from '../../../../../utils/apiErrors.js';
import { formatToYearWeek } from '../../../../../utils/date.js';
import { defaultLogger } from '../../../../../utils/logger.js';

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
      return reply.status(400).send({ error: { code: 'invalid_params', status: 400 } });
    }

    const params = valParams.data;

    logger.info(`Processing one ${params.org}/${params.name}`);

    const repo = await getRepository(params);
    if (!repo) {
      return notFound(reply);
    }

    const dateWeek = formatToYearWeek(new Date());
    try {
      const withPrevious = await savePreviousIfStale(repo, dateWeek);
      if (withPrevious) {
        logger.info(`With previous`);
      } else {
        const res = await analyze(repo, logger);
        await saveAnalysis({ repo, res, dateWeek });
        logger.info(`Done`);
      }
    } catch (err) {
      logger.error(`Failed to process`, err);
      reply.status(500).send({ error: { code: 'failed_to_process', status: 500 } });
      return;
    }

    reply.status(200).send({
      success: true,
    });
  });
};

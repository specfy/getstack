import { z } from 'zod';

import { getOrCache } from '../../../../../models/cache.js';
import { getLicensesByRepo } from '../../../../../models/licenses.js';
import { getAllLicensesNames } from '../../../../../models/licensesInfo.js';
import { getActiveWeek } from '../../../../../models/progress.js';
import { getRepository } from '../../../../../models/repositories.js';
import { getTechnologiesByRepo } from '../../../../../models/technologies.js';
import { notFound } from '../../../../../utils/apiErrors.js';

import type { APIGetRepository, APILicenseWithName } from '../../../../../types/endpoint.js';
import type { FastifyInstance, FastifyPluginCallback } from 'fastify';

const schemaParams = z.object({
  org: z.string().max(255),
  name: z.string().max(255),
});

export const getApiRepository: FastifyPluginCallback = (fastify: FastifyInstance) => {
  fastify.get<APIGetRepository>('/repositories/:org/:name', async (req, reply) => {
    const valParams = schemaParams.safeParse(req.params);
    if (valParams.error) {
      return reply.status(400).send({ error: { code: '400_invalid_params', status: 400 } });
    }

    const params = valParams.data;

    const repo = await getRepository(params);
    if (!repo) {
      return notFound(reply);
    }
    if (repo.ignored === 1) {
      reply.status(200).send({ success: true, data: { repo, techs: [], licenses: [] } });
      return;
    }

    const weeks = await getActiveWeek();
    const techs = await getOrCache({
      keys: ['getTechnologiesByRepo', repo.id, weeks.currentWeek],
      fn: () => getTechnologiesByRepo(repo, weeks.currentWeek),
    });
    const rawLicenses = await getOrCache({
      keys: ['getLicensesByRepo', repo.id, weeks.currentWeek],
      fn: () => getLicensesByRepo(repo, weeks.currentWeek),
    });

    const licensesNames = await getAllLicensesNames();
    const names = new Map<string, string>();
    for (const row of licensesNames) {
      names.set(row.key, row.full_name);
    }

    const licenses: APILicenseWithName[] = [];
    for (const row of rawLicenses) {
      licenses.push({ ...row, full_name: names.get(row.license)! });
    }

    reply.status(200).send({ success: true, data: { repo, techs, licenses } });
  });
};

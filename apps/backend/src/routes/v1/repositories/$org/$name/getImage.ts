import { listIndexed } from '@specfy/stack-analyser/dist/register.js';
import sharp from 'sharp';
import { z } from 'zod';

import { getActiveWeek } from '../../../../../models/progress.js';
import { getRepository } from '../../../../../models/repositories.js';
import { getTechnologiesByRepo } from '../../../../../models/technologies.js';
import { notFound } from '../../../../../utils/apiErrors.js';
import { getOrCache } from '../../../../../utils/cache.js';
import { formatQuantity } from '../../../../../utils/number.js';

import type { FastifyInstance, FastifyPluginCallback } from 'fastify';

const schemaParams = z.object({
  org: z.string().max(255),
  name: z.string().max(255),
});

export const getRepositoryImage: FastifyPluginCallback = (fastify: FastifyInstance) => {
  fastify.get('/repositories/:org/:name/image', async (req, reply) => {
    const valParams = schemaParams.safeParse(req.params);
    if (valParams.error) {
      return reply.status(400).send({ error: { code: '400_invalid_params', status: 400 } });
    }

    const params = valParams.data;

    const repo = await getOrCache(['getRepository', params.org, params.name], () =>
      getRepository(params)
    );
    if (!repo) {
      return notFound(reply);
    }

    const weeks = await getActiveWeek();
    const tech = await getOrCache(['getTechnologiesByRepo', repo.id, weeks.currentWeek], () =>
      getTechnologiesByRepo(repo, weeks.currentWeek)
    );

    const stars = formatQuantity(repo.stars);
    const starsLen = 60 + stars.length * 20;
    const svgText = `
  <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <style>
    .logo { font: bold 80px "Helvetica", sans-serif; }
    .title { font: 64px "Helvetica", sans-serif; }
    .subtitle { font: 32px "Helvetica", sans-serif; fill: #6a737d; }
    .stat { font: 34px "Helvetica", sans-serif; fill: #586069; }
    .label { font: 30px "Helvetica", sans-serif; fill: #6a737d; }
  </style>
  <rect width="100%" height="100%" fill="white" />

  <!-- Logo Box -->
  <g transform="scale(3 3) translate(110 30)" fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round">
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <path d="M12 4l-8 4l8 4l8 -4l-8 -4" />
    <path d="M4 12l8 4l8 -4" /><path d="M4 16l8 4l8 -4" />
  </g>
  <text x="420" y="150" class="logo" fill="#24292f">getStack</text>
  <text x="200" y="200" class="subtitle">Analyze any repository and discover their tech stack</text>

  <!-- Title -->
  <text x="60" y="360" class="title"><tspan font-size="50px" fill="#6a737d">${repo.org}</tspan>/<tspan font-weight="bold" fill="#24292f">${repo.name}</tspan></text>

  <!-- Subtitle -->
  <text x="60" y="420" class="subtitle">Using: ${tech
    .slice(0, 8)
    .map((t) => listIndexed[t.tech].name)
    .join(', ')}, ...</text>

  <!-- Stats -->
  <text x="60" y="550" class="stat">${stars}</text>
  <text x="${starsLen}" y="550" class="label">Stars</text>

  <!-- Footer bar -->
  <rect y="610" width="100%" height="20" fill="#333"/>
</svg>`;

    const buffer = await sharp(Buffer.from(svgText)).png().toBuffer();
    reply.header('Content-Disposition', 'attachment; filename=image.png');
    reply.header('Content-Length', buffer.byteLength);
    reply.type('application/octet-stream');
    reply.header('Cache-Control', 'public, max-age=604800, immutable');
    reply.header('Expires', new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toUTCString());
    reply.send(buffer);
  });
};

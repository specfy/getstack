import { listIndexed } from '@specfy/stack-analyser/dist/register.js';
import sharp from 'sharp';
import * as z from 'zod';

import { getOrCache } from '../../../../../models/cache.js';
import { getActiveWeek } from '../../../../../models/progress.js';
import { getRepository } from '../../../../../models/repositories.js';
import { getTechnologiesByRepo } from '../../../../../models/technologies.js';
import { notFound } from '../../../../../utils/apiErrors.js';

import type { FastifyInstance, FastifyPluginCallback } from 'fastify';

const schemaParams = z.object({
  org: z.string().max(255),
  name: z.string().max(255),
});

// Helper to layout tech names as SVG pills
function layoutTechPills(
  techNames: string[],
  options: Partial<{
    startX: number;
    startY: number;
    maxWidth: number;
    pillHeight: number;
    pillPaddingX: number;
    pillPaddingY: number;
    pillGapX: number;
    pillGapY: number;
    fontSize: number;
    fontFamily: string;
    borderRadius: number;
    pillFill: string;
    pillStroke: string;
    textColor: string;
  }> = {}
): string {
  const {
    startX = 60,
    startY = 420,
    maxWidth = 1080,
    pillHeight = 32,
    pillPaddingX = 24,
    pillPaddingY = 10,
    pillGapX = 16,
    pillGapY = 16,
    fontSize = 20,
    fontFamily = 'Helvetica, sans-serif',
    borderRadius = 10,
    pillStroke = '#d1d5da',
    textColor = '#24292f',
  } = options;

  function estimateWidth(text: string): number {
    return Math.round(fontSize * 0.6 * text.length + pillPaddingX * 2);
  }

  let x = startX;
  let y = startY;
  let svg = '';

  for (const label of techNames) {
    const pillWidth = estimateWidth(label);

    if (x + pillWidth > maxWidth) {
      x = startX;
      y += pillHeight + pillGapY;
    }

    svg += `
        <g>
            <rect x="${x}" y="${y - pillHeight + pillPaddingY}" rx="${borderRadius}" ry="${borderRadius}" width="${pillWidth}" height="${pillHeight}" stroke="${pillStroke}" fill="none" />
            <text x="${x + pillWidth / 2}" y="${y}" text-anchor="middle" alignment-baseline="middle" font-size="${fontSize}" font-family="${fontFamily}" fill="${textColor}">${label}</text>
        </g>
        `;

    x += pillWidth + pillGapX;
  }

  return svg;
}

export const getRepositoryImage: FastifyPluginCallback = (fastify: FastifyInstance) => {
  fastify.get('/repositories/:org/:name/image', async (req, reply) => {
    const valParams = schemaParams.safeParse(req.params);
    if (valParams.error) {
      return reply.status(400).send({ error: { code: '400_invalid_params', status: 400 } });
    }

    const params = valParams.data;

    const repo = await getRepository(params);
    if (!repo) {
      return notFound(reply);
    }

    const weeks = await getActiveWeek();
    const tech =
      repo.ignored === 0
        ? await getOrCache({
          keys: ['getTechnologiesByRepo', repo.id, weeks.currentWeek],
          fn: () => getTechnologiesByRepo(repo, weeks.currentWeek),
        })
        : [];

    // const stars = formatQuantity(repo.stars);
    // const starsLen = 60 + stars.length * 17;
    const techNames = tech
      .slice(0, 25)
      .map((t) => listIndexed[t.tech].name)
      .filter(Boolean) as string[]; // up to 20 for wrapping, filter out undefined
    const techPillsSvg = layoutTechPills(techNames);
    const svgText = `
  <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <style>
    .logo { font: bold 80px "Helvetica", sans-serif; }
    .title { font: 64px "Helvetica", sans-serif; }
    .subtitle { font: 32px "Helvetica", sans-serif; fill: #6a737d; }
    .stat { font: 30px "Helvetica", sans-serif; fill: #586069; }
    .label { font: 25px "Helvetica", sans-serif; fill: #6a737d; }
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

  <!-- Tech list as pills -->
  ${techPillsSvg}


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

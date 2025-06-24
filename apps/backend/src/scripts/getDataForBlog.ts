import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';

import { getActiveWeek } from '../models/progress.js';
import { getRepositories } from '../models/repositories.js';
import {
  getTopRepositoriesForTechnology,
  getTopTechnologiesWithTrendByCategory,
} from '../models/technologies.js';
import { categories } from '../utils/stacks.js';

import type { TechType } from '@specfy/stack-analyser';

interface TechnologyData {
  tech: string;
  date_week: string;
  hits: number;
  position: number;
  percent_change: number;
  topRepos: {
    id: string;
    name: string;
    org: string;
    stars: number;
    avatar_url: string;
    description: string;
    url: string;
  }[];
}

interface CategoryData {
  category: string;
  technologies: TechnologyData[];
}

const maxRepos = 10;

async function getDataForCategory(category: TechType): Promise<CategoryData> {
  const { currentWeek, previousWeek } = await getActiveWeek();

  console.log({ currentWeek, previousWeek });
  console.log(`Getting top technologies for category: ${category}`);
  const topTechnologies = await getTopTechnologiesWithTrendByCategory({
    category: category,
    currentWeek,
    previousWeek,
  });

  const technologiesData: TechnologyData[] = [];

  let i = 0;
  for (const tech of topTechnologies) {
    i++;
    console.log(`Getting top ${maxRepos} repositories for technology: ${tech.tech}`);

    // Get top 5 repositories for this technology
    const topRepos = await getTopRepositoriesForTechnology({
      tech: tech.tech,
      currentWeek,
    });

    // Get full repository data for the top 5 repos
    const repoIds = [];
    for (const repo of topRepos) {
      repoIds.push(repo.id);
    }
    const reposData = repoIds.length > 0 ? await getRepositories({ ids: repoIds }) : [];

    const technologyData: TechnologyData = {
      tech: tech.tech,
      date_week: currentWeek,
      hits: tech.current_hits,
      position: i,
      percent_change: tech.percent_change,
      topRepos: reposData.map((repo) => ({
        id: repo.id,
        name: repo.name,
        org: repo.org,
        stars: repo.stars,
        avatar_url: repo.avatar_url || '',
        description: repo.description || '',
        url: repo.url || '',
      })),
    };

    technologiesData.push(technologyData);
  }

  return {
    category,
    technologies: technologiesData,
  };
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error('Usage: npm run script:getDataForBlog <category>');
    console.error('Available categories:', categories.join(', '));
    process.exitCode = 1;
    return;
  }

  const category = args[0];

  if (!category || !categories.includes(category as TechType)) {
    console.error(`Invalid category: ${category}`);
    console.error('Available categories:', categories.join(', '));
    process.exitCode = 1;
    return;
  }

  try {
    console.log(`Starting data collection for category: ${category}`);

    const data = await getDataForCategory(category as TechType);

    // Create output filename with timestamp
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `category-${category}-${timestamp}.json`;
    const cwd = process.cwd();
    const outputPath = path.join(cwd, 'data', filename);

    // Ensure data directory exists
    const dataDir = path.join(cwd, 'data');
    try {
      mkdirSync(dataDir, { recursive: true });
    } catch {
      // Directory might already exist, ignore error
    }

    // Write data to JSON file
    writeFileSync(outputPath, JSON.stringify(data, null, 2));

    console.log(`Data written to: ${outputPath}`);
    console.log(`Found ${data.technologies.length} technologies with repository data`);
  } catch (err) {
    console.error('Error collecting data:', err);
    throw err;
  }
}

// Run the script
try {
  await main();
} catch (err) {
  console.error('Script failed:', err);
  throw err;
}

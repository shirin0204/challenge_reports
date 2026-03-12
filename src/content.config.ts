import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const challenges = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/challenges' }),
  schema: z.object({
    challengeId: z.string(),
    title: z.string(),
    description: z.string(),
    totalDays: z.number(),
    status: z.enum(['active', 'completed', 'draft']).default('active'),
    publishedAt: z.string(),
  }),
});

const reports = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/reports' }),
  schema: z.object({
    challengeId: z.string(),
    reportId: z.string(),
    day: z.number(),
    title: z.string(),
    summary: z.string(),
    publishedAt: z.string(),
    draft: z.boolean().default(false),
  }),
});

export const collections = {
  challenges,
  reports,
};
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({
    pattern: '**/*.{md,mdx}',
    base: './src/content/blog',
    // A translation can share a URL slug with the original, but not a collection ID.
    generateId: ({ entry }) => entry,
  }),
  schema: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    date: z.coerce.date(),
    language: z.enum(['en', 'zh']),
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*(?:\/[a-z0-9]+(?:-[a-z0-9]+)*)*$/),
    translationKey: z.string().min(1),
    // Opt in to publication explicitly; templates and drafts stay out of the site.
    draft: z.boolean().default(true),
  }),
});

export const collections = { blog };

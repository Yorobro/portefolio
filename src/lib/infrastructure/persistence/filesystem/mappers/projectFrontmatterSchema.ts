import { z } from 'zod';

export const projectFrontmatterSchema = z.object({
  slug: z.string(),
  title: z.string(),
  summary: z.string(),
  type: z.enum(['personal', 'professional', 'academic', 'competitive']),
  status: z.enum(['finished', 'in-progress', 'archived']),
  featured: z.boolean().default(false),
  dateStart: z.coerce.date(),
  dateEnd: z.coerce.date().optional(),
  stack: z.array(z.string()).min(1),
  repoUrl: z.string().url().optional(),
  liveUrl: z.string().url().optional(),
  highlights: z.array(z.string()).default([]),
  architecture: z.string().optional(),
  media: z
    .array(
      z.object({
        type: z.enum(['image', 'gif', 'video']),
        src: z.string(),
        alt: z.string(),
        caption: z.string().optional(),
      }),
    )
    .default([]),
});

export type ProjectFrontmatter = z.infer<typeof projectFrontmatterSchema>;

import { z } from 'zod';

export const experienceFrontmatterSchema = z.object({
  company: z.string(),
  location: z.string(),
  role: z.string(),
  type: z.enum(['alternance', 'stage', 'cdi', 'cdd', 'freelance']),
  dateStart: z.coerce.date(),
  dateEnd: z.coerce.date().optional(),
  summary: z.string(),
  highlights: z.array(z.string()).default([]),
});

export type ExperienceFrontmatter = z.infer<typeof experienceFrontmatterSchema>;

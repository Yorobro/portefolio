import { z } from 'zod';

export const skillsFrontmatterSchema = z.object({
  skills: z.array(
    z.object({
      name: z.string(),
      category: z.enum([
        'language',
        'framework',
        'database',
        'devops',
        'deployment',
        'design',
        'soft',
      ]),
      level: z.enum(['novice', 'intermediate', 'advanced', 'expert']),
    }),
  ),
});

export type SkillsFrontmatter = z.infer<typeof skillsFrontmatterSchema>;

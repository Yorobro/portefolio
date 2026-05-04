import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import type { SkillRepository } from '$application/ports/SkillRepository';
import { Skill } from '$domain/entities/Skill';
import { Result } from '$domain/shared/Result';
import { DomainError } from '$domain/errors/DomainError';
import { parseMarkdown } from './MarkdownParser';
import { skillsFrontmatterSchema } from './mappers/skillsFrontmatterSchema';

class SkillRepositoryReadError extends DomainError {
  readonly code = 'SKILL_REPOSITORY_READ_ERROR' as const;
}

export interface FilesystemSkillRepositoryConfig {
  contentDir: string;
}

export function createFilesystemSkillRepository(
  config: FilesystemSkillRepositoryConfig,
): SkillRepository {
  let cache: readonly Skill[] | undefined;

  async function loadAll(): Promise<Result<readonly Skill[], DomainError>> {
    if (cache) return Result.ok(cache);
    try {
      const entries = await readdir(config.contentDir);
      const mdFiles = entries.filter((f) => f.endsWith('.md'));
      const items: Skill[] = [];
      for (const file of mdFiles) {
        const raw = await readFile(path.join(config.contentDir, file), 'utf8');
        const parsed = await parseMarkdown(raw);
        const fm = skillsFrontmatterSchema.safeParse(parsed.frontmatter);
        if (!fm.success) {
          return Result.err(
            new SkillRepositoryReadError(`Invalid frontmatter in ${file}: ${fm.error.message}`),
          );
        }
        for (const s of fm.data.skills) {
          const skill = Skill.create({ name: s.name, category: s.category, level: s.level });
          if (!skill.ok) return Result.err(skill.error);
          items.push(skill.value);
        }
      }
      cache = Object.freeze(items);
      return Result.ok(cache);
    } catch (err) {
      return Result.err(
        new SkillRepositoryReadError(
          `Failed to read skills: ${err instanceof Error ? err.message : String(err)}`,
        ),
      );
    }
  }

  return {
    async findAll() {
      return loadAll();
    },
  };
}

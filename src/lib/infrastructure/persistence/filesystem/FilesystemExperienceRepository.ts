import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import type { ExperienceRepository } from '$application/ports/ExperienceRepository';
import { Experience } from '$domain/entities/Experience';
import { DateRange } from '$domain/value-objects/DateRange';
import { Result } from '$domain/shared/Result';
import { DomainError } from '$domain/errors/DomainError';
import { parseMarkdown } from './MarkdownParser';
import { experienceFrontmatterSchema } from './mappers/experienceFrontmatterSchema';

class ExperienceRepositoryReadError extends DomainError {
  readonly code = 'EXPERIENCE_REPOSITORY_READ_ERROR' as const;
}

export interface FilesystemExperienceRepositoryConfig {
  contentDir: string;
}

export function createFilesystemExperienceRepository(
  config: FilesystemExperienceRepositoryConfig,
): ExperienceRepository {
  let cache: readonly Experience[] | undefined;

  async function loadAll(): Promise<Result<readonly Experience[], DomainError>> {
    if (cache) return Result.ok(cache);
    try {
      const entries = await readdir(config.contentDir);
      const mdFiles = entries.filter((f) => f.endsWith('.md'));
      const items: Experience[] = [];
      for (const file of mdFiles) {
        const raw = await readFile(path.join(config.contentDir, file), 'utf8');
        const parsed = await parseMarkdown(raw);
        const fm = experienceFrontmatterSchema.safeParse(parsed.frontmatter);
        if (!fm.success) {
          return Result.err(
            new ExperienceRepositoryReadError(
              `Invalid frontmatter in ${file}: ${fm.error.message}`,
            ),
          );
        }
        const range = DateRange.create(fm.data.dateStart, fm.data.dateEnd);
        if (!range.ok) return Result.err(range.error);

        const exp = Experience.create({
          company: fm.data.company,
          location: fm.data.location,
          role: fm.data.role,
          type: fm.data.type,
          dateRange: range.value,
          summary: fm.data.summary,
          highlights: fm.data.highlights,
        });
        if (!exp.ok) return Result.err(exp.error);
        items.push(exp.value);
      }
      cache = Object.freeze(items);
      return Result.ok(cache);
    } catch (err) {
      return Result.err(
        new ExperienceRepositoryReadError(
          `Failed to read experiences: ${err instanceof Error ? err.message : String(err)}`,
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

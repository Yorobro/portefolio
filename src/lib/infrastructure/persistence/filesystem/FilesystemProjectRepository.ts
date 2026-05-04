import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import type { ProjectRepository } from '$application/ports/ProjectRepository';
import type { ProjectSlug } from '$domain/value-objects/ProjectSlug';
import { Project } from '$domain/entities/Project';
import { ProjectSlug as ProjectSlugVO } from '$domain/value-objects/ProjectSlug';
import { TechStack } from '$domain/value-objects/TechStack';
import { DateRange } from '$domain/value-objects/DateRange';
import { MediaAsset } from '$domain/value-objects/MediaAsset';
import { Result } from '$domain/shared/Result';
import { ProjectNotFoundError } from '$domain/errors/ProjectNotFoundError';
import { DomainError } from '$domain/errors/DomainError';
import { parseMarkdown } from './MarkdownParser';
import { projectFrontmatterSchema } from './mappers/projectFrontmatterSchema';

export class RepositoryReadError extends DomainError {
  readonly code = 'REPOSITORY_READ_ERROR' as const;
}

export interface FilesystemProjectRepositoryConfig {
  contentDir: string;
}

export function createFilesystemProjectRepository(
  config: FilesystemProjectRepositoryConfig,
): ProjectRepository {
  let cache: readonly Project[] | undefined;

  async function loadAll(): Promise<Result<readonly Project[], DomainError>> {
    if (cache) return Result.ok(cache);
    try {
      const entries = await readdir(config.contentDir);
      const mdFiles = entries.filter((f) => f.endsWith('.md'));
      const projects: Project[] = [];
      for (const file of mdFiles) {
        const raw = await readFile(path.join(config.contentDir, file), 'utf8');
        const parsed = await parseMarkdown(raw);
        const fm = projectFrontmatterSchema.safeParse(parsed.frontmatter);
        if (!fm.success) {
          return Result.err(
            new RepositoryReadError(`Invalid frontmatter in ${file}: ${fm.error.message}`),
          );
        }
        const slug = ProjectSlugVO.create(fm.data.slug);
        const stack = TechStack.create(fm.data.stack);
        const range = DateRange.create(fm.data.dateStart, fm.data.dateEnd);
        if (!slug.ok) return Result.err(slug.error);
        if (!stack.ok) return Result.err(stack.error);
        if (!range.ok) return Result.err(range.error);

        const media: MediaAsset[] = [];
        for (const m of fm.data.media) {
          const asset = MediaAsset.create(m);
          if (!asset.ok) return Result.err(asset.error);
          media.push(asset.value);
        }

        const project = Project.create({
          slug: slug.value,
          title: fm.data.title,
          summary: fm.data.summary,
          description: parsed.html,
          stack: stack.value,
          status: fm.data.status,
          type: fm.data.type,
          featured: fm.data.featured,
          dateRange: range.value,
          repoUrl: fm.data.repoUrl,
          liveUrl: fm.data.liveUrl,
          media,
          architecture: fm.data.architecture,
          highlights: fm.data.highlights,
        });
        if (!project.ok) return Result.err(project.error);
        projects.push(project.value);
      }
      cache = Object.freeze(projects);
      return Result.ok(cache);
    } catch (err) {
      return Result.err(
        new RepositoryReadError(
          `Failed to read projects: ${err instanceof Error ? err.message : String(err)}`,
        ),
      );
    }
  }

  return {
    async findAll() {
      return loadAll();
    },
    async findFeatured() {
      const all = await loadAll();
      if (!all.ok) return all;
      return Result.ok(all.value.filter((p) => p.featured));
    },
    async findBySlug(slug: ProjectSlug) {
      const all = await loadAll();
      if (!all.ok) return Result.err(all.error);
      const found = all.value.find((p) => p.slug.equals(slug));
      if (!found) return Result.err(new ProjectNotFoundError(slug.toString()));
      return Result.ok(found);
    },
  };
}

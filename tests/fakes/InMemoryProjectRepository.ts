import type { ProjectRepository } from '$application/ports/ProjectRepository';
import type { Project } from '$domain/entities/Project';
import type { ProjectSlug } from '$domain/value-objects/ProjectSlug';
import { Result } from '$domain/shared/Result';
import { ProjectNotFoundError } from '$domain/errors/ProjectNotFoundError';
import type { DomainError } from '$domain/errors/DomainError';

export class InMemoryProjectRepository implements ProjectRepository {
  constructor(private projects: readonly Project[] = []) {}

  setProjects(projects: readonly Project[]): void {
    this.projects = projects;
  }

  async findAll(): Promise<Result<readonly Project[], DomainError>> {
    return Result.ok<readonly Project[], DomainError>(this.projects);
  }

  async findFeatured(): Promise<Result<readonly Project[], DomainError>> {
    return Result.ok<readonly Project[], DomainError>(this.projects.filter((p) => p.featured));
  }

  async findBySlug(
    slug: ProjectSlug,
  ): Promise<Result<Project, ProjectNotFoundError | DomainError>> {
    const found = this.projects.find((p) => p.slug.equals(slug));
    if (!found) {
      return Result.err<Project, ProjectNotFoundError | DomainError>(
        new ProjectNotFoundError(slug.toString()),
      );
    }
    return Result.ok<Project, ProjectNotFoundError | DomainError>(found);
  }
}

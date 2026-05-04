import type { Project } from '$domain/entities/Project';
import type { ProjectSlug } from '$domain/value-objects/ProjectSlug';
import type { Result } from '$domain/shared/Result';
import type { ProjectNotFoundError } from '$domain/errors/ProjectNotFoundError';
import type { DomainError } from '$domain/errors/DomainError';

export interface ProjectRepository {
  findAll(): Promise<Result<readonly Project[], DomainError>>;
  findFeatured(): Promise<Result<readonly Project[], DomainError>>;
  findBySlug(slug: ProjectSlug): Promise<Result<Project, ProjectNotFoundError | DomainError>>;
}

import type { ProjectRepository } from '$application/ports/ProjectRepository';
import { ProjectSlug } from '$domain/value-objects/ProjectSlug';
import type { Project } from '$domain/entities/Project';
import { Result } from '$domain/shared/Result';
import type { ProjectNotFoundError } from '$domain/errors/ProjectNotFoundError';
import type { InvalidProjectSlugError } from '$domain/errors/InvalidProjectSlugError';
import type { DomainError } from '$domain/errors/DomainError';

export interface GetProjectBySlugDeps {
  projectRepository: ProjectRepository;
}

export interface GetProjectBySlugInput {
  slug: string;
}

export type GetProjectBySlug = (
  input: GetProjectBySlugInput,
) => Promise<Result<Project, ProjectNotFoundError | InvalidProjectSlugError | DomainError>>;

export function createGetProjectBySlug({
  projectRepository,
}: GetProjectBySlugDeps): GetProjectBySlug {
  return async ({ slug }) => {
    const slugVO = ProjectSlug.create(slug);
    if (!slugVO.ok) return Result.err(slugVO.error);
    return projectRepository.findBySlug(slugVO.value);
  };
}

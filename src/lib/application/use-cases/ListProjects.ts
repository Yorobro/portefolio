import type { ProjectRepository } from '$application/ports/ProjectRepository';
import type { Project } from '$domain/entities/Project';
import type { Result } from '$domain/shared/Result';
import type { DomainError } from '$domain/errors/DomainError';

export interface ListProjectsDeps {
  projectRepository: ProjectRepository;
}

export interface ListProjectsInput {
  featured?: boolean | undefined;
}

export type ListProjects = (
  input: ListProjectsInput,
) => Promise<Result<readonly Project[], DomainError>>;

export function createListProjects({ projectRepository }: ListProjectsDeps): ListProjects {
  return async (input) => {
    if (input.featured) return projectRepository.findFeatured();
    return projectRepository.findAll();
  };
}

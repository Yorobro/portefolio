import type { ExperienceRepository } from '$application/ports/ExperienceRepository';
import type { Experience } from '$domain/entities/Experience';
import type { Result } from '$domain/shared/Result';
import type { DomainError } from '$domain/errors/DomainError';

export interface ListExperiencesDeps {
  experienceRepository: ExperienceRepository;
}

export type ListExperiences = () => Promise<Result<readonly Experience[], DomainError>>;

export function createListExperiences({
  experienceRepository,
}: ListExperiencesDeps): ListExperiences {
  return async () => experienceRepository.findAll();
}

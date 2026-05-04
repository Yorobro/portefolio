import type { Experience } from '$domain/entities/Experience';
import type { Result } from '$domain/shared/Result';
import type { DomainError } from '$domain/errors/DomainError';

export interface ExperienceRepository {
  findAll(): Promise<Result<readonly Experience[], DomainError>>;
}

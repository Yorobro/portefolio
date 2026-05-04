import type { Skill } from '$domain/entities/Skill';
import type { Result } from '$domain/shared/Result';
import type { DomainError } from '$domain/errors/DomainError';

export interface SkillRepository {
  findAll(): Promise<Result<readonly Skill[], DomainError>>;
}

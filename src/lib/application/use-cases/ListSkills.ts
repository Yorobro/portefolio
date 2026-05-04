import type { SkillRepository } from '$application/ports/SkillRepository';
import type { Skill } from '$domain/entities/Skill';
import type { Result } from '$domain/shared/Result';
import type { DomainError } from '$domain/errors/DomainError';

export interface ListSkillsDeps {
  skillRepository: SkillRepository;
}
export type ListSkills = () => Promise<Result<readonly Skill[], DomainError>>;

export function createListSkills({ skillRepository }: ListSkillsDeps): ListSkills {
  return async () => skillRepository.findAll();
}

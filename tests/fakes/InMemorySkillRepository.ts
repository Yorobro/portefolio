import type { SkillRepository } from '$application/ports/SkillRepository';
import type { Skill } from '$domain/entities/Skill';
import { Result } from '$domain/shared/Result';
import type { DomainError } from '$domain/errors/DomainError';

export class InMemorySkillRepository implements SkillRepository {
  constructor(private items: readonly Skill[] = []) {}

  setItems(items: readonly Skill[]): void {
    this.items = items;
  }

  async findAll(): Promise<Result<readonly Skill[], DomainError>> {
    return Result.ok<readonly Skill[], DomainError>(this.items);
  }
}

import type { ExperienceRepository } from '$application/ports/ExperienceRepository';
import type { Experience } from '$domain/entities/Experience';
import { Result } from '$domain/shared/Result';
import type { DomainError } from '$domain/errors/DomainError';

export class InMemoryExperienceRepository implements ExperienceRepository {
  constructor(private items: readonly Experience[] = []) {}

  setItems(items: readonly Experience[]): void {
    this.items = items;
  }

  async findAll(): Promise<Result<readonly Experience[], DomainError>> {
    return Result.ok<readonly Experience[], DomainError>(this.items);
  }
}

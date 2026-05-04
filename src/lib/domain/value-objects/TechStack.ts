import { Result } from '$domain/shared/Result';
import { DomainError } from '$domain/errors/DomainError';

export class InvalidTechStackError extends DomainError {
  readonly code = 'INVALID_TECH_STACK' as const;
}

export class TechStack {
  private constructor(private readonly items: readonly string[]) {}

  static create(raw: readonly string[]): Result<TechStack, InvalidTechStackError> {
    if (raw.length === 0) {
      return Result.err(new InvalidTechStackError('TechStack must not be empty'));
    }
    const trimmed: string[] = [];
    for (const item of raw) {
      const t = item.trim();
      if (t.length === 0) {
        return Result.err(new InvalidTechStackError('TechStack entries must not be empty'));
      }
      if (!trimmed.includes(t)) trimmed.push(t);
    }
    return Result.ok(new TechStack(trimmed));
  }

  toArray(): readonly string[] {
    return this.items;
  }
}

import { Result } from '$domain/shared/Result';
import { InvalidProjectSlugError } from '$domain/errors/InvalidProjectSlugError';

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export class ProjectSlug {
  private constructor(private readonly value: string) {}

  static create(raw: string): Result<ProjectSlug, InvalidProjectSlugError> {
    if (!SLUG_PATTERN.test(raw)) {
      return Result.err(new InvalidProjectSlugError(raw));
    }
    return Result.ok(new ProjectSlug(raw));
  }

  toString(): string {
    return this.value;
  }

  equals(other: ProjectSlug): boolean {
    return this.value === other.value;
  }
}

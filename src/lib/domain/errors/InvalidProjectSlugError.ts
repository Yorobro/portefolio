import { DomainError } from './DomainError';

export class InvalidProjectSlugError extends DomainError {
  readonly code = 'INVALID_PROJECT_SLUG' as const;

  constructor(input: string) {
    super(`Invalid project slug: "${input}"`);
  }
}

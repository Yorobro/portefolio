import { DomainError } from './DomainError';

export class ProjectNotFoundError extends DomainError {
  readonly code = 'PROJECT_NOT_FOUND' as const;
  constructor(slug: string) {
    super(`Project not found: ${slug}`);
  }
}

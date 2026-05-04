import { DomainError } from './DomainError';

export class InvalidEmailError extends DomainError {
  readonly code = 'INVALID_EMAIL';

  constructor(input: string) {
    super(`Invalid email address: "${input}"`);
  }
}

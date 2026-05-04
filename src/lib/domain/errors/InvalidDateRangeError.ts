import { DomainError } from './DomainError';

export class InvalidDateRangeError extends DomainError {
  readonly code = 'INVALID_DATE_RANGE' as const;
  constructor(message: string) {
    super(message);
  }
}

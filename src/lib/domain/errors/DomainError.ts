/**
 * Base class for all errors that originate from the domain layer.
 * Every concrete subclass MUST set a stable `code` for programmatic identification.
 */
export abstract class DomainError extends Error {
  abstract readonly code: string;

  constructor(message: string) {
    super(message);
    this.name = new.target.name;
  }
}

import { Result } from '$domain/shared/Result';
import { InvalidEmailError } from '$domain/errors/InvalidEmailError';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class Email {
  private constructor(private readonly value: string) {}

  static create(raw: string): Result<Email, InvalidEmailError> {
    const normalized = raw.trim().toLowerCase();
    if (!EMAIL_PATTERN.test(normalized)) {
      return Result.err(new InvalidEmailError(raw));
    }
    return Result.ok(new Email(normalized));
  }

  toString(): string {
    return this.value;
  }

  equals(other: Email): boolean {
    return this.value === other.value;
  }
}

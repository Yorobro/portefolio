import type { EmailService, ContactNotificationPayload } from '$application/ports/EmailService';
import { Result } from '$domain/shared/Result';
import { DomainError } from '$domain/errors/DomainError';

class FakeEmailFailureError extends DomainError {
  readonly code = 'FAKE_EMAIL_FAILED' as const;
}

export class FakeEmailService implements EmailService {
  public sent: ContactNotificationPayload[] = [];
  public shouldFail = false;

  async sendContactNotification(
    payload: ContactNotificationPayload,
  ): Promise<Result<void, DomainError>> {
    if (this.shouldFail) {
      return Result.err<void, DomainError>(new FakeEmailFailureError('email failed'));
    }
    this.sent.push(payload);
    return Result.ok<void, DomainError>(undefined);
  }
}

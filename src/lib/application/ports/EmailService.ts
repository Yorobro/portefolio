import type { Result } from '$domain/shared/Result';
import type { DomainError } from '$domain/errors/DomainError';

export interface ContactNotificationPayload {
  fromEmail: string;
  fromName: string;
  subject: string;
  message: string;
  receivedAt: Date;
}

export interface EmailService {
  sendContactNotification(payload: ContactNotificationPayload): Promise<Result<void, DomainError>>;
}

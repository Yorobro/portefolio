import type { ContactMessageRepository } from '$application/ports/ContactMessageRepository';
import type { EmailService } from '$application/ports/EmailService';
import type { Clock } from '$application/ports/Clock';
import { ContactMessage } from '$domain/entities/ContactMessage';
import { Email } from '$domain/value-objects/Email';
import { Result } from '$domain/shared/Result';
import { ContactMessageRejectedError } from '$domain/errors/ContactMessageRejectedError';
import type { InvalidEmailError } from '$domain/errors/InvalidEmailError';
import type { DomainError } from '$domain/errors/DomainError';

export const RATE_LIMIT_MAX = 5;
export const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;

export interface SubmitContactMessageDeps {
  contactRepository: ContactMessageRepository;
  emailService: EmailService;
  clock: Clock;
  idGenerator?: () => string;
}

export interface SubmitContactMessageInput {
  email: string;
  name: string;
  subject: string;
  message: string;
  ipHash: string;
}

export interface SubmitContactMessageOutput {
  id: string;
  emailDelivered: boolean;
}

export type SubmitContactMessage = (
  input: SubmitContactMessageInput,
) => Promise<
  Result<SubmitContactMessageOutput, ContactMessageRejectedError | InvalidEmailError | DomainError>
>;

const defaultIdGenerator = (): string =>
  globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;

export function createSubmitContactMessage({
  contactRepository,
  emailService,
  clock,
  idGenerator = defaultIdGenerator,
}: SubmitContactMessageDeps): SubmitContactMessage {
  return async (input) => {
    const now = clock.now();
    const since = new Date(now.getTime() - RATE_LIMIT_WINDOW_MS);
    const countResult = await contactRepository.countRecentByIpHash(input.ipHash, since);
    if (!countResult.ok) return Result.err(countResult.error);
    if (countResult.value >= RATE_LIMIT_MAX) {
      return Result.err(
        new ContactMessageRejectedError('rate-limited', 'Too many messages, retry later'),
      );
    }

    const emailVO = Email.create(input.email);
    if (!emailVO.ok) return Result.err(emailVO.error);

    const message = ContactMessage.create({
      id: idGenerator(),
      email: emailVO.value,
      name: input.name,
      subject: input.subject,
      message: input.message,
      receivedAt: now,
    });
    if (!message.ok) return Result.err(message.error);

    const saved = await contactRepository.save(message.value);
    if (!saved.ok) return Result.err(saved.error);

    const notification = await emailService.sendContactNotification({
      fromEmail: emailVO.value.toString(),
      fromName: input.name,
      subject: input.subject,
      message: input.message,
      receivedAt: now,
    });

    let emailDelivered = false;
    if (notification.ok) {
      emailDelivered = true;
      await contactRepository.markEmailSent(message.value.id);
    }

    return Result.ok({ id: message.value.id, emailDelivered });
  };
}

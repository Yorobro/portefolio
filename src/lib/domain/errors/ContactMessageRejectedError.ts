import { DomainError } from './DomainError';

export type ContactMessageRejectedReason =
  | 'invalid-name'
  | 'invalid-subject'
  | 'invalid-message'
  | 'message-too-long'
  | 'rate-limited'
  | 'spam-detected';

export class ContactMessageRejectedError extends DomainError {
  readonly code = 'CONTACT_MESSAGE_REJECTED' as const;
  constructor(
    public readonly reason: ContactMessageRejectedReason,
    message: string,
  ) {
    super(message);
  }
}

import { Result } from '$domain/shared/Result';
import { ContactMessageRejectedError } from '$domain/errors/ContactMessageRejectedError';
import type { Email } from '$domain/value-objects/Email';

export const MAX_MESSAGE_LENGTH = 5000;
export const MAX_SUBJECT_LENGTH = 200;
export const MAX_NAME_LENGTH = 120;

export interface ContactMessageProps {
  id: string;
  email: Email;
  name: string;
  subject: string;
  message: string;
  receivedAt: Date;
}

export class ContactMessage {
  private constructor(private readonly props: Readonly<ContactMessageProps>) {}

  static create(props: ContactMessageProps): Result<ContactMessage, ContactMessageRejectedError> {
    const name = props.name.trim();
    const subject = props.subject.trim();
    const message = props.message.trim();

    if (name.length === 0 || name.length > MAX_NAME_LENGTH)
      return Result.err(
        new ContactMessageRejectedError('invalid-name', `name must be 1..${MAX_NAME_LENGTH} chars`),
      );
    if (subject.length === 0 || subject.length > MAX_SUBJECT_LENGTH)
      return Result.err(
        new ContactMessageRejectedError(
          'invalid-subject',
          `subject must be 1..${MAX_SUBJECT_LENGTH} chars`,
        ),
      );
    if (message.length === 0)
      return Result.err(new ContactMessageRejectedError('invalid-message', 'message is empty'));
    if (message.length > MAX_MESSAGE_LENGTH)
      return Result.err(
        new ContactMessageRejectedError(
          'message-too-long',
          `message exceeds ${MAX_MESSAGE_LENGTH} chars`,
        ),
      );

    return Result.ok(new ContactMessage(Object.freeze({ ...props, name, subject, message })));
  }

  get id(): string {
    return this.props.id;
  }
  get email(): Email {
    return this.props.email;
  }
  get name(): string {
    return this.props.name;
  }
  get subject(): string {
    return this.props.subject;
  }
  get message(): string {
    return this.props.message;
  }
  get receivedAt(): Date {
    return this.props.receivedAt;
  }
}

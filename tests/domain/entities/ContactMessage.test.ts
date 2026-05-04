import { describe, it, expect } from 'vitest';
import { ContactMessage } from '$domain/entities/ContactMessage';
import { Email } from '$domain/value-objects/Email';

const validEmail = () => {
  const r = Email.create('hi@example.com');
  if (!r.ok) throw new Error('setup');
  return r.value;
};

describe('ContactMessage', () => {
  it('creates a valid message', () => {
    const r = ContactMessage.create({
      id: 'uuid-1',
      email: validEmail(),
      name: 'Alice',
      subject: 'Hello',
      message: 'A reasonably long message body.',
      receivedAt: new Date(),
    });
    expect(r.ok).toBe(true);
  });

  it('rejects empty name', () => {
    const r = ContactMessage.create({
      id: 'uuid-2',
      email: validEmail(),
      name: '',
      subject: 'x',
      message: 'message body',
      receivedAt: new Date(),
    });
    expect(r.ok).toBe(false);
  });

  it('rejects message > 5000 chars', () => {
    const long = 'a'.repeat(5001);
    const r = ContactMessage.create({
      id: 'uuid-3',
      email: validEmail(),
      name: 'Bob',
      subject: 'x',
      message: long,
      receivedAt: new Date(),
    });
    expect(r.ok).toBe(false);
  });
});

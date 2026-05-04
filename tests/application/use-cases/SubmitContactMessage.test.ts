import { describe, it, expect } from 'vitest';
import { createSubmitContactMessage } from '$application/use-cases/SubmitContactMessage';
import { InMemoryContactMessageRepository } from '../../fakes/InMemoryContactMessageRepository';
import { FakeEmailService } from '../../fakes/FakeEmailService';
import { FixedClock } from '../../fakes/FixedClock';
import { ContactMessageRejectedError } from '$domain/errors/ContactMessageRejectedError';
import { InvalidEmailError } from '$domain/errors/InvalidEmailError';

const setup = () => ({
  contactRepository: new InMemoryContactMessageRepository(),
  emailService: new FakeEmailService(),
  clock: new FixedClock(new Date('2026-05-04T10:00:00Z')),
});

const validInput = (
  overrides: Partial<{
    email: string;
    name: string;
    subject: string;
    message: string;
    ipHash: string;
  }> = {},
) => ({
  email: 'user@example.com',
  name: 'Alice',
  subject: 'Hello',
  message: 'A reasonably long message body.',
  ipHash: 'hash-1',
  ...overrides,
});

describe('SubmitContactMessage', () => {
  it('saves message and sends email on happy path', async () => {
    const deps = setup();
    const useCase = createSubmitContactMessage(deps);
    const r = await useCase(validInput());
    expect(r.ok).toBe(true);
    expect(deps.contactRepository.saved.length).toBe(1);
    expect(deps.emailService.sent.length).toBe(1);
  });

  it('rejects invalid email', async () => {
    const deps = setup();
    const useCase = createSubmitContactMessage(deps);
    const r = await useCase(validInput({ email: 'not-an-email' }));
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toBeInstanceOf(InvalidEmailError);
  });

  it('rejects when rate limited', async () => {
    const deps = setup();
    deps.contactRepository.recentCounts.set('hash-1', 5);
    const useCase = createSubmitContactMessage(deps);
    const r = await useCase(validInput());
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.error).toBeInstanceOf(ContactMessageRejectedError);
      expect((r.error as ContactMessageRejectedError).reason).toBe('rate-limited');
    }
  });

  it('still saves when email fails (degraded mode)', async () => {
    const deps = setup();
    deps.emailService.shouldFail = true;
    const useCase = createSubmitContactMessage(deps);
    const r = await useCase(validInput());
    expect(deps.contactRepository.saved.length).toBe(1);
    // Strategy: succeed at the use-case level (message saved), surface email failure separately via flag.
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.emailDelivered).toBe(false);
  });
});

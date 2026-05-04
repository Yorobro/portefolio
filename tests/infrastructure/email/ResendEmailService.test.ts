import { describe, it, expect, vi } from 'vitest';
import { createResendEmailService } from '$infrastructure/email/ResendEmailService';

describe('ResendEmailService', () => {
  it('forwards payload to Resend client and returns ok on success', async () => {
    const send = vi.fn().mockResolvedValue({ data: { id: 'e1' }, error: null });
    const client = { emails: { send } };
    const service = createResendEmailService({
      client: client as never,
      fromAddress: 'noreply@portfolio.dev',
      toAddress: 'yohan@example.com',
    });
    const r = await service.sendContactNotification({
      fromEmail: 'a@b.com',
      fromName: 'Alice',
      subject: 'hi',
      message: 'body',
      receivedAt: new Date(),
    });
    expect(r.ok).toBe(true);
    expect(send).toHaveBeenCalledOnce();
  });

  it('returns Err when Resend reports an error', async () => {
    const send = vi.fn().mockResolvedValue({ data: null, error: { message: 'oops' } });
    const client = { emails: { send } };
    const service = createResendEmailService({
      client: client as never,
      fromAddress: 'noreply@portfolio.dev',
      toAddress: 'yohan@example.com',
    });
    const r = await service.sendContactNotification({
      fromEmail: 'a@b.com',
      fromName: 'A',
      subject: 's',
      message: 'm',
      receivedAt: new Date(),
    });
    expect(r.ok).toBe(false);
  });
});

import type { Resend } from 'resend';
import type { EmailService, ContactNotificationPayload } from '$application/ports/EmailService';
import { Result } from '$domain/shared/Result';
import { DomainError } from '$domain/errors/DomainError';

export class EmailDeliveryError extends DomainError {
  readonly code = 'EMAIL_DELIVERY_ERROR' as const;
}

export interface ResendEmailServiceDeps {
  client: Resend;
  fromAddress: string;
  toAddress: string;
}

export function createResendEmailService({
  client,
  fromAddress,
  toAddress,
}: ResendEmailServiceDeps): EmailService {
  return {
    async sendContactNotification(payload: ContactNotificationPayload) {
      const subject = `[Portfolio] ${payload.subject}`;
      const html = renderEmailHtml(payload);
      const text = renderEmailText(payload);
      try {
        const response = await client.emails.send({
          from: fromAddress,
          to: [toAddress],
          replyTo: payload.fromEmail,
          subject,
          html,
          text,
        });
        if (response.error) {
          return Result.err(new EmailDeliveryError(response.error.message));
        }
        return Result.ok(undefined);
      } catch (e) {
        return Result.err(new EmailDeliveryError((e as Error).message));
      }
    },
  };
}

function renderEmailHtml(p: ContactNotificationPayload): string {
  return `<p>From: <b>${escapeHtml(p.fromName)}</b> &lt;${escapeHtml(p.fromEmail)}&gt;</p>
<p>${escapeHtml(p.message).replace(/\n/g, '<br>')}</p>
<hr><p style="color:#666">Reçu le ${p.receivedAt.toISOString()}</p>`;
}

function renderEmailText(p: ContactNotificationPayload): string {
  return `From: ${p.fromName} <${p.fromEmail}>\n\n${p.message}\n\n---\nReçu le ${p.receivedAt.toISOString()}`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

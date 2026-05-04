import { and, eq, gte, count } from 'drizzle-orm';
import type { ContactMessageRepository } from '$application/ports/ContactMessageRepository';
import type { ContactMessage } from '$domain/entities/ContactMessage';
import { Result } from '$domain/shared/Result';
import { DomainError } from '$domain/errors/DomainError';
import type { AppDb } from './db';
import { contactMessages } from './schema';

export class PersistenceError extends DomainError {
  readonly code = 'PERSISTENCE_ERROR' as const;
}

export interface SqliteContactMessageRepositoryDeps {
  db: AppDb;
  ipHashFor: (message: ContactMessage) => string;
}

export function createSqliteContactMessageRepository({
  db,
  ipHashFor,
}: SqliteContactMessageRepositoryDeps): ContactMessageRepository {
  return {
    async save(message) {
      try {
        await db.insert(contactMessages).values({
          id: message.id,
          email: message.email.toString(),
          name: message.name,
          subject: message.subject,
          message: message.message,
          receivedAt: message.receivedAt,
          ipHash: ipHashFor(message),
          emailSent: false,
        });
        return Result.ok(undefined);
      } catch (e) {
        return Result.err(new PersistenceError(`save failed: ${(e as Error).message}`));
      }
    },
    async countRecentByIpHash(ipHash, since) {
      try {
        const rows = await db
          .select({ n: count() })
          .from(contactMessages)
          .where(and(eq(contactMessages.ipHash, ipHash), gte(contactMessages.receivedAt, since)));
        return Result.ok(rows[0]?.n ?? 0);
      } catch (e) {
        return Result.err(new PersistenceError(`count failed: ${(e as Error).message}`));
      }
    },
    async markEmailSent(id) {
      try {
        await db.update(contactMessages).set({ emailSent: true }).where(eq(contactMessages.id, id));
        return Result.ok(undefined);
      } catch (e) {
        return Result.err(new PersistenceError(`update failed: ${(e as Error).message}`));
      }
    },
  };
}

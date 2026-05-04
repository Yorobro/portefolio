import { describe, it, expect } from 'vitest';
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from '$infrastructure/persistence/sqlite/schema';
import { createSqliteContactMessageRepository } from '$infrastructure/persistence/sqlite/SqliteContactMessageRepository';
import { ContactMessage } from '$domain/entities/ContactMessage';
import { Email } from '$domain/value-objects/Email';

function setupDb() {
  const sqlite = new Database(':memory:');
  const db = drizzle(sqlite, { schema });
  // Create table inline (we don't run migrations in tests for simplicity)
  sqlite.exec(`
    CREATE TABLE contact_messages (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL,
      name TEXT NOT NULL,
      subject TEXT NOT NULL,
      message TEXT NOT NULL,
      received_at INTEGER NOT NULL,
      ip_hash TEXT NOT NULL,
      email_sent INTEGER NOT NULL DEFAULT 0
    );
  `);
  return { sqlite, db };
}

function buildMessage(id: string, when: Date) {
  const email = Email.create('a@b.com');
  if (!email.ok) throw new Error('setup');
  const r = ContactMessage.create({
    id,
    email: email.value,
    name: 'Alice',
    subject: 'hi',
    message: 'body',
    receivedAt: when,
  });
  if (!r.ok) throw new Error('setup');
  return r.value;
}

describe('SqliteContactMessageRepository', () => {
  it('saves and counts recent', async () => {
    const { db } = setupDb();
    const repo = createSqliteContactMessageRepository({ db, ipHashFor: () => 'h1' });
    const now = new Date();
    await repo.save(buildMessage('id-1', now));
    const r = await repo.countRecentByIpHash('h1', new Date(now.getTime() - 60_000));
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value).toBe(1);
  });

  it('marks email sent', async () => {
    const { db } = setupDb();
    const repo = createSqliteContactMessageRepository({ db, ipHashFor: () => 'h1' });
    await repo.save(buildMessage('id-2', new Date()));
    const r = await repo.markEmailSent('id-2');
    expect(r.ok).toBe(true);
  });
});

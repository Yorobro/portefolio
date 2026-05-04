import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const contactMessages = sqliteTable('contact_messages', {
  id: text('id').primaryKey(),
  email: text('email').notNull(),
  name: text('name').notNull(),
  subject: text('subject').notNull(),
  message: text('message').notNull(),
  receivedAt: integer('received_at', { mode: 'timestamp' }).notNull(),
  ipHash: text('ip_hash').notNull(),
  emailSent: integer('email_sent', { mode: 'boolean' }).notNull().default(false),
});

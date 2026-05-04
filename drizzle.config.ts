import type { Config } from 'drizzle-kit';

export default {
  schema: './src/lib/infrastructure/persistence/sqlite/schema.ts',
  out: './src/lib/infrastructure/persistence/sqlite/migrations',
  dialect: 'sqlite',
  dbCredentials: {
    url: process.env.DATABASE_PATH ?? './portfolio.db',
  },
} satisfies Config;

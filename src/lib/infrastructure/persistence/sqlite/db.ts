import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import * as schema from './schema';

export type AppDb = ReturnType<typeof drizzle<typeof schema>>;

export interface DbConfig {
  databasePath: string;
  migrationsFolder?: string | undefined;
}

export function createDb(config: DbConfig): AppDb {
  const sqlite = new Database(config.databasePath);
  sqlite.pragma('journal_mode = WAL');
  const db = drizzle(sqlite, { schema });
  if (config.migrationsFolder) {
    migrate(db, { migrationsFolder: config.migrationsFolder });
  }
  return db;
}

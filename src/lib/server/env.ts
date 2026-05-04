import { z } from 'zod';

const envSchema = z.object({
  RESEND_API_KEY: z.string().min(1),
  CONTACT_NOTIFICATION_EMAIL: z.string().email(),
  CONTACT_FROM_EMAIL: z.string().email(),
  DATABASE_PATH: z.string().min(1).default('./portfolio.db'),
  CONTENT_DIR: z.string().min(1).default('./content'),
  MIGRATIONS_DIR: z
    .string()
    .min(1)
    .default('./src/lib/infrastructure/persistence/sqlite/migrations'),
  PUBLIC_SITE_URL: z.string().url(),
  IP_HASH_SALT: z.string().min(16),
});

export type AppEnv = z.infer<typeof envSchema>;

export type EnvSource = Record<string, string | undefined>;

export function loadEnv(source: EnvSource = process.env): AppEnv {
  const parsed = envSchema.safeParse(source);
  if (!parsed.success) {
    const flat = parsed.error.flatten();
    throw new Error(`Invalid environment variables: ${JSON.stringify(flat.fieldErrors, null, 2)}`);
  }
  return parsed.data;
}

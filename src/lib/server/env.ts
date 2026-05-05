import { z } from 'zod';

const envSchema = z.object({
  CONTENT_DIR: z.string().min(1).default('./content'),
  PUBLIC_SITE_URL: z.string().url(),
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

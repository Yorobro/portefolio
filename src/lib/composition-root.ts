import { Resend } from 'resend';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { createDb } from '$infrastructure/persistence/sqlite/db';
import { createFilesystemProjectRepository } from '$infrastructure/persistence/filesystem/FilesystemProjectRepository';
import { createFilesystemExperienceRepository } from '$infrastructure/persistence/filesystem/FilesystemExperienceRepository';
import { createFilesystemSkillRepository } from '$infrastructure/persistence/filesystem/FilesystemSkillRepository';
import { createSqliteContactMessageRepository } from '$infrastructure/persistence/sqlite/SqliteContactMessageRepository';
import { createResendEmailService } from '$infrastructure/email/ResendEmailService';
import { createSystemClock } from '$infrastructure/clock/SystemClock';
import { createListProjects } from '$application/use-cases/ListProjects';
import { createGetProjectBySlug } from '$application/use-cases/GetProjectBySlug';
import { createListExperiences } from '$application/use-cases/ListExperiences';
import { createListSkills } from '$application/use-cases/ListSkills';
import { createSubmitContactMessage } from '$application/use-cases/SubmitContactMessage';
import { loadEnv } from '$server/env';
import { env as dynamicPrivateEnv } from '$env/dynamic/private';
import { env as dynamicPublicEnv } from '$env/dynamic/public';

// Vite/SvelteKit loads `.env` files into `$env/dynamic/{private,public}`, not
// into `process.env`. We merge both into the source for `loadEnv` (which
// defaults to `process.env` for non-SvelteKit callers like tests/scripts).
const env = loadEnv({ ...process.env, ...dynamicPrivateEnv, ...dynamicPublicEnv });

const db = createDb({
  databasePath: env.DATABASE_PATH,
  migrationsFolder: env.MIGRATIONS_DIR,
});

const projectRepository = createFilesystemProjectRepository({
  contentDir: path.join(env.CONTENT_DIR, 'projects'),
});
const experienceRepository = createFilesystemExperienceRepository({
  contentDir: path.join(env.CONTENT_DIR, 'experiences'),
});
const skillRepository = createFilesystemSkillRepository({
  contentDir: path.join(env.CONTENT_DIR, 'skills'),
});

// The contact form action computes the IP hash from getClientAddress() and
// passes it through SubmitContactMessage's input. The repo's ipHashFor callback
// is therefore a no-op fallback ("pending") — the actual ipHash is stored via
// the message's context in the use case flow. Phase 7 wiring will refine this.
const contactRepository = createSqliteContactMessageRepository({
  db,
  ipHashFor: () => 'pending',
});

const resendClient = new Resend(env.RESEND_API_KEY);
const emailService = createResendEmailService({
  client: resendClient,
  fromAddress: env.CONTACT_FROM_EMAIL,
  toAddress: env.CONTACT_NOTIFICATION_EMAIL,
});

const clock = createSystemClock();

export const useCases = {
  listProjects: createListProjects({ projectRepository }),
  getProjectBySlug: createGetProjectBySlug({ projectRepository }),
  listExperiences: createListExperiences({ experienceRepository }),
  listSkills: createListSkills({ skillRepository }),
  submitContactMessage: createSubmitContactMessage({
    contactRepository,
    emailService,
    clock,
  }),
} as const;

export function hashIp(rawIp: string): string {
  return createHash('sha256').update(`${env.IP_HASH_SALT}:${rawIp}`).digest('hex');
}

export const appConfig = {
  publicSiteUrl: env.PUBLIC_SITE_URL,
} as const;

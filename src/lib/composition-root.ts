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
import { createListProjects, type ListProjects } from '$application/use-cases/ListProjects';
import {
  createGetProjectBySlug,
  type GetProjectBySlug,
} from '$application/use-cases/GetProjectBySlug';
import {
  createListExperiences,
  type ListExperiences,
} from '$application/use-cases/ListExperiences';
import { createListSkills, type ListSkills } from '$application/use-cases/ListSkills';
import {
  createSubmitContactMessage,
  type SubmitContactMessage,
} from '$application/use-cases/SubmitContactMessage';
import { loadEnv, type AppEnv } from '$server/env';
import { env as dynamicPrivateEnv } from '$env/dynamic/private';
import { env as dynamicPublicEnv } from '$env/dynamic/public';

// Lazy initialization: env loading and dependency wiring is deferred until
// the first time `getUseCases()` / `getAppConfig()` / `hashIp()` is called.
//
// Why: SvelteKit's prerender/analyse step imports every server module to walk
// route exports, which would trigger top-level env validation and crash any
// build that doesn't have a `.env` (typical CI). We delay until a request
// actually needs the wiring.
//
// Memoization: dependencies are constructed exactly once per process.

interface Container {
  env: AppEnv;
  useCases: {
    listProjects: ListProjects;
    getProjectBySlug: GetProjectBySlug;
    listExperiences: ListExperiences;
    listSkills: ListSkills;
    submitContactMessage: SubmitContactMessage;
  };
}

let container: Container | undefined;

function buildContainer(): Container {
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
  // the message's context in the use case flow.
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

  return {
    env,
    useCases: {
      listProjects: createListProjects({ projectRepository }),
      getProjectBySlug: createGetProjectBySlug({ projectRepository }),
      listExperiences: createListExperiences({ experienceRepository }),
      listSkills: createListSkills({ skillRepository }),
      submitContactMessage: createSubmitContactMessage({
        contactRepository,
        emailService,
        clock,
      }),
    },
  };
}

function getContainer(): Container {
  if (!container) {
    container = buildContainer();
  }
  return container;
}

/** Lazy-initialized use cases (env validated on first access, not at import). */
export const useCases = {
  listProjects: ((input) => getContainer().useCases.listProjects(input)) as ListProjects,
  getProjectBySlug: ((input) =>
    getContainer().useCases.getProjectBySlug(input)) as GetProjectBySlug,
  listExperiences: (() => getContainer().useCases.listExperiences()) as ListExperiences,
  listSkills: (() => getContainer().useCases.listSkills()) as ListSkills,
  submitContactMessage: ((input) =>
    getContainer().useCases.submitContactMessage(input)) as SubmitContactMessage,
} as const;

export function hashIp(rawIp: string): string {
  const env = getContainer().env;
  return createHash('sha256').update(`${env.IP_HASH_SALT}:${rawIp}`).digest('hex');
}

export const appConfig = {
  get publicSiteUrl(): string {
    return getContainer().env.PUBLIC_SITE_URL;
  },
};

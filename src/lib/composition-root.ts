import path from 'node:path';
import { createFilesystemProjectRepository } from '$infrastructure/persistence/filesystem/FilesystemProjectRepository';
import { createFilesystemExperienceRepository } from '$infrastructure/persistence/filesystem/FilesystemExperienceRepository';
import { createFilesystemSkillRepository } from '$infrastructure/persistence/filesystem/FilesystemSkillRepository';
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
import { loadEnv, type AppEnv } from '$server/env';
import { env as dynamicPrivateEnv } from '$env/dynamic/private';
import { env as dynamicPublicEnv } from '$env/dynamic/public';

// Lazy initialization: env loading and dependency wiring is deferred until
// the first time `getUseCases()` / `getAppConfig()` is called.
//
// Why: SvelteKit's prerender/analyse step imports every server module to walk
// route exports, which would trigger top-level env validation and crash any
// build that doesn't have a `.env` (typical CI). We delay until a request
// actually needs the wiring.

interface Container {
  env: AppEnv;
  useCases: {
    listProjects: ListProjects;
    getProjectBySlug: GetProjectBySlug;
    listExperiences: ListExperiences;
    listSkills: ListSkills;
  };
}

let container: Container | undefined;

function buildContainer(): Container {
  const env = loadEnv({ ...process.env, ...dynamicPrivateEnv, ...dynamicPublicEnv });

  const projectRepository = createFilesystemProjectRepository({
    contentDir: path.join(env.CONTENT_DIR, 'projects'),
  });
  const experienceRepository = createFilesystemExperienceRepository({
    contentDir: path.join(env.CONTENT_DIR, 'experiences'),
  });
  const skillRepository = createFilesystemSkillRepository({
    contentDir: path.join(env.CONTENT_DIR, 'skills'),
  });

  return {
    env,
    useCases: {
      listProjects: createListProjects({ projectRepository }),
      getProjectBySlug: createGetProjectBySlug({ projectRepository }),
      listExperiences: createListExperiences({ experienceRepository }),
      listSkills: createListSkills({ skillRepository }),
    },
  };
}

function getContainer(): Container {
  if (!container) {
    container = buildContainer();
  }
  return container;
}

export const useCases = {
  listProjects: ((input) => getContainer().useCases.listProjects(input)) as ListProjects,
  getProjectBySlug: ((input) =>
    getContainer().useCases.getProjectBySlug(input)) as GetProjectBySlug,
  listExperiences: (() => getContainer().useCases.listExperiences()) as ListExperiences,
  listSkills: (() => getContainer().useCases.listSkills()) as ListSkills,
} as const;

export const appConfig = {
  get publicSiteUrl(): string {
    return getContainer().env.PUBLIC_SITE_URL;
  },
};

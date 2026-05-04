import type { PageServerLoad } from './$types';
import { useCases } from '$lib/composition-root';
import { ProjectViewModelMapper } from '$presentation/mappers/ProjectViewModelMapper';
import { error } from '@sveltejs/kit';
import { ProjectNotFoundError } from '$domain/errors/ProjectNotFoundError';
import { InvalidProjectSlugError } from '$domain/errors/InvalidProjectSlugError';

export const load: PageServerLoad = async ({ params }) => {
  const r = await useCases.getProjectBySlug({ slug: params.slug });
  if (!r.ok) {
    if (r.error instanceof ProjectNotFoundError || r.error instanceof InvalidProjectSlugError) {
      throw error(404, 'Projet introuvable');
    }
    throw error(500, r.error.message);
  }
  return { project: ProjectViewModelMapper.toDetail(r.value) };
};

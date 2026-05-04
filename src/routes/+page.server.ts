import type { PageServerLoad } from './$types';
import { useCases } from '$lib/composition-root';
import { ProjectViewModelMapper } from '$presentation/mappers/ProjectViewModelMapper';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
  const r = await useCases.listProjects({ featured: true });
  if (!r.ok) {
    throw error(500, r.error.message);
  }
  return {
    featuredProjects: r.value.map(ProjectViewModelMapper.toListItem),
  };
};

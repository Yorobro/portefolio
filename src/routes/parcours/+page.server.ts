import type { PageServerLoad } from './$types';
import { useCases } from '$lib/composition-root';
import { ExperienceViewModelMapper } from '$presentation/mappers/ExperienceViewModelMapper';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
  const exp = await useCases.listExperiences();
  if (!exp.ok) throw error(500, exp.error.message);

  // Sort experiences from most recent to oldest (by start date, descending).
  // Done at the route boundary because it's a presentation concern, not a
  // domain rule — the use case stays neutral about ordering.
  const experiences = exp.value
    .map(ExperienceViewModelMapper.toViewModel)
    .toSorted((a, b) => b.dateStartIso.localeCompare(a.dateStartIso));

  return { experiences };
};

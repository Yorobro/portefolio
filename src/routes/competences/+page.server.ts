import type { PageServerLoad } from './$types';
import { useCases } from '$lib/composition-root';
import { SkillViewModelMapper } from '$presentation/mappers/SkillViewModelMapper';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
  const skl = await useCases.listSkills();
  if (!skl.ok) throw error(500, skl.error.message);
  return {
    skills: skl.value.map(SkillViewModelMapper.toViewModel),
  };
};

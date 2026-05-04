import type { PageServerLoad } from './$types';
import { useCases } from '$lib/composition-root';
import { ExperienceViewModelMapper } from '$presentation/mappers/ExperienceViewModelMapper';
import { SkillViewModelMapper } from '$presentation/mappers/SkillViewModelMapper';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
  const exp = await useCases.listExperiences();
  const skl = await useCases.listSkills();
  if (!exp.ok) throw error(500, exp.error.message);
  if (!skl.ok) throw error(500, skl.error.message);
  return {
    experiences: exp.value.map(ExperienceViewModelMapper.toViewModel),
    skills: skl.value.map(SkillViewModelMapper.toViewModel),
  };
};

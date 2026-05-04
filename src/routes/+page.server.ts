import type { PageServerLoad } from './$types';
import { useCases } from '$lib/composition-root';
import { ProjectViewModelMapper } from '$presentation/mappers/ProjectViewModelMapper';
import { SkillViewModelMapper } from '$presentation/mappers/SkillViewModelMapper';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
  const projects = await useCases.listProjects({ featured: true });
  if (!projects.ok) throw error(500, projects.error.message);

  const skills = await useCases.listSkills();
  if (!skills.ok) throw error(500, skills.error.message);

  return {
    featuredProjects: projects.value.map(ProjectViewModelMapper.toListItem),
    softSkills: skills.value
      .map(SkillViewModelMapper.toViewModel)
      .filter((s) => s.category === 'soft'),
  };
};

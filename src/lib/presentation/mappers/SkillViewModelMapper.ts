import type { Skill } from '$domain/entities/Skill';
import type { SkillViewModel } from '$presentation/view-models/SkillViewModel';

function toViewModel(s: Skill): SkillViewModel {
  return { name: s.name, category: s.category, level: s.level };
}

export const SkillViewModelMapper = { toViewModel };

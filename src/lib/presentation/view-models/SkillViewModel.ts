export interface SkillViewModel {
  name: string;
  category: 'language' | 'framework' | 'database' | 'devops' | 'deployment' | 'design' | 'soft';
  level: 'novice' | 'intermediate' | 'advanced' | 'expert';
}

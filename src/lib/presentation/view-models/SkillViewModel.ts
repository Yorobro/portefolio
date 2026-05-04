export interface SkillViewModel {
  name: string;
  category: 'language' | 'framework' | 'database' | 'devops' | 'design' | 'soft';
  level: 'novice' | 'intermediate' | 'advanced' | 'expert';
}

import { Result } from '$domain/shared/Result';
import { DomainError } from '$domain/errors/DomainError';

export class InvalidSkillError extends DomainError {
  readonly code = 'INVALID_SKILL' as const;
}

export const SKILL_CATEGORIES = [
  'language',
  'framework',
  'database',
  'devops',
  'design',
  'soft',
] as const;
export type SkillCategory = (typeof SKILL_CATEGORIES)[number];

export const SKILL_LEVELS = ['novice', 'intermediate', 'advanced', 'expert'] as const;
export type SkillLevel = (typeof SKILL_LEVELS)[number];

export interface SkillProps {
  name: string;
  category: SkillCategory;
  level: SkillLevel;
}

export class Skill {
  private constructor(private readonly props: Readonly<SkillProps>) {}

  static create(props: SkillProps): Result<Skill, InvalidSkillError> {
    if (props.name.trim().length === 0) {
      return Result.err(new InvalidSkillError('name is required'));
    }
    return Result.ok(new Skill(Object.freeze({ ...props })));
  }

  get name(): string {
    return this.props.name;
  }
  get category(): SkillCategory {
    return this.props.category;
  }
  get level(): SkillLevel {
    return this.props.level;
  }
}

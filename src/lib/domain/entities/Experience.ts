import { Result } from '$domain/shared/Result';
import { DomainError } from '$domain/errors/DomainError';
import type { DateRange } from '$domain/value-objects/DateRange';

export class InvalidExperienceError extends DomainError {
  readonly code = 'INVALID_EXPERIENCE' as const;
}

export const EXPERIENCE_TYPES = ['alternance', 'stage', 'cdi', 'cdd', 'freelance'] as const;
export type ExperienceType = (typeof EXPERIENCE_TYPES)[number];

export interface ExperienceProps {
  company: string;
  location: string;
  role: string;
  type: ExperienceType;
  dateRange: DateRange;
  summary: string;
  highlights: readonly string[];
}

export class Experience {
  private constructor(private readonly props: Readonly<ExperienceProps>) {}

  static create(props: ExperienceProps): Result<Experience, InvalidExperienceError> {
    if (props.company.trim().length === 0) {
      return Result.err(new InvalidExperienceError('company is required'));
    }
    if (props.role.trim().length === 0) {
      return Result.err(new InvalidExperienceError('role is required'));
    }
    if (props.summary.trim().length === 0) {
      return Result.err(new InvalidExperienceError('summary is required'));
    }
    return Result.ok(new Experience(Object.freeze({ ...props })));
  }

  get company(): string {
    return this.props.company;
  }
  get location(): string {
    return this.props.location;
  }
  get role(): string {
    return this.props.role;
  }
  get type(): ExperienceType {
    return this.props.type;
  }
  get dateRange(): DateRange {
    return this.props.dateRange;
  }
  get summary(): string {
    return this.props.summary;
  }
  get highlights(): readonly string[] {
    return this.props.highlights;
  }
}

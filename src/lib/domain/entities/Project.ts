import { Result } from '$domain/shared/Result';
import { DomainError } from '$domain/errors/DomainError';
import type { ProjectSlug } from '$domain/value-objects/ProjectSlug';
import type { TechStack } from '$domain/value-objects/TechStack';
import type { DateRange } from '$domain/value-objects/DateRange';
import type { ProjectStatus } from '$domain/value-objects/ProjectStatus';
import type { ProjectType } from '$domain/value-objects/ProjectType';
import type { MediaAsset } from '$domain/value-objects/MediaAsset';

export class InvalidProjectError extends DomainError {
  readonly code = 'INVALID_PROJECT' as const;
}

export interface ProjectProps {
  slug: ProjectSlug;
  title: string;
  summary: string;
  description: string;
  stack: TechStack;
  status: ProjectStatus;
  type: ProjectType;
  featured: boolean;
  dateRange: DateRange;
  repoUrl?: string | undefined;
  liveUrl?: string | undefined;
  media: readonly MediaAsset[];
  architecture?: string | undefined;
  highlights: readonly string[];
}

export class Project {
  private constructor(private readonly props: Readonly<ProjectProps>) {}

  static create(props: ProjectProps): Result<Project, InvalidProjectError> {
    if (props.title.trim().length === 0) {
      return Result.err(new InvalidProjectError('title is required'));
    }
    if (props.summary.trim().length === 0) {
      return Result.err(new InvalidProjectError('summary is required'));
    }
    if (props.description.trim().length === 0) {
      return Result.err(new InvalidProjectError('description is required'));
    }
    return Result.ok(new Project(Object.freeze({ ...props })));
  }

  get slug(): ProjectSlug {
    return this.props.slug;
  }
  get title(): string {
    return this.props.title;
  }
  get summary(): string {
    return this.props.summary;
  }
  get description(): string {
    return this.props.description;
  }
  get stack(): TechStack {
    return this.props.stack;
  }
  get status(): ProjectStatus {
    return this.props.status;
  }
  get type(): ProjectType {
    return this.props.type;
  }
  get featured(): boolean {
    return this.props.featured;
  }
  get dateRange(): DateRange {
    return this.props.dateRange;
  }
  get repoUrl(): string | undefined {
    return this.props.repoUrl;
  }
  get liveUrl(): string | undefined {
    return this.props.liveUrl;
  }
  get media(): readonly MediaAsset[] {
    return this.props.media;
  }
  get architecture(): string | undefined {
    return this.props.architecture;
  }
  get highlights(): readonly string[] {
    return this.props.highlights;
  }
}

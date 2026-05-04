import { describe, it, expect } from 'vitest';
import { Project } from '$domain/entities/Project';
import { ProjectSlug } from '$domain/value-objects/ProjectSlug';
import { TechStack } from '$domain/value-objects/TechStack';
import { DateRange } from '$domain/value-objects/DateRange';

const baseProps = () => {
  const slug = ProjectSlug.create('deardiary');
  const stack = TechStack.create(['Spring Boot', 'Angular']);
  const range = DateRange.create(new Date('2024-09-01'), new Date('2025-06-01'));
  if (!slug.ok || !stack.ok || !range.ok) throw new Error('test setup failed');
  return {
    slug: slug.value,
    title: 'DearDiary',
    summary: 'A journaling app',
    description: '## DearDiary\n\nLong description.',
    stack: stack.value,
    status: 'finished' as const,
    type: 'personal' as const,
    featured: true,
    dateRange: range.value,
    repoUrl: 'https://github.com/x/y',
    liveUrl: undefined,
    media: [],
    architecture: undefined,
    highlights: ['Hexagonal architecture'],
  };
};

describe('Project', () => {
  it('creates a valid project', () => {
    const r = Project.create(baseProps());
    expect(r.ok).toBe(true);
  });

  it('rejects empty title', () => {
    const r = Project.create({ ...baseProps(), title: '   ' });
    expect(r.ok).toBe(false);
  });

  it('rejects empty summary', () => {
    const r = Project.create({ ...baseProps(), summary: '' });
    expect(r.ok).toBe(false);
  });

  it('exposes the slug as identifier', () => {
    const r = Project.create(baseProps());
    if (r.ok) expect(r.value.slug.toString()).toBe('deardiary');
  });
});

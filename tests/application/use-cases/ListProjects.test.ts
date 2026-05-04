import { describe, it, expect } from 'vitest';
import { createListProjects } from '$application/use-cases/ListProjects';
import { InMemoryProjectRepository } from '../../fakes/InMemoryProjectRepository';
import { Project } from '$domain/entities/Project';
import { ProjectSlug } from '$domain/value-objects/ProjectSlug';
import { TechStack } from '$domain/value-objects/TechStack';
import { DateRange } from '$domain/value-objects/DateRange';

function buildProject(slug: string, featured = false): Project {
  const slugVO = ProjectSlug.create(slug);
  const stack = TechStack.create(['ts']);
  const range = DateRange.create(new Date('2024-01-01'), undefined);
  if (!slugVO.ok || !stack.ok || !range.ok) throw new Error('setup');
  const r = Project.create({
    slug: slugVO.value,
    title: slug,
    summary: 'sum',
    description: 'desc',
    stack: stack.value,
    status: 'finished',
    type: 'personal',
    featured,
    dateRange: range.value,
    repoUrl: undefined,
    liveUrl: undefined,
    media: [],
    architecture: undefined,
    highlights: [],
  });
  if (!r.ok) throw new Error('build failed');
  return r.value;
}

describe('ListProjects', () => {
  it('returns all projects', async () => {
    const repo = new InMemoryProjectRepository([buildProject('a'), buildProject('b', true)]);
    const useCase = createListProjects({ projectRepository: repo });
    const r = await useCase({});
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.length).toBe(2);
  });

  it('returns only featured when featured: true', async () => {
    const repo = new InMemoryProjectRepository([buildProject('a'), buildProject('b', true)]);
    const useCase = createListProjects({ projectRepository: repo });
    const r = await useCase({ featured: true });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.value.length).toBe(1);
      expect(r.value[0]?.slug.toString()).toBe('b');
    }
  });
});

import { describe, it, expect } from 'vitest';
import { createGetProjectBySlug } from '$application/use-cases/GetProjectBySlug';
import { InMemoryProjectRepository } from '../../fakes/InMemoryProjectRepository';
import { ProjectNotFoundError } from '$domain/errors/ProjectNotFoundError';
import { InvalidProjectSlugError } from '$domain/errors/InvalidProjectSlugError';

describe('GetProjectBySlug', () => {
  it('returns InvalidProjectSlugError for malformed slug', async () => {
    const repo = new InMemoryProjectRepository([]);
    const useCase = createGetProjectBySlug({ projectRepository: repo });
    const r = await useCase({ slug: 'BadSlug!' });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toBeInstanceOf(InvalidProjectSlugError);
  });

  it('returns ProjectNotFoundError when slug valid but missing', async () => {
    const repo = new InMemoryProjectRepository([]);
    const useCase = createGetProjectBySlug({ projectRepository: repo });
    const r = await useCase({ slug: 'missing' });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toBeInstanceOf(ProjectNotFoundError);
  });
});

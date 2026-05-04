import { describe, it, expect } from 'vitest';
import { createListExperiences } from '$application/use-cases/ListExperiences';
import { InMemoryExperienceRepository } from '../../fakes/InMemoryExperienceRepository';

describe('ListExperiences', () => {
  it('returns empty list when none', async () => {
    const repo = new InMemoryExperienceRepository();
    const useCase = createListExperiences({ experienceRepository: repo });
    const r = await useCase();
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value).toEqual([]);
  });
});

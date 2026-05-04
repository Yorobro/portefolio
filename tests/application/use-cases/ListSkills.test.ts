import { describe, it, expect } from 'vitest';
import { createListSkills } from '$application/use-cases/ListSkills';
import { InMemorySkillRepository } from '../../fakes/InMemorySkillRepository';

describe('ListSkills', () => {
  it('returns empty list when none', async () => {
    const useCase = createListSkills({ skillRepository: new InMemorySkillRepository() });
    const r = await useCase();
    expect(r.ok).toBe(true);
  });
});

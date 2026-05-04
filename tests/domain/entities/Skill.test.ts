import { describe, it, expect } from 'vitest';
import { Skill } from '$domain/entities/Skill';

describe('Skill', () => {
  it('creates a valid skill', () => {
    const r = Skill.create({ name: 'Spring Boot', category: 'framework', level: 'advanced' });
    expect(r.ok).toBe(true);
  });

  it('rejects empty name', () => {
    const r = Skill.create({ name: ' ', category: 'framework', level: 'advanced' });
    expect(r.ok).toBe(false);
  });
});

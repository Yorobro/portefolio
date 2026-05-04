import { describe, it, expect } from 'vitest';
import { TechStack } from '$domain/value-objects/TechStack';

describe('TechStack', () => {
  it('creates from a non-empty list', () => {
    const r = TechStack.create(['Spring Boot', 'Angular']);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.toArray()).toEqual(['Spring Boot', 'Angular']);
  });

  it('deduplicates entries while preserving order', () => {
    const r = TechStack.create(['A', 'B', 'A']);
    if (r.ok) expect(r.value.toArray()).toEqual(['A', 'B']);
  });

  it('trims and rejects empty entries', () => {
    const r = TechStack.create(['  Java  ', '']);
    expect(r.ok).toBe(false);
  });

  it('rejects empty stack', () => {
    const r = TechStack.create([]);
    expect(r.ok).toBe(false);
  });
});

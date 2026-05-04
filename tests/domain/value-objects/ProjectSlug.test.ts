import { describe, it, expect } from 'vitest';
import { ProjectSlug } from '$domain/value-objects/ProjectSlug';
import { InvalidProjectSlugError } from '$domain/errors/InvalidProjectSlugError';

describe('ProjectSlug', () => {
  it.each(['deardiary', 'projet-24h', 'aprr-clean-archi'])('accepts valid slug %s', (s) => {
    const r = ProjectSlug.create(s);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.toString()).toBe(s);
  });

  it.each(['', 'CapitalLetters', 'with space', 'with_underscore', 'trailing-', '-leading'])(
    'rejects invalid slug "%s"',
    (s) => {
      const r = ProjectSlug.create(s);
      expect(r.ok).toBe(false);
      if (!r.ok) expect(r.error).toBeInstanceOf(InvalidProjectSlugError);
    },
  );

  it('compares by value', () => {
    const a = ProjectSlug.create('foo');
    const b = ProjectSlug.create('foo');
    if (a.ok && b.ok) expect(a.value.equals(b.value)).toBe(true);
  });
});

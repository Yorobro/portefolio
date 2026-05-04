import { describe, it, expect } from 'vitest';
import { Email } from '$domain/value-objects/Email';
import { InvalidEmailError } from '$domain/errors/InvalidEmailError';

describe('Email', () => {
  it('accepts a valid email', () => {
    const r = Email.create('yohan.finelle@gmail.com');
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.toString()).toBe('yohan.finelle@gmail.com');
  });

  it('lowercases the email', () => {
    const r = Email.create('Yohan.FINELLE@Gmail.COM');
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.toString()).toBe('yohan.finelle@gmail.com');
  });

  it('trims whitespace', () => {
    const r = Email.create('  hi@example.com  ');
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.toString()).toBe('hi@example.com');
  });

  it.each(['', 'not-an-email', '@nodomain', 'no@dot', 'spaces in@email.com'])(
    'rejects invalid email %s',
    (input) => {
      const r = Email.create(input);
      expect(r.ok).toBe(false);
      if (!r.ok) {
        expect(r.error).toBeInstanceOf(InvalidEmailError);
        expect(r.error.code).toBe('INVALID_EMAIL');
      }
    },
  );

  it('two equal emails are .equals()', () => {
    const a = Email.create('a@b.com');
    const b = Email.create('A@B.com');
    if (a.ok && b.ok) {
      expect(a.value.equals(b.value)).toBe(true);
    }
  });
});

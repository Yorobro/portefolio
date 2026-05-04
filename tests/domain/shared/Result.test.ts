import { describe, it, expect } from 'vitest';
import { Result } from '$domain/shared/Result';

describe('Result', () => {
  it('ok() creates a successful result', () => {
    const r = Result.ok(42);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value).toBe(42);
  });

  it('err() creates a failed result', () => {
    const r = Result.err(new Error('boom'));
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.message).toBe('boom');
  });

  it('map() transforms the value of an Ok', () => {
    const r = Result.ok(2).map((n) => n * 2);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value).toBe(4);
  });

  it('map() leaves an Err untouched', () => {
    const original = Result.err<number, string>('nope');
    const r = original.map((n) => n * 2);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toBe('nope');
  });

  it('flatMap() chains Ok results', () => {
    const r = Result.ok(2).flatMap((n) => Result.ok(n + 1));
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value).toBe(3);
  });

  it('flatMap() short-circuits on Err', () => {
    const r = Result.err<number, string>('first').flatMap((n) => Result.ok(n + 1));
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toBe('first');
  });
});

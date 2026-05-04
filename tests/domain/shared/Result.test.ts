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

describe('Result — algebraic laws', () => {
  // Helpers
  const id = <X>(x: X): X => x;
  const f = (n: number): number => n + 1;
  const g = (n: number): number => n * 2;
  const fM = (n: number): Result<number, string> => Result.ok(n + 1);
  const gM = (n: number): Result<number, string> => Result.ok(n * 2);

  it('functor identity: r.map(id) preserves Ok', () => {
    const r = Result.ok<number, string>(7).map(id);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value).toBe(7);
  });

  it('functor identity: r.map(id) preserves Err', () => {
    const r = Result.err<number, string>('nope').map(id);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toBe('nope');
  });

  it('functor composition: r.map(f).map(g) ≡ r.map(x => g(f(x)))', () => {
    const a = Result.ok<number, string>(5).map(f).map(g);
    const b = Result.ok<number, string>(5).map((x) => g(f(x)));
    expect(a.ok && b.ok).toBe(true);
    if (a.ok && b.ok) expect(a.value).toBe(b.value);
  });

  it('monad left identity: Result.ok(x).flatMap(fM) ≡ fM(x)', () => {
    const a = Result.ok<number, string>(3).flatMap(fM);
    const b = fM(3);
    expect(a.ok && b.ok).toBe(true);
    if (a.ok && b.ok) expect(a.value).toBe(b.value);
  });

  it('monad right identity: r.flatMap(Result.ok) preserves Ok', () => {
    const a = Result.ok<number, string>(9).flatMap((x) => Result.ok<number, string>(x));
    expect(a.ok).toBe(true);
    if (a.ok) expect(a.value).toBe(9);
  });

  it('monad right identity: r.flatMap(Result.ok) preserves Err', () => {
    const original = Result.err<number, string>('boom');
    const a = original.flatMap((x) => Result.ok<number, string>(x));
    expect(a.ok).toBe(false);
    if (!a.ok) expect(a.error).toBe('boom');
  });

  it('monad associativity: r.flatMap(fM).flatMap(gM) ≡ r.flatMap(x => fM(x).flatMap(gM))', () => {
    const a = Result.ok<number, string>(2).flatMap(fM).flatMap(gM);
    const b = Result.ok<number, string>(2).flatMap((x) => fM(x).flatMap(gM));
    expect(a.ok && b.ok).toBe(true);
    if (a.ok && b.ok) expect(a.value).toBe(b.value);
  });
});

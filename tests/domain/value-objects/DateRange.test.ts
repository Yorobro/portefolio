import { describe, it, expect } from 'vitest';
import { DateRange } from '$domain/value-objects/DateRange';
import { InvalidDateRangeError } from '$domain/errors/InvalidDateRangeError';

describe('DateRange', () => {
  it('accepts start before end', () => {
    const r = DateRange.create(new Date('2024-01-01'), new Date('2024-12-31'));
    expect(r.ok).toBe(true);
  });

  it('accepts start with no end (ongoing)', () => {
    const r = DateRange.create(new Date('2024-01-01'), undefined);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.isOngoing()).toBe(true);
  });

  it('rejects end before start', () => {
    const r = DateRange.create(new Date('2024-12-31'), new Date('2024-01-01'));
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toBeInstanceOf(InvalidDateRangeError);
  });
});

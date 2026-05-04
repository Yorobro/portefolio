import { describe, it, expect } from 'vitest';
import { Experience } from '$domain/entities/Experience';
import { DateRange } from '$domain/value-objects/DateRange';

const range = DateRange.create(new Date('2025-09-01'), new Date('2026-08-31'));
const baseProps = () => {
  if (!range.ok) throw new Error('setup');
  return {
    company: 'APRR',
    location: 'Saint-Apollinaire',
    role: 'Alternant développeur',
    type: 'alternance' as const,
    dateRange: range.value,
    summary: 'Migration PHP 7→8',
    highlights: ['OIDC', 'Clean Archi'],
  };
};

describe('Experience', () => {
  it('creates a valid experience', () => {
    const r = Experience.create(baseProps());
    expect(r.ok).toBe(true);
  });

  it('rejects empty company', () => {
    const r = Experience.create({ ...baseProps(), company: '' });
    expect(r.ok).toBe(false);
  });

  it('rejects empty role', () => {
    const r = Experience.create({ ...baseProps(), role: '' });
    expect(r.ok).toBe(false);
  });
});

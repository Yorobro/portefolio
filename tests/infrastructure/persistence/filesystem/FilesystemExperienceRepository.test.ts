import { describe, it, expect } from 'vitest';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createFilesystemExperienceRepository } from '$infrastructure/persistence/filesystem/FilesystemExperienceRepository';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fixtures = path.resolve(__dirname, '../../../fixtures/experiences');

describe('FilesystemExperienceRepository', () => {
  it('findAll returns all parsed experiences', async () => {
    const repo = createFilesystemExperienceRepository({ contentDir: fixtures });
    const r = await repo.findAll();
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.length).toBeGreaterThanOrEqual(1);
  });

  it('parses experience fields correctly', async () => {
    const repo = createFilesystemExperienceRepository({ contentDir: fixtures });
    const r = await repo.findAll();
    if (r.ok) {
      const aprr = r.value.find((e) => e.company === 'APRR');
      expect(aprr).toBeDefined();
      expect(aprr?.role).toBe('Alternant développeur');
      expect(aprr?.type).toBe('alternance');
      expect(aprr?.highlights.length).toBe(3);
    }
  });
});

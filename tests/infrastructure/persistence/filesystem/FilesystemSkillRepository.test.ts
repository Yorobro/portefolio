import { describe, it, expect } from 'vitest';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createFilesystemSkillRepository } from '$infrastructure/persistence/filesystem/FilesystemSkillRepository';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fixtures = path.resolve(__dirname, '../../../fixtures/skills');

describe('FilesystemSkillRepository', () => {
  it('findAll returns all parsed skills', async () => {
    const repo = createFilesystemSkillRepository({ contentDir: fixtures });
    const r = await repo.findAll();
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.length).toBeGreaterThanOrEqual(4);
  });

  it('parses skill fields correctly', async () => {
    const repo = createFilesystemSkillRepository({ contentDir: fixtures });
    const r = await repo.findAll();
    if (r.ok) {
      const spring = r.value.find((s) => s.name === 'Spring Boot');
      expect(spring).toBeDefined();
      expect(spring?.category).toBe('framework');
      expect(spring?.level).toBe('advanced');
    }
  });
});

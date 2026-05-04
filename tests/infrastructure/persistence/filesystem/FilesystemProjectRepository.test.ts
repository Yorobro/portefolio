import { describe, it, expect } from 'vitest';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createFilesystemProjectRepository } from '$infrastructure/persistence/filesystem/FilesystemProjectRepository';
import { ProjectSlug } from '$domain/value-objects/ProjectSlug';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fixtures = path.resolve(__dirname, '../../../fixtures/projects');

describe('FilesystemProjectRepository', () => {
  it('findAll returns all parsed projects', async () => {
    const repo = createFilesystemProjectRepository({ contentDir: fixtures });
    const r = await repo.findAll();
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.length).toBeGreaterThanOrEqual(2);
  });

  it('findFeatured returns only featured', async () => {
    const repo = createFilesystemProjectRepository({ contentDir: fixtures });
    const r = await repo.findFeatured();
    if (r.ok) {
      for (const p of r.value) expect(p.featured).toBe(true);
    }
  });

  it('findBySlug returns project', async () => {
    const repo = createFilesystemProjectRepository({ contentDir: fixtures });
    const slug = ProjectSlug.create('sample-a');
    if (!slug.ok) throw new Error('setup');
    const r = await repo.findBySlug(slug.value);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.title).toBe('Sample A');
  });

  it('findBySlug returns ProjectNotFoundError when missing', async () => {
    const repo = createFilesystemProjectRepository({ contentDir: fixtures });
    const slug = ProjectSlug.create('does-not-exist');
    if (!slug.ok) throw new Error('setup');
    const r = await repo.findBySlug(slug.value);
    expect(r.ok).toBe(false);
  });
});

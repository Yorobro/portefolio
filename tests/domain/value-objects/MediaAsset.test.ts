import { describe, it, expect } from 'vitest';
import { MediaAsset } from '$domain/value-objects/MediaAsset';

describe('MediaAsset', () => {
  it('creates an image asset', () => {
    const r = MediaAsset.create({ type: 'image', src: '/img/a.png', alt: 'A' });
    expect(r.ok).toBe(true);
  });

  it('rejects empty src', () => {
    const r = MediaAsset.create({ type: 'image', src: '', alt: 'A' });
    expect(r.ok).toBe(false);
  });

  it('rejects empty alt for images', () => {
    const r = MediaAsset.create({ type: 'image', src: '/img/a.png', alt: '' });
    expect(r.ok).toBe(false);
  });
});

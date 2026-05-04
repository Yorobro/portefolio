import { describe, it, expect } from 'vitest';
import { parseMarkdown } from '$infrastructure/persistence/filesystem/MarkdownParser';

describe('parseMarkdown', () => {
  it('extracts frontmatter and content', async () => {
    const raw = `---
title: Hello
n: 42
---

# Body
Content here.`;
    const parsed = await parseMarkdown(raw);
    expect(parsed.frontmatter).toEqual({ title: 'Hello', n: 42 });
    expect(parsed.html).toContain('<h1>Body</h1>');
  });

  it('handles empty frontmatter', async () => {
    const parsed = await parseMarkdown('# H\nbody');
    expect(parsed.frontmatter).toEqual({});
    expect(parsed.html).toContain('<h1>H</h1>');
  });
});

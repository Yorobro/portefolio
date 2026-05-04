import { describe, it, expect } from 'vitest';
import { ProjectViewModelMapper } from '$presentation/mappers/ProjectViewModelMapper';
import { Project } from '$domain/entities/Project';
import { ProjectSlug } from '$domain/value-objects/ProjectSlug';
import { TechStack } from '$domain/value-objects/TechStack';
import { DateRange } from '$domain/value-objects/DateRange';

function build() {
  const slug = ProjectSlug.create('foo');
  const stack = TechStack.create(['Svelte']);
  const range = DateRange.create(new Date('2024-01-01'), new Date('2024-12-31'));
  if (!slug.ok || !stack.ok || !range.ok) throw new Error('setup');
  const r = Project.create({
    slug: slug.value,
    title: 'Foo',
    summary: 's',
    description: '<p>desc</p>',
    stack: stack.value,
    status: 'finished',
    type: 'personal',
    featured: true,
    dateRange: range.value,
    repoUrl: 'https://x',
    liveUrl: undefined,
    media: [],
    architecture: undefined,
    highlights: ['h1'],
  });
  if (!r.ok) throw new Error('setup');
  return r.value;
}

describe('ProjectViewModelMapper', () => {
  it('toListItem produces serializable VM', () => {
    const vm = ProjectViewModelMapper.toListItem(build());
    expect(JSON.stringify(vm)).toContain('"slug":"foo"');
    expect(vm.thumbnailSrc).toBeNull();
  });

  it('toDetail includes descriptionHtml', () => {
    const vm = ProjectViewModelMapper.toDetail(build());
    expect(vm.descriptionHtml).toContain('desc');
  });
});

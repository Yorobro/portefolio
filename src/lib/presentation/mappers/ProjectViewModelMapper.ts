import type { Project } from '$domain/entities/Project';
import type { ProjectListItemViewModel } from '$presentation/view-models/ProjectListItemViewModel';
import type {
  ProjectDetailViewModel,
  ProjectMediaViewModel,
} from '$presentation/view-models/ProjectDetailViewModel';

function toListItem(p: Project): ProjectListItemViewModel {
  const firstImage = p.media.find((m) => m.props.type === 'image' || m.props.type === 'gif');
  return {
    slug: p.slug.toString(),
    title: p.title,
    summary: p.summary,
    stack: p.stack.toArray(),
    status: p.status,
    type: p.type,
    featured: p.featured,
    dateStartIso: p.dateRange.start.toISOString(),
    dateEndIso: p.dateRange.end ? p.dateRange.end.toISOString() : null,
    thumbnailSrc: firstImage ? firstImage.props.src : null,
    thumbnailAlt: firstImage ? firstImage.props.alt : null,
  };
}

function toDetail(p: Project): ProjectDetailViewModel {
  return {
    ...toListItem(p),
    descriptionHtml: p.description,
    architectureHtml: p.architecture ?? null,
    highlights: p.highlights,
    repoUrl: p.repoUrl ?? null,
    liveUrl: p.liveUrl ?? null,
    media: p.media.map<ProjectMediaViewModel>((m) => ({
      type: m.props.type,
      src: m.props.src,
      alt: m.props.alt,
      caption: m.props.caption ?? null,
    })),
  };
}

export const ProjectViewModelMapper = {
  toListItem,
  toDetail,
};

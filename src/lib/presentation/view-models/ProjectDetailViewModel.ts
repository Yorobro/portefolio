import type { ProjectListItemViewModel } from './ProjectListItemViewModel';

export interface ProjectMediaViewModel {
  type: 'image' | 'gif' | 'video';
  src: string;
  alt: string;
  caption: string | null;
}

export interface ProjectDetailViewModel extends ProjectListItemViewModel {
  descriptionHtml: string;
  architectureHtml: string | null;
  highlights: readonly string[];
  repoUrl: string | null;
  liveUrl: string | null;
  media: readonly ProjectMediaViewModel[];
}

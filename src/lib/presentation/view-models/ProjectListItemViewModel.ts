export interface ProjectListItemViewModel {
  slug: string;
  title: string;
  summary: string;
  stack: readonly string[];
  status: 'finished' | 'in-progress' | 'archived';
  type: 'personal' | 'professional' | 'academic' | 'competitive';
  featured: boolean;
  dateStartIso: string;
  dateEndIso: string | null;
  thumbnailSrc: string | null;
  thumbnailAlt: string | null;
}

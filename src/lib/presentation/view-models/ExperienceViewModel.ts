export interface ExperienceViewModel {
  company: string;
  location: string;
  role: string;
  type: 'alternance' | 'stage' | 'cdi' | 'cdd' | 'freelance';
  dateStartIso: string;
  dateEndIso: string | null;
  summary: string;
  highlights: readonly string[];
}

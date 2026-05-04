import type { Experience } from '$domain/entities/Experience';
import type { ExperienceViewModel } from '$presentation/view-models/ExperienceViewModel';

function toViewModel(e: Experience): ExperienceViewModel {
  return {
    company: e.company,
    location: e.location,
    role: e.role,
    type: e.type,
    dateStartIso: e.dateRange.start.toISOString(),
    dateEndIso: e.dateRange.end ? e.dateRange.end.toISOString() : null,
    summary: e.summary,
    highlights: e.highlights,
  };
}

export const ExperienceViewModelMapper = { toViewModel };

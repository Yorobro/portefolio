/** Allowed project statuses surfaced in the UI. */
export const PROJECT_STATUSES = ['finished', 'in-progress', 'archived'] as const;
export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export function isProjectStatus(value: string): value is ProjectStatus {
  return (PROJECT_STATUSES as readonly string[]).includes(value);
}

import type { Clock } from '$application/ports/Clock';

export function createSystemClock(): Clock {
  return { now: () => new Date() };
}

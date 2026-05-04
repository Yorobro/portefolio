import type { Clock } from '$application/ports/Clock';

export class FixedClock implements Clock {
  constructor(private current: Date) {}

  now(): Date {
    return new Date(this.current);
  }

  set(d: Date): void {
    this.current = d;
  }
}

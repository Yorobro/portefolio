import { Result } from '$domain/shared/Result';
import { InvalidDateRangeError } from '$domain/errors/InvalidDateRangeError';

export class DateRange {
  private constructor(
    public readonly start: Date,
    public readonly end: Date | undefined,
  ) {}

  static create(start: Date, end: Date | undefined): Result<DateRange, InvalidDateRangeError> {
    if (end !== undefined && end.getTime() < start.getTime()) {
      return Result.err(new InvalidDateRangeError('End date must be after start date'));
    }
    return Result.ok(new DateRange(start, end));
  }

  isOngoing(): boolean {
    return this.end === undefined;
  }
}

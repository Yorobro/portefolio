/**
 * Algebraic data type representing either a success (Ok) or a failure (Err).
 * Inspired by Rust's `Result` and fp-ts's `Either`.
 */
export type Result<T, E> = Ok<T, E> | Err<T, E>;

interface ResultBase<T, E> {
  readonly ok: boolean;
  map<U>(fn: (value: T) => U): Result<U, E>;
  flatMap<U>(fn: (value: T) => Result<U, E>): Result<U, E>;
}

export interface Ok<T, E> extends ResultBase<T, E> {
  readonly ok: true;
  readonly value: T;
}

export interface Err<T, E> extends ResultBase<T, E> {
  readonly ok: false;
  readonly error: E;
}

function makeOk<T, E>(value: T): Ok<T, E> {
  return {
    ok: true,
    value,
    map<U>(fn: (v: T) => U): Result<U, E> {
      return makeOk<U, E>(fn(value));
    },
    flatMap<U>(fn: (v: T) => Result<U, E>): Result<U, E> {
      return fn(value);
    },
  };
}

function makeErr<T, E>(error: E): Err<T, E> {
  const self: Err<T, E> = {
    ok: false,
    error,
    map<U>(_fn: (v: T) => U): Result<U, E> {
      return self as unknown as Result<U, E>;
    },
    flatMap<U>(_fn: (v: T) => Result<U, E>): Result<U, E> {
      return self as unknown as Result<U, E>;
    },
  };
  return self;
}

// eslint-disable-next-line @typescript-eslint/no-redeclare -- Companion-object pattern: `Result` is both a type and a value namespace, which is idiomatic TS and lives in separate namespaces.
export const Result = {
  ok: makeOk,
  err: makeErr,
} as const;

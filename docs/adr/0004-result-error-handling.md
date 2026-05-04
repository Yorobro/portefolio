# ADR 0004 — Result<T, E> over exceptions

**Status:** Accepted
**Date:** 2026-05-04

## Context

The domain and application layers need a consistent way to handle failure cases: invalid email
on the contact form, project not found by slug, contact rate-limited, email delivery failed,
malformed markdown frontmatter. Three idiomatic options in TypeScript:

- (a) Throw exceptions and let `try/catch` propagate them.
- (b) Return a `Result<T, E>` discriminated union (railway-oriented programming).
- (c) Return `T | null` / `T | undefined` with no error context.

The domain must remain pure (no framework imports), and recruiters reviewing the code should see
explicit, type-checked error handling.

## Decision

`Result<T, E>` lives in `src/lib/domain/shared/Result.ts`, with `map` / `flatMap` for chaining.
Every domain factory and every use case returns `Result<Success, DomainError>`. Infrastructure
adapters catch external exceptions (DB driver, email API, filesystem) and convert them into
`Result.err` at the boundary. The `DomainError` union is per-use-case, so TypeScript narrows
exhaustively at the call site.

## Consequences

- Pro: errors are values, type-checked end-to-end. TypeScript infers the error union per use
  case, so a forgotten branch is a compile error.
- Pro: forces explicit handling — no silently swallowed exceptions, no surprise 500s in
  production.
- Pro: composable through `map` / `flatMap`. Demonstrated by 7 algebraic-law tests in
  `Result.test.ts` (identity, associativity, etc.).
- Pro: pairs naturally with the Clean Architecture boundary — infrastructure does the
  exception/Result translation, the rest of the codebase stays pure.
- Con: more verbose than `try/catch`. Each chained call needs `if (!r.ok) return Result.err(...)`
  or a `flatMap`.
- Con: requires discipline at the framework boundary. SvelteKit form actions still throw on
  unexpected errors; we convert `Result.err` into `fail()` returns explicitly.
- Rejected: exceptions (option a) — silently propagate, easy to forget catching, defeat the
  type system.
- Rejected: null returns (option c) — collapse error info; the caller can't tell whether the
  project was missing, the file was malformed, or the disk was unavailable.

See `docs/superpowers/specs/2026-05-04-portfolio-design.md` for use-case error tables.

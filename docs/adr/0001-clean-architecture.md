# ADR 0001 — Clean Architecture

**Status:** Accepted
**Date:** 2026-05-04

## Context

This portfolio belongs to Yohan Finelle, a student in BUT Informatique who wants to demonstrate
**architectural rigor** to recruiters and engineering schools (cycle ingénieur). Strictly speaking,
a 5-page CV site is small enough that "Clean Architecture" could be over-engineering — but here the
portfolio is itself the demonstration. The user explicitly asked for "academic Clean Architecture,
parfaite". The structure must be readable at first glance by someone reviewing the repository
during admissions or hiring.

## Decision

Apply a 4-layer Clean Architecture inside `src/lib/`:

- `domain/` — pure entities, value-objects, errors, and the `Result` type. No framework imports.
- `application/` — use cases and ports (interfaces) that the domain layer needs.
- `infrastructure/` — concrete adapters: filesystem markdown, SQLite via Drizzle, Resend email,
  system clock.
- `presentation/` — view-models and mappers that transform domain entities into JSON-serializable
  payloads for SvelteKit loaders.

`src/routes/` is treated as an **extension** of the presentation layer (file-based routing forced
by SvelteKit, see ADR 0005). Dependencies point inward only. Use cases never import infrastructure
or routes. The composition root (`src/lib/composition-root.ts`) wires the concrete implementations.

## Consequences

- Pro: clear boundaries, testable use cases (in-memory fakes), recruiters see academic rigor at
  first glance.
- Pro: swapping infrastructure (e.g., SQLite → PostgreSQL, Resend → SMTP) only touches one layer.
- Con: more files than a "naive" SvelteKit app. View-models + mappers add a layer of indirection
  that a 2-page CV would skip.
- Rejected: a flat structure (everything in `src/lib/`) — would make the domain logic invisible
  and defeat the stated purpose.
- Rejected: a 3-layer split (no presentation) — view-models are necessary because SvelteKit
  serializes loaders' return value to JSON; classes (`Project`, `DateRange`) don't survive the
  JSON round-trip.

See `docs/superpowers/specs/2026-05-04-portfolio-design.md` and
`docs/superpowers/plans/2026-05-04-portfolio-implementation.md` for more detail.

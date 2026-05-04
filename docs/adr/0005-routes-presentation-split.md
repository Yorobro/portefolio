# ADR 0005 — `routes/` and the presentation layer split

**Status:** Accepted
**Date:** 2026-05-04

## Context

SvelteKit forces a `src/routes/` directory for file-based routing — the framework reads the
filesystem to decide which URL maps to which page. Conceptually, that directory is part of the
**presentation layer**, but the rest of the presentation layer (view-models, domain-to-VM
mappers, page-level orchestration) lives in `src/lib/presentation/`. A strict reading of Clean
Architecture would forbid framework-specific code inside the presentation layer; in practice
SvelteKit gives no way out.

## Decision

Treat the presentation layer as **physically split** between two directories:

- `src/lib/presentation/` — reusable, framework-agnostic logic: view-models, mappers, page
  orchestrators. Importable, testable in isolation, no SvelteKit imports.
- `src/routes/` — SvelteKit-specific page controllers (`+page.server.ts`) and components
  (`+page.svelte`), forced by the file-based routing convention.

`+page.server.ts` files stay **thin**: resolve dependencies from the composition root, delegate
to use cases, map results to view-models, return the JSON-serializable payload. No business
logic in routes. The split is documented here and in section 3.2.5 of
`docs/superpowers/specs/2026-05-04-portfolio-design.md`.

## Consequences

- Pro: pragmatic — works with the framework rather than against it. Routes are small and
  predictable, so a new contributor can navigate the codebase without surprises.
- Pro: `lib/presentation/` is reusable if the project ever migrates to another framework
  (e.g., Astro), since none of the orchestration logic depends on SvelteKit primitives.
- Pro: testing focuses on `lib/presentation/`; `routes/` files are thin enough that integration
  tests cover them without unit tests.
- Con: a strict reading of Clean Architecture would require zero framework code in the
  presentation layer. We accept this compromise as an honest documentation of reality, not as
  hidden debt.
- Rejected: stub `routes/` files that re-export from `lib/presentation/pages/...` — adds two
  files per page with no real benefit, hurts readability, and merely hides the framework
  coupling instead of acknowledging it.

See ADR 0001 for the broader Clean Architecture context.

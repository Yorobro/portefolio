# ADR 0002 — SvelteKit fullstack with adapter-node

**Status:** Accepted
**Date:** 2026-05-04

## Context

Yohan's professional stack is Java/Spring + Angular. For the portfolio he wanted to use Svelte
and Node.js to demonstrate breadth beyond his day-to-day tools. Three options were on the table:

- (a) An SSG static markdown site (e.g., Astro/Eleventy build to static HTML).
- (b) A monorepo with SvelteKit on the frontend and a separate Node API on the backend.
- (c) SvelteKit fullstack via `adapter-node`.

Constraints: must include a working contact form (real server-side logic, not a Formspree-style
proxy), must demonstrate TypeScript end-to-end, must keep the deployment simple for a single
developer.

## Decision

SvelteKit with `adapter-node`. Pages are server-rendered (SSR): `+page.server.ts` runs on Node,
`+page.svelte` runs both server-side (initial HTML) and client-side (hydration). Form actions
handle the contact form server-side, returning `Result`-mapped payloads via `fail()`.

## Consequences

- Pro: single repository, single deploy artifact, SSR for SEO and perceived performance.
- Pro: lets the user keep one mental model — no API/client boundary to design for a small site.
- Pro: the contact form becomes a real demonstration of server-side TypeScript, with
  railway-oriented `Result` handling (see ADR 0004) instead of an external SaaS proxy.
- Pro: progressive enhancement — the form works without JavaScript thanks to SvelteKit form
  actions.
- Con: requires a Node.js runtime in production (not pure static hosting). Not a real downside
  given the form requirement.
- Rejected: SSG (option a) — couldn't host a real form action; static-only is too limited to
  show "I know Node.js too".
- Rejected: monorepo separate API (option b) — overkill for a 5-page site, adds CI/deploy
  complexity, hides the fullstack story behind two deploys.

See `docs/superpowers/specs/2026-05-04-portfolio-design.md` for the runtime-architecture section.

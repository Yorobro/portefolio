# ADR 0003 — Markdown content over CMS or DB

**Status:** Accepted
**Date:** 2026-05-04

## Context

The portfolio needs to store project descriptions, work experiences, and a skills catalog. The
content changes occasionally (a new project, a new internship) but is not high-frequency. Three
options:

- (a) Markdown files in `content/` with YAML frontmatter, parsed at build/request time.
- (b) A headless CMS (Contentful, Sanity, Strapi).
- (c) Database rows in SQLite or PostgreSQL with an admin UI.

The portfolio is also the developer's working repository — the content workflow should not
distract from the demonstration of code quality.

## Decision

Markdown files with YAML frontmatter, validated by Zod schemas, parsed by `gray-matter` and
`remark`. Files live in `content/projects/`, `content/experiences/`, `content/skills/`. Yohan
edits them directly with any text editor. Frontmatter is parsed into domain entities through a
filesystem adapter implementing the repository ports defined in `application/`.

## Consequences

- Pro: the entire portfolio — including its content — lives in git history. No external state,
  no CMS subscription, no admin UI to build and maintain.
- Pro: editing content is just opening a `.md` file. Pull requests can review content changes.
- Pro: Zod frontmatter schemas catch malformed content at build time, before it ever reaches a
  page.
- Pro: the markdown adapter is a clean Clean-Architecture demo — domain code is unaware of where
  the bytes come from.
- Con: every content change requires a rebuild and redeploy. Acceptable for a portfolio updated
  roughly once a month.
- Con: no preview UI for non-technical editors. Not relevant — the only editor is Yohan.
- Rejected: CMS (option b) — adds infra cost, vendor lock-in, and replaces a code-skill
  demonstration with a configuration UI.
- Rejected: DB (option c) — would require an admin UI (or raw SQL editing), overkill for static
  content that changes monthly. SQLite is still used elsewhere for the contact-message log.

See `docs/superpowers/specs/2026-05-04-portfolio-design.md` for the content schemas.

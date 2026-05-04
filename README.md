# Portfolio — Yohan Finelle

Portfolio personnel de **Yohan Finelle**, étudiant en BUT Informatique (Université de Bourgogne) en recherche d'alternance pour intégrer un cycle ingénieur 2026-2029.

> Ce repo est en cours de construction. Voir `docs/superpowers/specs/2026-05-04-portfolio-design.md` pour le design détaillé et `docs/superpowers/plans/` pour le plan d'implémentation.

## Stack

- **Framework** : [SvelteKit](https://kit.svelte.dev) avec `adapter-node`
- **Langage** : TypeScript strict
- **Persistance** : Markdown (contenu) + SQLite via Drizzle (form contact)
- **Architecture** : Clean Architecture académique (domain / application / infrastructure / presentation)

## Développement

```bash
pnpm install
pnpm dev          # serveur de dev sur http://localhost:5173
pnpm check        # type-check
pnpm test         # tests unitaires (Vitest)
pnpm lint         # ESLint + Prettier
pnpm build        # build de production
pnpm preview      # prévisualiser le build
```

## Documentation

- Spec design : [`docs/superpowers/specs/2026-05-04-portfolio-design.md`](docs/superpowers/specs/2026-05-04-portfolio-design.md)
- Plan d'implémentation : [`docs/superpowers/plans/`](docs/superpowers/plans/)
- ADR (à venir) : `docs/adr/`

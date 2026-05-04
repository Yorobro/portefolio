# Portfolio — Yohan Finelle

Portfolio personnel de **Yohan Finelle**, étudiant en BUT Informatique à l'Université de Bourgogne (2023–2026). En recherche d'une alternance pour intégrer un cycle ingénieur 2026–2029.

> Le site est en cours de développement. Voir [le design spec](docs/superpowers/specs/2026-05-04-portfolio-design.md) pour la vision détaillée et [les ADR](docs/adr/) pour les choix d'architecture.

## Stack technique

- **Framework** : [SvelteKit](https://kit.svelte.dev) avec `adapter-node`
- **Langage** : TypeScript strict (`strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `verbatimModuleSyntax`)
- **Persistance contenu** : Markdown + YAML frontmatter (validation via [Zod](https://zod.dev))
- **Persistance dynamique** : SQLite via [Drizzle ORM](https://orm.drizzle.team) (formulaire de contact uniquement)
- **Email transactionnel** : [Resend](https://resend.com)
- **Tests** : [Vitest](https://vitest.dev) (tests unitaires sur le domaine + l'application)
- **Lint/Format** : ESLint flat config + Prettier
- **Conventions de commit** : [Conventional Commits](https://www.conventionalcommits.org) (validés par commitlint)
- **Hooks Git** : Husky + lint-staged
- **Déploiement** : Docker + adapter-node sur VPS (à venir, Phase 10)

## Architecture

Le projet applique une **Clean Architecture académique** à 4 couches dans `src/lib/` :

```
domain/         <- entités, value-objects, erreurs (cœur métier pur)
application/    <- use cases + ports (interfaces)
infrastructure/ <- adapters concrets (filesystem markdown, SQLite, Resend, Clock)
presentation/   <- view-models + mappers (sérialisable JSON)
routes/         <- pages SvelteKit (extension physique de presentation, voir ADR 0005)
```

Les dépendances pointent toujours **vers l'intérieur**. Le `composition-root.ts` est le seul endroit où les implémentations concrètes sont assemblées.

Détails dans [`docs/superpowers/specs/2026-05-04-portfolio-design.md`](docs/superpowers/specs/2026-05-04-portfolio-design.md). Décisions clés dans [`docs/adr/`](docs/adr/).

## Développement local

Prérequis :

- Node.js >= 20.18 (voir `.nvmrc`)
- pnpm 9.12 (voir `package.json#packageManager`)

Setup :

```bash
pnpm install
cp .env.example .env   # remplir les valeurs (RESEND_API_KEY, etc.)
pnpm dev               # http://localhost:5173
```

## Scripts utiles

```bash
pnpm dev              # serveur de dev avec hot-reload
pnpm build            # build de production (output dans build/)
pnpm preview          # prévisualiser le build de production
pnpm test             # tests unitaires (Vitest)
pnpm test:watch       # tests en mode watch
pnpm test:coverage    # avec couverture
pnpm lint             # ESLint + Prettier --check
pnpm format           # Prettier --write
pnpm check            # type-check via svelte-check
pnpm db:generate      # générer une migration Drizzle après changement de schéma
```

## Tests

Les tests couvrent **les couches domain et application** (logique métier). Les adapters d'infrastructure ont des tests d'intégration ciblés (par exemple `SqliteContactMessageRepository` testé avec une DB en mémoire).

Couverture cible (configurée dans `vitest.config.ts`) :

- Lignes : 90 %
- Fonctions : 90 %
- Branches : 85 %

## Déploiement

Le déploiement se fera via Docker sur un VPS. Voir le `Dockerfile` et `docker-compose.yml` (à venir, Phase 10 du plan).

## Structure du dépôt

```
content/                # Contenu Markdown (projets, expériences, compétences)
docs/                   # Spec design + ADR + plan d'implémentation
src/lib/domain/         # Couche domaine (entités, value-objects, erreurs, Result)
src/lib/application/    # Couche application (use cases + ports)
src/lib/infrastructure/ # Adapters concrets (markdown, SQLite, Resend, Clock)
src/lib/presentation/   # View-models + mappers
src/lib/components/     # Composants Svelte UI réutilisables
src/lib/styles/         # Design tokens + reset + typographie
src/routes/             # Pages SvelteKit (file-based routing)
static/                 # Assets statiques (CV PDF, images)
tests/                  # Tests Vitest (domain, application, infrastructure)
```

## Licence

Code source : [MIT](LICENSE) (à venir).
Le contenu (textes, images, CV) reste propriété de Yohan Finelle.

---

Construit avec rigueur. Si vous êtes recruteur ou responsable d'admission, n'hésitez pas à me contacter via [le formulaire de contact](http://localhost:5173/contact) (URL temporaire — domaine final à venir).

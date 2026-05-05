# Portfolio — Yohan Finelle

Portfolio personnel de **Yohan Finelle**, étudiant en BUT Informatique à l'Université de Bourgogne (2023–2026). En recherche d'une alternance pour intégrer un cycle ingénieur 2026–2029.

> Voir les [ADR](docs/adr/) pour les choix d'architecture.

## Stack technique

- **Framework** : [SvelteKit](https://kit.svelte.dev) avec `adapter-static` (site entièrement prerendered)
- **Langage** : TypeScript strict (`strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `verbatimModuleSyntax`)
- **Contenu** : Markdown + frontmatter YAML (validation via [Zod](https://zod.dev))
- **Tests** : [Vitest](https://vitest.dev) (tests unitaires sur le domaine + l'application)
- **Lint/Format** : ESLint flat config + Prettier
- **Conventions de commit** : [Conventional Commits](https://www.conventionalcommits.org) (validés par commitlint)
- **Hooks Git** : Husky + lint-staged
- **Déploiement** : hébergement statique (Cloudflare Pages, GitHub Pages ou nginx sur VPS)

## Architecture

Le projet applique une **Clean Architecture académique** à 4 couches dans `src/lib/` :

```
domain/         <- entités, value-objects, erreurs (cœur métier pur)
application/    <- use cases + ports (interfaces)
infrastructure/ <- adapters concrets (filesystem markdown)
presentation/   <- view-models + mappers (sérialisable JSON)
routes/         <- pages SvelteKit (extension physique de presentation, voir ADR 0005)
```

Les dépendances pointent toujours **vers l'intérieur**. Le `composition-root.ts` est le seul endroit où les implémentations concrètes sont assemblées.

Décisions clés dans [`docs/adr/`](docs/adr/).

## Développement local

Prérequis :

- Node.js >= 20.18 (voir `.nvmrc`)
- pnpm 9.12 (voir `package.json#packageManager`)

Setup :

```bash
pnpm install
cp .env.example .env   # ajuster PUBLIC_SITE_URL si besoin
pnpm dev               # http://localhost:5173
```

## Scripts utiles

```bash
pnpm dev              # serveur de dev avec hot-reload
pnpm build            # build statique (output dans build/)
pnpm preview          # prévisualiser le build de production
pnpm test             # tests unitaires (Vitest)
pnpm test:watch       # tests en mode watch
pnpm test:coverage    # avec couverture
pnpm lint             # ESLint + Prettier --check
pnpm format           # Prettier --write
pnpm check            # type-check via svelte-check
```

## Tests

Les tests couvrent **les couches domain et application** (logique métier), ainsi que les adapters d'infrastructure markdown et les mappers de présentation.

Couverture cible (configurée dans `vitest.config.ts`) :

- Lignes : 90 %
- Fonctions : 90 %
- Branches : 85 %

## Déploiement

Le site est entièrement statique : `pnpm build` produit un dossier `build/` qu'on peut servir tel quel depuis n'importe quel hébergeur statique (Cloudflare Pages, GitHub Pages, Netlify) ou un simple `nginx`.

## Structure du dépôt

```
content/                # Contenu Markdown (projets, expériences, compétences)
docs/adr/               # Architecture Decision Records
src/lib/domain/         # Couche domaine (entités, value-objects, erreurs, Result)
src/lib/application/    # Couche application (use cases + ports)
src/lib/infrastructure/ # Adapters concrets (filesystem markdown)
src/lib/presentation/   # View-models + mappers
src/lib/components/     # Composants Svelte UI réutilisables
src/lib/styles/         # Design tokens + reset + typographie
src/routes/             # Pages SvelteKit (file-based routing)
static/                 # Assets statiques (CV PDF, images)
tests/                  # Tests Vitest (domain, application, infrastructure, presentation)
```

## Licence

Code source : [MIT](LICENSE) (à venir).
Le contenu (textes, images, CV) reste propriété de Yohan Finelle.

---

Construit avec rigueur. Si vous êtes recruteur ou responsable d'admission, n'hésitez pas à me contacter via les coordonnées affichées sur le site.

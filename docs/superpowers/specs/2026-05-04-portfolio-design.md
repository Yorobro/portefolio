# Portfolio Yohan Finelle — Design Document

**Auteur** : Yohan Finelle
**Date** : 2026-05-04
**Statut** : Brouillon en attente de validation

---

## 1. Contexte et objectif

### 1.1 Pourquoi ce projet

Yohan Finelle, étudiant en BUT Informatique (Université de Bourgogne, 2023-2026), termine son alternance chez APRR (Saint-Apollinaire) en 2026 et prépare son entrée en école d'ingénieur en cycle 2026-2029. Il a besoin d'un **portfolio en ligne** pour décrocher une nouvelle alternance — l'admission en école d'ingénieur en alternance dépendant à la fois de l'acceptation par l'école et de la signature d'un contrat avec une entreprise.

### 1.2 Public cible

Le portfolio s'adresse à trois publics :

1. **Recruteurs en entreprise** (RH, tech leads) qui évaluent la candidature pour l'alternance
2. **Écoles d'ingénieur** qui évaluent le dossier d'admission (cible principale)
3. **Écoles d'informatique non-ingé** comme le **DIIAGE à Dijon** (bachelor/expert post-BUT) — cible secondaire mais réelle

Ces trois publics ont des temps d'attention courts (15 à 45 secondes sur la home) et consultent souvent plusieurs portfolios en parallèle. Le contenu et le ton doivent rester suffisamment universels pour s'adresser aux trois sans cibler explicitement l'un d'entre eux.

### 1.3 Objectif principal

Le portfolio doit répondre, **dès la home page et sans scroll obligatoire**, aux trois questions critiques d'un recruteur :

1. *Qui est Yohan ?* (positionnement professionnel, statut)
2. *Que sait-il faire ?* (compétences clés + projets phares)
3. *Comment le contacter ?* (call-to-action explicite)

### 1.4 Objectif secondaire

Le portfolio est lui-même une **démonstration de compétences techniques**. Le code doit refléter la rigueur revendiquée par Yohan :

- Clean Architecture académique appliquée correctement (couches strictes, ports & adapters)
- Principes SOLID respectés
- Design patterns utilisés à bon escient (Repository, Mapper, Result, Factory)
- Clean Code (noms explicites, fonctions courtes, immutabilité par défaut)
- Documentation TSDoc sur les API publiques
- Tests unitaires sur le domaine et les use cases
- CI verte sur GitHub Actions
- Repo public, README clair, commits propres (Conventional Commits)

Un recruteur curieux qui ouvre le repo doit voir immédiatement ces qualités.

---

## 2. Stratégie produit

### 2.1 Approche éditoriale : A + D combiné

La home page combine deux objectifs :

- **A — Convaincre en 30 secondes** : nom, positionnement, statut "disponible 2026", call-to-action contact, bouton CV — tout visible sans scroll
- **D — Mettre les projets en vedette** : 3 projets phares en cards, accessibles directement depuis la home

La démonstration technique poussée (architecture hexagonale, schémas, snippets) se trouve **dans les pages de détail des projets**, pas dans la home — pour éviter l'effet "tape-à-l'œil sans fond".

### 2.2 Pages

| Route | Contenu |
|---|---|
| `/` | Home : pitch + 3 projets phares + compétences clés |
| `/projets` | Liste de tous les projets, filtrables par tag |
| `/projets/[slug]` | Détail d'un projet (description, stack, lien repo, médias, archi) |
| `/parcours` | Formations + expériences professionnelles, frise chronologique |
| `/contact` | Formulaire de contact + liens directs (mail, LinkedIn, GitHub) |
| `/cv.pdf` | Téléchargement direct du CV PDF |

Pas de page `/about` séparée — la home contient déjà le pitch personnel.

### 2.3 Contenu projets (à inclure)

Six projets seront présentés (3 phares en home + tous sur `/projets`) :

| Projet | Statut | Type | Stack | Phare |
|---|---|---|---|---|
| **DearDiary** | 🟢 Présentable | Personnel | Angular + Spring Boot, archi hexagonale, Docker | ✅ |
| **Vanice** (mod Minecraft) | 🟡 En cours | Personnel | Kotlin, mod endgame, repo privé | ✅ |
| **APRR** | 🟢 Pro | Alternance | PHP 8.4, Clean Architecture, OIDC, Azure DevOps, WPF | ✅ |
| **A.I.E** | 🟢 Universitaire | Équipe | WPF, MVVM | ⚪ |
| **PIXomètre** | 🟢 Universitaire | Équipe | PHP, Laravel | ⚪ |
| **Projet 24h** | 🟢 Compétitif | Équipe (5ème/24) | IA + site web | ⚪ |

---

## 3. Architecture technique

### 3.1 Stack

- **Framework** : SvelteKit (`@sveltejs/kit`) avec `adapter-node`
- **Langage** : TypeScript strict (`strict: true`, pas de `any`)
- **Runtime** : Node.js (LTS la plus récente disponible au moment du build, vérifier `engines` dans package.json)
- **Persistance contenu** : Fichiers Markdown avec frontmatter YAML (parsés via `gray-matter` + `unified`/`remark`)
- **Persistance dynamique** : SQLite via `better-sqlite3` (driver synchronous, idiomatique en Node) + `drizzle-orm` comme ORM typé. Migrations gérées par `drizzle-kit`. Le `SqliteContactMessageRepository` consomme directement le client Drizzle (pas de couche d'abstraction supplémentaire)
- **Validation** : `zod` pour la validation des entrées et la définition des schémas
- **Email transactionnel** : Resend (`resend` SDK officiel)
- **Tests** : Vitest (compatible SvelteKit out-of-the-box)
- **Linting** : ESLint avec `eslint-plugin-svelte`, `@typescript-eslint`
- **Formatting** : Prettier avec `prettier-plugin-svelte`
- **Hooks** : Husky + lint-staged
- **Conventions de commit** : Conventional Commits (avec `commitlint` en pre-commit)
- **Gestionnaire de paquets** : `pnpm` (rapide, économe en disque, lockfile fiable). Version fixée dans `packageManager` du `package.json`

### 3.2 Architecture Clean Architecture académique

Le code applicatif est organisé en **quatre couches concentriques**, avec dépendances pointant exclusivement vers l'intérieur :

```
┌─────────────────────────────────────────────────┐
│  routes/  ← SvelteKit (couche externe)          │
│  ┌──────────────────────────────────────────┐   │
│  │  presentation/  ← view-models, mappers   │   │
│  │  ┌────────────────────────────────────┐  │   │
│  │  │  infrastructure/  ← adapters       │  │   │
│  │  │  ┌──────────────────────────────┐  │  │   │
│  │  │  │  application/  ← use cases   │  │  │   │
│  │  │  │  ┌────────────────────────┐  │  │  │   │
│  │  │  │  │  domain/  ← cœur pur   │  │  │  │   │
│  │  │  │  └────────────────────────┘  │  │  │   │
│  │  │  └──────────────────────────────┘  │  │   │
│  │  └────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
```

**Règle de dépendance (Dependency Rule)** : une couche ne peut dépendre que des couches strictement plus internes qu'elle. Le `domain/` ne dépend de rien (pas même de `zod` ou de `Date` directement — pour rester pur).

#### 3.2.1 `domain/` — cœur métier pur

Contient :
- **Entities** : `Project`, `Experience`, `Skill`, `ContactMessage`
- **Value Objects** : `Email`, `ProjectSlug`, `TechStack`, `DateRange`, `ProjectStatus` (enum), `MediaAsset`
- **Domain Errors** : `InvalidEmailError`, `ProjectNotFoundError`, `ContactMessageRejectedError`
- **Domain Services** (si nécessaire) : pure functions sans état

Règles :
- Aucune dépendance externe (pas de `zod`, pas de `gray-matter`, pas de `better-sqlite3`)
- Immutabilité stricte (`readonly` partout, classes ou objets gelés)
- Validation à la construction (factory methods qui retournent `Result<T, E>`)

#### 3.2.2 `application/` — use cases et ports

Contient :
- **Use cases** : un fichier par cas d'usage, fonction ou classe avec une seule méthode `execute`
  - `ListProjects`
  - `GetProjectBySlug`
  - `ListExperiences`
  - `ListSkills`
  - `SubmitContactMessage`
- **Ports (interfaces)** : contrats que les adapters externes doivent implémenter
  - `ProjectRepository`
  - `ExperienceRepository`
  - `SkillRepository`
  - `ContactMessageRepository`
  - `EmailService`
  - `Clock` (pour mocker le temps en tests)

Règles :
- Dépend uniquement de `domain/`
- Les use cases retournent `Result<T, E>` (railway-oriented), jamais d'exceptions sauvages
- Une seule responsabilité par use case (SRP)

#### 3.2.3 `infrastructure/` — adapters concrets

Contient les implémentations concrètes des ports :

- `persistence/filesystem/` :
  - `FilesystemProjectRepository` : lit les `.md` depuis `content/projects/`
  - `FilesystemExperienceRepository` : idem pour `content/experiences/`
  - `FilesystemSkillRepository` : idem pour `content/skills/`
  - `MarkdownParser` : helper interne (gray-matter + remark)
- `persistence/sqlite/` :
  - `SqliteContactMessageRepository` : stocke les messages reçus
  - Migrations Drizzle dans `infrastructure/persistence/sqlite/migrations/`
- `email/` :
  - `ResendEmailService` : envoie les notifications via Resend
  - `NoopEmailService` (pour les tests, déjà au niveau application/test-doubles)
- `clock/` :
  - `SystemClock` : implémente `Clock` avec `Date.now()`

Règles :
- Dépend de `application/` et `domain/`
- Aucune connaissance de SvelteKit ou de l'UI
- Les adapters convertissent les données externes (markdown, lignes SQL) en entités du domaine via des **mappers**

#### 3.2.4 `presentation/` — mappers vers view-models

Contient :
- **View-Models** : structures de données dédiées aux vues Svelte (POJOs sérialisables)
  - `ProjectListItemViewModel`, `ProjectDetailViewModel`, `ExperienceViewModel`, etc.
- **Mappers** : transforment les entités du domaine en view-models
  - `ProjectViewModelMapper.toListItem(project: Project): ProjectListItemViewModel`
  - `ProjectViewModelMapper.toDetail(project: Project): ProjectDetailViewModel`

Règles :
- Dépend de `domain/` (lit les entités) — pas de `application/`
- Aucune logique métier, uniquement de la transformation de données
- Les view-models doivent être **sérialisables JSON** (SvelteKit transmet les données du serveur vers le client via JSON)

#### 3.2.5 `routes/` — couche d'entrée SvelteKit (extension physique de `presentation/`)

**Note importante** : conceptuellement, `routes/` *appartient à la couche présentation*. Mais SvelteKit impose physiquement le dossier `src/routes/` pour son routing par convention (file-based routing). On considère donc que **la couche présentation est logiquement scindée en deux dossiers** :
- `src/lib/presentation/` : view-models, mappers (réutilisables, testables, indépendants du framework)
- `src/routes/` : pages SvelteKit (controllers + views), **contrainte du framework**

Ce choix est documenté dans **ADR 0005 — `routes/` et la couche présentation**. Alternative considérée : mettre des stubs minimaux dans `routes/` qui réexportent depuis `lib/presentation/pages/` — rejetée car elle ajoute de l'indirection sans bénéfice réel pour ce projet (chaque page demanderait 2 fichiers de plus).

Contient les fichiers SvelteKit (`+page.svelte`, `+page.server.ts`, `+server.ts`).

Règles :
- Les `+page.server.ts` sont des **contrôleurs minces** qui :
  1. Récupèrent les use cases via le composition root
  2. Les appellent avec les paramètres HTTP
  3. Mappent les entités retournées en view-models via les mappers de `presentation/`
  4. Retournent les view-models au composant Svelte
- Les `+page.svelte` ne contiennent **aucune logique métier**, uniquement du rendu et des interactions
- Pas d'import de `infrastructure/` directement depuis `routes/` — toujours passer par les use cases
- **Limite de taille** : un `+page.server.ts` de plus de ~50 lignes est suspect — la logique doit être dans le use case, pas dans le contrôleur

### 3.3 Composition Root et injection de dépendances

Pas de container DI tiers (InversifyJS, tsyringe, etc.). On utilise un fichier unique **composition root** qui assemble manuellement les dépendances. Convention : **factories fonctionnelles** (pas de `new` partout) — chaque use case est une fonction qui prend ses dépendances en paramètres et retourne une fonction `execute`. Cette approche est plus idiomatique en TypeScript moderne et plus simple à tester.

`src/lib/composition-root.ts` (exemple) :

```typescript
import { createFilesystemProjectRepository } from '$lib/infrastructure/persistence/filesystem/FilesystemProjectRepository';
import { createListProjects } from '$lib/application/use-cases/ListProjects';
import { createSubmitContactMessage } from '$lib/application/use-cases/SubmitContactMessage';
// ... etc.

const projectRepository = createFilesystemProjectRepository({ contentDir: 'content/projects' });
const contactRepository = createSqliteContactMessageRepository({ db });
const emailService = createResendEmailService({ apiKey: env.RESEND_API_KEY });
const clock = createSystemClock();

export const useCases = {
  listProjects: createListProjects({ projectRepository }),
  getProjectBySlug: createGetProjectBySlug({ projectRepository }),
  submitContactMessage: createSubmitContactMessage({
    contactRepository,
    emailService,
    clock,
  }),
};
```

**Note** : les classes restent acceptables si elles apportent de la valeur (entités du domaine avec invariants, par exemple). La règle est : **pas de classes "anémiques" qui n'ont qu'une méthode publique** — celles-là deviennent des factories fonctionnelles.

Les `+page.server.ts` importent depuis le composition root :

```typescript
import { useCases } from '$lib/composition-root';
import { ProjectViewModelMapper } from '$lib/presentation/mappers/ProjectViewModelMapper';

export const load = async () => {
  const result = await useCases.listProjects.execute();
  if (result.isErr()) throw error(500, result.error.message);
  return {
    projects: result.value.map(ProjectViewModelMapper.toListItem)
  };
};
```

### 3.4 Structure de fichiers complète

```
portfolio/
├─ .github/
│  └─ workflows/
│     └─ ci.yml                              # Lint + tests sur push/PR
├─ .husky/
│  ├─ pre-commit                             # lint-staged
│  └─ commit-msg                             # commitlint
├─ content/                                  # Données métier (markdown)
│  ├─ projects/
│  │  ├─ deardiary.md
│  │  ├─ vanice.md
│  │  ├─ aprr.md
│  │  ├─ aie.md
│  │  ├─ pixometre.md
│  │  └─ projet-24h.md
│  ├─ experiences/
│  │  ├─ aprr.md
│  │  ├─ acodege.md
│  │  └─ mdinformatique.md
│  └─ skills/
│     └─ skills.md                           # Tous les skills dans un seul .md
├─ docs/
│  ├─ superpowers/
│  │  ├─ specs/
│  │  │  └─ 2026-05-04-portfolio-design.md   # Ce document
│  │  └─ plans/                              # Plans d'implémentation à venir
│  └─ adr/                                   # Architecture Decision Records
│     ├─ 0001-clean-architecture.md
│     ├─ 0002-sveltekit-fullstack.md
│     ├─ 0003-markdown-content.md
│     ├─ 0004-result-error-handling.md
│     └─ 0005-routes-presentation-split.md
├─ static/
│  ├─ cv.pdf                                 # CV téléchargeable
│  ├─ images/                                # Images des projets, avatars, etc.
│  └─ favicon.ico
├─ src/
│  ├─ lib/
│  │  ├─ domain/
│  │  │  ├─ entities/
│  │  │  │  ├─ Project.ts
│  │  │  │  ├─ Experience.ts
│  │  │  │  ├─ Skill.ts
│  │  │  │  └─ ContactMessage.ts
│  │  │  ├─ value-objects/
│  │  │  │  ├─ Email.ts
│  │  │  │  ├─ ProjectSlug.ts
│  │  │  │  ├─ TechStack.ts
│  │  │  │  ├─ DateRange.ts
│  │  │  │  ├─ ProjectStatus.ts
│  │  │  │  └─ MediaAsset.ts
│  │  │  ├─ errors/
│  │  │  │  ├─ DomainError.ts
│  │  │  │  ├─ InvalidEmailError.ts
│  │  │  │  ├─ ProjectNotFoundError.ts
│  │  │  │  └─ ContactMessageRejectedError.ts
│  │  │  └─ shared/
│  │  │     └─ Result.ts                     # Result<T, E> type
│  │  │
│  │  ├─ application/
│  │  │  ├─ ports/
│  │  │  │  ├─ ProjectRepository.ts
│  │  │  │  ├─ ExperienceRepository.ts
│  │  │  │  ├─ SkillRepository.ts
│  │  │  │  ├─ ContactMessageRepository.ts
│  │  │  │  ├─ EmailService.ts
│  │  │  │  └─ Clock.ts
│  │  │  └─ use-cases/
│  │  │     ├─ ListProjects.ts
│  │  │     ├─ GetProjectBySlug.ts
│  │  │     ├─ ListExperiences.ts
│  │  │     ├─ ListSkills.ts
│  │  │     └─ SubmitContactMessage.ts
│  │  │
│  │  ├─ infrastructure/
│  │  │  ├─ persistence/
│  │  │  │  ├─ filesystem/
│  │  │  │  │  ├─ FilesystemProjectRepository.ts
│  │  │  │  │  ├─ FilesystemExperienceRepository.ts
│  │  │  │  │  ├─ FilesystemSkillRepository.ts
│  │  │  │  │  ├─ MarkdownParser.ts
│  │  │  │  │  └─ mappers/                   # Markdown frontmatter → entities
│  │  │  │  └─ sqlite/
│  │  │  │     ├─ SqliteContactMessageRepository.ts
│  │  │  │     ├─ schema.ts                  # Drizzle schema
│  │  │  │     └─ migrations/
│  │  │  ├─ email/
│  │  │  │  └─ ResendEmailService.ts
│  │  │  └─ clock/
│  │  │     └─ SystemClock.ts
│  │  │
│  │  ├─ presentation/
│  │  │  ├─ view-models/
│  │  │  │  ├─ ProjectListItemViewModel.ts
│  │  │  │  ├─ ProjectDetailViewModel.ts
│  │  │  │  ├─ ExperienceViewModel.ts
│  │  │  │  └─ SkillViewModel.ts
│  │  │  └─ mappers/
│  │  │     ├─ ProjectViewModelMapper.ts
│  │  │     ├─ ExperienceViewModelMapper.ts
│  │  │     └─ SkillViewModelMapper.ts
│  │  │
│  │  ├─ components/                         # Composants Svelte réutilisables
│  │  │  ├─ Button.svelte
│  │  │  ├─ Tag.svelte
│  │  │  ├─ ProjectCard.svelte
│  │  │  ├─ Timeline.svelte
│  │  │  └─ ContactForm.svelte
│  │  │
│  │  ├─ styles/
│  │  │  ├─ tokens.css                       # CSS variables (couleurs, espaces, etc.)
│  │  │  ├─ reset.css
│  │  │  └─ typography.css
│  │  │
│  │  ├─ server/                             # Code server-only (idiomatique SvelteKit)
│  │  │  └─ env.ts                           # Variables d'env validées via zod
│  │  │
│  │  └─ composition-root.ts                 # Wire-up des dépendances
│  │
│  ├─ routes/
│  │  ├─ +layout.svelte                      # Header, footer, layout global
│  │  ├─ +layout.ts                          # Données globales (statut "disponible", etc.)
│  │  ├─ +page.svelte                        # Home
│  │  ├─ +page.server.ts                     # Charge projets phares + skills clés
│  │  ├─ projets/
│  │  │  ├─ +page.svelte                     # Liste tous les projets
│  │  │  ├─ +page.server.ts
│  │  │  └─ [slug]/
│  │  │     ├─ +page.svelte                  # Détail projet
│  │  │     └─ +page.server.ts
│  │  ├─ parcours/
│  │  │  ├─ +page.svelte                     # Frise formations + expériences
│  │  │  └─ +page.server.ts
│  │  └─ contact/
│  │     ├─ +page.svelte                     # Formulaire
│  │     └─ +page.server.ts                  # Form action (validation + envoi mail + persistance)
│  │
│  ├─ app.html                               # Template HTML SvelteKit
│  └─ app.d.ts                               # Types globaux
│
├─ tests/
│  ├─ domain/                                # Unit tests des entities et VOs
│  ├─ application/                           # Unit tests des use cases (avec mocks)
│  └─ infrastructure/                        # (Optionnel v1) Tests d'intégration
│
├─ Dockerfile                                # Multi-stage build (deps, build, runtime)
├─ docker-compose.yml                        # Pour développement local + déploiement VPS
├─ .dockerignore
├─ .gitignore
├─ .nvmrc                                    # Version Node fixée
├─ .editorconfig
├─ .eslintrc.cjs
├─ .prettierrc
├─ commitlint.config.cjs
├─ drizzle.config.ts
├─ package.json
├─ pnpm-lock.yaml                            # ou package-lock.json selon le choix
├─ svelte.config.js
├─ tsconfig.json
├─ vite.config.ts
├─ vitest.config.ts
└─ README.md
```

### 3.5 Schémas de données

#### 3.5.1 Project (entité)

```typescript
class Project {
  readonly slug: ProjectSlug;
  readonly title: string;
  readonly summary: string;            // 1-2 phrases pour les cards
  readonly description: string;        // Markdown rendu, version longue
  readonly stack: TechStack;
  readonly status: ProjectStatus;      // 'finished' | 'in-progress' | 'archived'
  readonly type: ProjectType;          // 'personal' | 'professional' | 'academic' | 'competitive'
  readonly featured: boolean;          // Affiché en home si true
  readonly dateRange: DateRange;
  readonly repoUrl?: string;
  readonly liveUrl?: string;
  readonly media: readonly MediaAsset[];
  readonly architecture?: string;      // Markdown : section archi du projet
  readonly highlights: readonly string[];  // Bullet points clés
}
```

#### 3.5.2 Frontmatter Markdown — exemple `content/projects/deardiary.md`

```yaml
---
slug: deardiary
title: DearDiary
summary: Journal intime fullstack avec analyse de l'évolution de l'humeur
type: personal
status: finished
featured: true
dateStart: 2024-09-01
dateEnd: 2025-06-01
stack:
  - Spring Boot
  - Angular
  - NgRx
  - MySQL
  - Docker
  - Flyway
repoUrl: https://github.com/yohanfinelle/deardiary
highlights:
  - Architecture hexagonale (ports & adapters)
  - Atomic Design côté front
  - State management NgRx avec optimistic updates
  - Tests unitaires + intégration
media:
  - type: image
    src: /images/projects/deardiary/home.png
    alt: Page d'accueil de DearDiary
---

## Contexte

DearDiary est une application personnelle…

## Architecture

L'application suit une architecture hexagonale stricte…

## Défis techniques

…
```

#### 3.5.3 Schéma SQLite — `contact_messages`

```typescript
// drizzle schema
export const contactMessages = sqliteTable('contact_messages', {
  id: text('id').primaryKey(),                 // UUID
  email: text('email').notNull(),
  name: text('name').notNull(),
  subject: text('subject').notNull(),
  message: text('message').notNull(),
  receivedAt: integer('received_at', { mode: 'timestamp' }).notNull(),
  ipHash: text('ip_hash'),                     // Hash de l'IP pour rate limiting
  emailSent: integer('email_sent', { mode: 'boolean' }).notNull().default(false),
});
```

### 3.6 Flux de données — exemple : `/projets`

```
Browser GET /projets
  ↓
[routes/projets/+page.server.ts] load()
  ↓
useCases.listProjects.execute()
  ↓
[application/use-cases/ListProjects] execute()
  ↓
projectRepository.findAll()
  ↓
[infrastructure/persistence/filesystem/FilesystemProjectRepository] findAll()
  ↓
Lit content/projects/*.md
  ↓
MarkdownParser → ProjectMapper.toDomain() → Project[]
  ↓
Result.ok(Project[]) remonte
  ↓
[routes/.../+page.server.ts] map via ProjectViewModelMapper.toListItem
  ↓
return { projects: ProjectListItemViewModel[] }
  ↓
[routes/projets/+page.svelte] {#each projects}
  ↓
Render dans le navigateur
```

### 3.7 Form contact — flux complet

```
Browser submit POST /contact
  ↓
[routes/contact/+page.server.ts] actions.default()
  ↓
1. Parse formData
2. Validation Zod du payload (email valide, longueurs, honeypot vide)
3. Rate limiting check (max 5 messages/heure par IP)
  ↓
useCases.submitContactMessage.execute({ email, name, subject, message, clientIp })
  ↓
[application/use-cases/SubmitContactMessage]
  1. Construit l'entité ContactMessage (validation domaine)
  2. contactMessageRepository.save(message)
  3. emailService.sendNotification(...)
  4. Retourne Result.ok() ou Result.err(error)
  ↓
Si succès : retour { success: true } au composant Svelte
Si échec : retour { success: false, error: '...' } + status 400/500
```

---

## 4. Design system

### 4.1 Palette de couleurs

Toutes les valeurs sont définies en CSS variables dans `src/lib/styles/tokens.css`.

| Token | Valeur | Usage |
|---|---|---|
| `--color-bg` | `#0a0e0a` | Fond principal |
| `--color-bg-elevated` | `#11161a` | Cards, surfaces surélevées |
| `--color-text` | `#e8f0e8` | Texte principal |
| `--color-text-secondary` | `#a8c8a8` | Texte secondaire (subtitles) |
| `--color-text-muted` | `#6b7e6b` | Texte tertiaire (captions) |
| `--color-accent` | `#4ade80` | Vert vif — boutons, liens, accents |
| `--color-accent-soft` | `#4ade8020` | Background subtil pour les tags |
| `--color-border` | `#2d3a2d` | Bordures |
| `--color-border-subtle` | `#1a201a` | Séparateurs discrets |

Tous les ratios texte/fond doivent respecter au minimum **WCAG AA** (4.5:1 pour le texte normal, 3:1 pour le texte large).

### 4.2 Typographie

- **Famille principale** : **Inter** (sans-serif, conçu pour les écrans, excellent rendu à toutes les tailles, accessible)
  - Chargée via `@fontsource-variable/inter` (variable font, un seul fichier pour toutes les graisses)
  - Subset **Latin uniquement** (pas de cyrillique/grec → ~50% de poids économisé)
  - `font-display: swap` (le texte reste lisible pendant le chargement, pas de FOIT)
  - Préchargée via `<link rel="preload">` dans `app.html` pour LCP optimal
- **Famille monospace** (snippets de code uniquement) : **JetBrains Mono** (lisible, ligatures optionnelles)
- **Pas de serif** dans tout le site (cohérence visuelle, et serif est moins lisible sur écran à petite taille)

Échelle :

| Token | Taille | Usage |
|---|---|---|
| `--font-size-hero` | 32–40px | Titres home |
| `--font-size-h1` | 28px | Titres de page |
| `--font-size-h2` | 22px | Titres de section |
| `--font-size-body` | 15px | Corps de texte |
| `--font-size-small` | 13px | Métadonnées |
| `--font-size-caption` | 11px | Labels uppercase |

### 4.3 Espacement (échelle 4-points)

```
--space-1: 4px
--space-2: 8px
--space-3: 12px
--space-4: 16px
--space-6: 24px
--space-8: 32px
--space-12: 48px
--space-16: 64px
```

### 4.4 Composants UI clés

- `Button` (variants : `primary` vert, `secondary` outline, `ghost`)
- `Tag` (pour les techs, statuts)
- `ProjectCard` (preview projet en home et liste)
- `Timeline` / `TimelineItem` (parcours)
- `ContactForm`
- `MediaCarousel` (pour la page projet, screenshots/gifs)
- `StatusBadge` ("● Disponible · sept. 2026")

---

## 5. Gestion d'erreurs

### 5.1 Le type `Result<T, E>`

Toutes les opérations qui peuvent échouer dans le domaine et l'application retournent un `Result<T, E>` (pattern emprunté à Rust / fp-ts) :

```typescript
type Result<T, E> =
  | { readonly ok: true;  readonly value: T }
  | { readonly ok: false; readonly error: E };
```

Avec des helpers `Result.ok(value)`, `Result.err(error)`, `result.map`, `result.flatMap`, `result.isOk()`, `result.isErr()`.

### 5.2 Hiérarchie des erreurs

- `DomainError` (classe abstraite) — toutes les erreurs métier en héritent
  - `InvalidEmailError`
  - `ProjectNotFoundError`
  - `ContactMessageRejectedError` (rate limit, contenu invalide, etc.)
- `InfrastructureError` (classe abstraite)
  - `RepositoryUnavailableError`
  - `EmailDeliveryError`

Les erreurs ont un `code` string pour l'identification programmatique et un `message` pour le log/debug.

### 5.3 Aux frontières

- **Côté `+page.server.ts`** : on traduit les erreurs en réponses HTTP appropriées
  - `ProjectNotFoundError` → `error(404, ...)`
  - `ContactMessageRejectedError(rate_limit)` → `fail(429, ...)`
  - Erreurs infrastructure → `error(500, ...)` + log
- **Aucune exception** ne doit traverser la frontière domain/application sans être convertie en `Result`

---

## 6. Tests

### 6.1 Stratégie

Pour la v1, focus sur les tests qui apportent le plus de valeur démonstrative :

- **Unitaires sur le domain** : tous les value-objects et entities (notamment les invariants à la construction)
- **Unitaires sur les use cases** : avec des fakes/mocks des ports
- **Pas de tests E2E ni d'intégration en v1** (ajoutables plus tard)

### 6.2 Test doubles

Plutôt que d'utiliser `vi.fn()` partout, on définit des **fakes en mémoire** :

- `InMemoryProjectRepository`
- `InMemoryContactMessageRepository`
- `FakeEmailService` (capture les appels)
- `FixedClock` (renvoie une date prédéfinie)

Ces fakes vivent dans `tests/fakes/`, pas dans `src/` (ils ne sont pas compilés en prod).

### 6.3 Couverture cible

- Domain : 100%
- Application : > 90%
- Infrastructure : non couvert en v1

---

## 7. CI/CD

### 7.1 GitHub Actions — `.github/workflows/ci.yml`

À chaque push et PR :
1. Setup Node (version depuis `.nvmrc`)
2. Install dependencies (`pnpm install --frozen-lockfile` ou équivalent)
3. Lint (`pnpm lint`)
4. Type-check (`pnpm check`)
5. Tests (`pnpm test`)
6. Build (`pnpm build`)

Si l'un échoue, le workflow échoue. Le badge "CI passing" doit apparaître sur le README.

### 7.2 Déploiement

- **Cible** : VPS de l'ami via Docker
- **Stratégie** : image Docker poussée sur GitHub Container Registry (`ghcr.io`), `docker compose pull && docker compose up -d` côté VPS
- **Déclencheur** : tag `v*.*.*` sur `main` (release manuelle au début, automatique plus tard)
- **Volume Docker** : un volume `portfolio-data` monté sur `/data` pour persister `portfolio.db` (SQLite) et les médias uploadés (si applicable)
- **Variables d'env** : injectées via `.env` côté VPS, jamais commitées
  - `RESEND_API_KEY`
  - `CONTACT_NOTIFICATION_EMAIL`
  - `DATABASE_PATH` (ex: `/data/portfolio.db`)
  - `PUBLIC_SITE_URL`

---

## 8. Sécurité

- **Form contact** :
  - Validation stricte côté serveur (Zod)
  - Rate limiting (5 messages / heure / IP, IP hashée pour le RGPD)
  - Honeypot (champ caché qui doit rester vide — détecte les bots)
  - Content-length limits (max 5000 caractères pour le message)
  - Pas de stockage de contenu uploadé
- **CSP** (Content Security Policy) : strict, configuré dans les hooks SvelteKit
- **Pas de secrets dans le code** : toutes les clés via `.env`, validées via Zod au démarrage
- **Sécurité Docker** : conteneur qui tourne en non-root user, image multi-stage (pas de devDependencies en prod)
- **HTTPS obligatoire** en prod (via reverse proxy Nginx/Caddy sur le VPS)

---

## 9. Accessibilité

- Sémantique HTML correcte (`<nav>`, `<main>`, `<article>`, etc.)
- Tous les boutons et liens accessibles au clavier (pas de `div onclick`)
- Focus visible (outline visible sur fond sombre)
- Contrastes WCAG AA minimum
- `alt` sur toutes les images
- Form labels associés aux inputs
- `aria-label` sur les icônes seules

---

## 10. SEO et métadonnées

- `<title>` et `<meta description>` uniques par page (gérés via SvelteKit `+page.ts`)
- Open Graph + Twitter Cards (image preview, titre, description)
- `sitemap.xml` généré au build
- `robots.txt`
- Données structurées JSON-LD (Person + WebSite) sur la home

---

## 11. Documentation

### 11.1 README.md (racine du repo)

Sections obligatoires :
- Pitch : "Portfolio de Yohan Finelle, étudiant ingénieur en recherche d'alternance"
- Stack technique
- Architecture (lien vers cette spec et les ADR)
- Comment lancer en local (`pnpm install && pnpm dev`)
- Comment lancer les tests (`pnpm test`)
- Comment build et déployer (`pnpm build`, Docker)
- Badge CI

### 11.2 ADR (Architecture Decision Records)

Documents courts (1-2 pages chacun) dans `docs/adr/` qui justifient les choix structurants :
- ADR 0001 : Pourquoi Clean Architecture
- ADR 0002 : Pourquoi SvelteKit fullstack (vs SSG, vs monorepo)
- ADR 0003 : Pourquoi le contenu en Markdown (vs CMS, vs DB)
- ADR 0004 : Pourquoi Result<T,E> et pas exceptions
- ADR 0005 : `routes/` et la couche présentation (justification du split physique)

### 11.3 TSDoc

Toutes les fonctions/classes publiques (exportées) dans `lib/domain/`, `lib/application/`, `lib/infrastructure/` doivent avoir un commentaire TSDoc qui explique :
- Ce que fait l'élément
- Les paramètres et leurs contraintes
- Le retour
- Les erreurs possibles (pour les fonctions qui retournent `Result`)

---

## 12. Roadmap d'implémentation (haut niveau)

L'implémentation détaillée sera produite dans un **plan dédié** (skill `writing-plans`) après validation de cette spec. Vue d'ensemble :

| Phase | Objectif | Livrables |
|---|---|---|
| **0 — Setup** | Initialiser le projet | repo, package.json, configs (TS, ESLint, Prettier, Husky, Vitest), CI |
| **1 — Domain & Application** | Coder le cœur métier | entities, value-objects, use cases, ports, tests unitaires |
| **2 — Infrastructure** | Implémenter les adapters | FilesystemRepositories, MarkdownParser, SqliteContactRepo, ResendEmailService |
| **3 — Composition Root** | Assembler tout | composition-root.ts |
| **4 — Presentation & UI** | Layout, design system, composants | tokens.css, composants Svelte, pages |
| **5 — Pages** | Implémenter chaque route | home, projets, parcours, contact |
| **6 — Contenu** | Rédiger les Markdown | 6 projets, 3 expériences, skills |
| **7 — Polish** | Accessibilité, SEO, perf | meta tags, sitemap, Lighthouse, fix |
| **8 — Déploiement** | Mettre en ligne | Dockerfile, docker-compose, déploiement VPS |

---

## 12 bis. Repo et nom de domaine

- **Repo GitHub** : `portfolio` (sous le compte `yohanfinelle`, public)
- **Nom de domaine** : non acheté pour la v1 — le site sera accessible via une URL temporaire fournie par le VPS de l'ami (sous-domaine ou IP). Achat de domaine personnel (`yohanfinelle.dev` ou similaire) considéré pour une v2 ultérieure.

## 13. Hors scope (YAGNI)

Volontairement exclus de la v1 pour ne pas dériver :

- Mode clair (dark only)
- i18n EN (FR uniquement, peut être ajouté plus tard)
- Blog / articles
- Back-office d'admin
- Authentification utilisateur (rien à protéger côté visiteur)
- Recherche full-text
- Statistiques publiques (vues, etc.)
- Commentaires sur les projets
- Newsletter
- Page CV en HTML (juste le PDF)
- Migration vers PostgreSQL (SQLite suffit largement)

---

## 14. Critères d'acceptation

La v1 est considérée comme livrable lorsque :

- [ ] Toutes les pages listées en 2.2 sont accessibles
- [ ] Les 6 projets sont rédigés en Markdown et affichés correctement
- [ ] Le formulaire de contact envoie un mail à Yohan via Resend et persiste le message en SQLite
- [ ] Tests unitaires verts (domain + application > 90%)
- [ ] Lint, type-check, tests passent en CI GitHub Actions
- [ ] Site déployé sur le VPS avec Docker, accessible via HTTPS
- [ ] Lighthouse mobile ≥ 90 sur les 4 catégories (Performance, Accessibility, Best Practices, SEO)
- [ ] README à jour avec instructions de build/test/deploy
- [ ] 4 ADR rédigés
- [ ] Repo public sur GitHub avec badge CI vert

---

## Annexes

### Annexe A — Justifications des choix techniques

Voir les ADR (`docs/adr/`).

### Annexe B — Risques identifiés

| Risque | Mitigation |
|---|---|
| Sur-ingénierie ralentit la livraison | Roadmap avec phases courtes, livrer une v1 minimale d'abord |
| Le repo privé de Vanice limite la démo | Inclure des screenshots et vidéos en abondance, expliquer le rôle |
| Resend tombe en panne | Fallback : log du message en SQLite, affichage d'un message "réessayez plus tard" |
| VPS de l'ami indisponible | Plan B : déploiement temporaire sur Render/Fly.io free tier |

### Annexe C — Inspirations design

- Vercel.com (dark mode, accent vif)
- Linear.app (clarté, hiérarchie)
- GitHub dark theme (palette verte)

### Annexe D — Public cible étendu

| Public | Type | Critères d'évaluation typiques |
|---|---|---|
| Recruteurs entreprise | Tech lead, RH | Compétences pratiques, projets concrets, rigueur, posture pro |
| Écoles d'ingénieur (cible principale) | Comité d'admission | Profil académique, motivation, capacité à raisonner, expériences |
| DIIAGE Dijon (cible secondaire) | École d'informatique non-ingé | Compétences techniques solides, projets concrets, sérieux du dossier |

Le ton du portfolio reste **professionnel et factuel**, sans jargon excessif d'une école ou d'une entreprise particulière, pour parler aux trois sans en privilégier un.

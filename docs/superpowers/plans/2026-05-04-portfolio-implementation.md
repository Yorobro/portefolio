# Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build Yohan Finelle's portfolio as a SvelteKit fullstack app deployed via Docker on a VPS, applying Clean Architecture academically (domain / application / infrastructure / presentation), with TS strict, Vitest tests on domain + application, and CI on GitHub Actions.

**Architecture:** SvelteKit with `adapter-node`, four-layer Clean Architecture inside `src/lib/`, file-based routing in `src/routes/` (treated as physical extension of presentation layer per ADR 0005). Markdown for static content, SQLite (better-sqlite3 + Drizzle ORM) for the contact form, Resend for transactional emails. Dependencies wired manually in a single `composition-root.ts` (factory functions, no DI container).

**Tech Stack:** SvelteKit · TypeScript strict · pnpm · Vitest · ESLint · Prettier · Husky + lint-staged · commitlint · better-sqlite3 · drizzle-orm · drizzle-kit · zod · resend · gray-matter · unified/remark · @fontsource-variable/inter · Docker · GitHub Actions.

**Repository:** local repo `portfolio` (already initialized on `main`, first commit done with the design spec). Will be pushed to GitHub when the user gives the go.

---

## Phase Overview

| Phase        | Goal                                       | Tasks |
| ------------ | ------------------------------------------ | ----- |
| **Phase 0**  | Project bootstrap                          | 1–6   |
| **Phase 1**  | Domain layer                               | 7–14  |
| **Phase 2**  | Application layer                          | 15–20 |
| **Phase 3**  | Infrastructure layer                       | 21–28 |
| **Phase 4**  | Presentation layer (mappers + view-models) | 29–32 |
| **Phase 5**  | Composition root + env                     | 33–35 |
| **Phase 6**  | Design system & shared UI components       | 36–42 |
| **Phase 7**  | Pages                                      | 43–50 |
| **Phase 8**  | Content authoring                          | 51–56 |
| **Phase 9**  | Polish (SEO, a11y, perf)                   | 57–61 |
| **Phase 10** | Deployment & release                       | 62–66 |

Each phase ends with a green CI checkpoint.

> **Note for the executor:** read `docs/superpowers/specs/2026-05-04-portfolio-design.md` before starting Phase 1. The spec defines all entity shapes, error types, and acceptance criteria referenced in this plan.

---

## Phase 0 — Bootstrap

### Task 1: Scaffold SvelteKit project

**Files:**

- Create: project skeleton via SvelteKit CLI

- [ ] **Step 1: Run the SvelteKit init in the existing directory**

The directory already contains `.git/`, `.gitignore`, and `docs/`. Use `pnpm create svelte` in the same dir.

```bash
pnpm dlx sv create . --template minimal --types ts --no-add-ons
```

When prompted "Directory not empty, continue?" answer **Yes**. Choose:

- Template: **Minimal**
- Type checking: **TypeScript syntax**
- Additional options: **none for now** (we'll add ESLint/Prettier/Vitest manually for full control)

- [ ] **Step 2: Pin Node version**

Create `.nvmrc`:

```
20.18.1
```

Add `engines` and `packageManager` to `package.json`:

```json
{
  "engines": {
    "node": ">=20.18.0"
  },
  "packageManager": "pnpm@9.12.0"
}
```

- [ ] **Step 3: Install adapter-node**

```bash
pnpm add -D @sveltejs/adapter-node
pnpm remove @sveltejs/adapter-auto
```

- [ ] **Step 4: Configure adapter-node in `svelte.config.js`**

Replace the `adapter-auto` import with `adapter-node`:

```js
import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter({
      out: 'build',
      precompress: true,
    }),
    alias: {
      $domain: 'src/lib/domain',
      $application: 'src/lib/application',
      $infrastructure: 'src/lib/infrastructure',
      $presentation: 'src/lib/presentation',
      $components: 'src/lib/components',
      $styles: 'src/lib/styles',
      $server: 'src/lib/server',
    },
  },
};

export default config;
```

- [ ] **Step 5: Verify dev server starts**

```bash
pnpm install
pnpm dev
```

Expected: server starts on `http://localhost:5173`, default SvelteKit page renders. Stop the server (Ctrl+C).

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "chore: scaffold SvelteKit project with adapter-node and path aliases"
```

---

### Task 2: TypeScript strict configuration

**Files:**

- Modify: `tsconfig.json`

- [ ] **Step 1: Replace `tsconfig.json` content**

```json
{
  "extends": "./.svelte-kit/tsconfig.json",
  "compilerOptions": {
    "allowJs": true,
    "checkJs": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "skipLibCheck": true,
    "sourceMap": true,
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "noFallthroughCasesInSwitch": true,
    "noPropertyAccessFromIndexSignature": false,
    "exactOptionalPropertyTypes": true,
    "moduleResolution": "bundler"
  }
}
```

- [ ] **Step 2: Verify type-check passes on the empty scaffold**

```bash
pnpm check
```

Expected: 0 errors.

- [ ] **Step 3: Commit**

```bash
git add tsconfig.json
git commit -m "chore: enable TypeScript strict mode with stricter compiler options"
```

---

### Task 3: ESLint + Prettier setup

**Files:**

- Create: `.eslintrc.cjs`, `.eslintignore`, `.prettierrc`, `.prettierignore`, `.editorconfig`
- Modify: `package.json` (scripts)

- [ ] **Step 1: Install lint/format dependencies**

```bash
pnpm add -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-plugin-svelte eslint-config-prettier prettier prettier-plugin-svelte svelte-eslint-parser
```

- [ ] **Step 2: Create `.eslintrc.cjs`**

```js
/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:svelte/recommended',
    'prettier',
  ],
  plugins: ['@typescript-eslint'],
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2022,
    extraFileExtensions: ['.svelte'],
  },
  env: { browser: true, es2022: true, node: true },
  overrides: [
    {
      files: ['*.svelte'],
      parser: 'svelte-eslint-parser',
      parserOptions: { parser: '@typescript-eslint/parser' },
    },
  ],
  rules: {
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/consistent-type-imports': 'error',
  },
};
```

- [ ] **Step 3: Create `.eslintignore`**

```
.svelte-kit/
build/
dist/
node_modules/
coverage/
```

- [ ] **Step 4: Create `.prettierrc`**

```json
{
  "useTabs": false,
  "tabWidth": 2,
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100,
  "semi": true,
  "plugins": ["prettier-plugin-svelte"],
  "overrides": [{ "files": "*.svelte", "options": { "parser": "svelte" } }]
}
```

- [ ] **Step 5: Create `.prettierignore`**

```
.svelte-kit/
build/
dist/
node_modules/
coverage/
pnpm-lock.yaml
```

- [ ] **Step 6: Create `.editorconfig`**

```
root = true

[*]
indent_style = space
indent_size = 2
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true
```

- [ ] **Step 7: Add scripts in `package.json`**

In the `scripts` block, ensure these exist:

```json
{
  "scripts": {
    "dev": "vite dev",
    "build": "vite build",
    "preview": "vite preview",
    "check": "svelte-kit sync && svelte-check --tsconfig ./tsconfig.json",
    "check:watch": "svelte-kit sync && svelte-check --tsconfig ./tsconfig.json --watch",
    "lint": "eslint . && prettier --check .",
    "format": "prettier --write ."
  }
}
```

- [ ] **Step 8: Run lint and format**

```bash
pnpm format
pnpm lint
```

Expected: both pass with 0 errors.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "chore: configure ESLint, Prettier, EditorConfig"
```

---

### Task 4: Vitest setup

**Files:**

- Create: `vitest.config.ts`, `tests/setup.ts`
- Modify: `package.json` (scripts)

- [ ] **Step 1: Install Vitest**

```bash
pnpm add -D vitest @vitest/coverage-v8
```

- [ ] **Step 2: Create `vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
  plugins: [sveltekit()],
  test: {
    include: ['tests/**/*.test.ts', 'src/**/*.test.ts'],
    globals: false,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      include: ['src/lib/domain/**', 'src/lib/application/**'],
      thresholds: {
        lines: 90,
        functions: 90,
        branches: 85,
        statements: 90,
      },
    },
  },
});
```

- [ ] **Step 3: Create a smoke test `tests/smoke.test.ts`**

```ts
import { describe, it, expect } from 'vitest';

describe('smoke', () => {
  it('arithmetic still works', () => {
    expect(1 + 1).toBe(2);
  });
});
```

- [ ] **Step 4: Add test scripts to `package.json`**

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage"
  }
}
```

- [ ] **Step 5: Run tests**

```bash
pnpm test
```

Expected: 1 passing test.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "chore: configure Vitest with coverage thresholds for domain and application"
```

---

### Task 5: Husky, lint-staged, commitlint

**Files:**

- Create: `.husky/pre-commit`, `.husky/commit-msg`, `commitlint.config.cjs`, `lint-staged.config.cjs`

- [ ] **Step 1: Install dependencies**

```bash
pnpm add -D husky lint-staged @commitlint/cli @commitlint/config-conventional
```

- [ ] **Step 2: Initialize husky**

```bash
pnpm exec husky init
```

This creates `.husky/pre-commit` (with a default `pnpm test` line — we'll replace it).

- [ ] **Step 3: Replace `.husky/pre-commit` content**

```sh
pnpm exec lint-staged
```

- [ ] **Step 4: Create `.husky/commit-msg`**

```sh
pnpm exec commitlint --edit "$1"
```

Make it executable (already done by husky init for pre-commit; for commit-msg do it manually if needed):

```bash
chmod +x .husky/commit-msg
```

- [ ] **Step 5: Create `lint-staged.config.cjs`**

```js
module.exports = {
  '*.{ts,js,svelte}': ['eslint --fix', 'prettier --write'],
  '*.{json,md,css,yml,yaml}': ['prettier --write'],
};
```

- [ ] **Step 6: Create `commitlint.config.cjs`**

```js
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'header-max-length': [2, 'always', 100],
  },
};
```

- [ ] **Step 7: Add `prepare` script to `package.json`**

```json
{
  "scripts": {
    "prepare": "husky"
  }
}
```

- [ ] **Step 8: Test the hooks**

Make a trivial whitespace edit in any file, stage it, commit with a message like `chore: verify hooks`. Confirm:

- lint-staged runs (output visible)
- commit succeeds

```bash
git commit -am "chore: verify hooks"
```

- [ ] **Step 9: Test commitlint catches bad messages**

```bash
git commit --allow-empty -m "bad message"
```

Expected: commit is rejected. Then make a proper one:

```bash
git commit --allow-empty -m "chore: confirm commitlint accepts conventional commits"
```

- [ ] **Step 10: Commit hook configuration**

```bash
git add -A
git commit -m "chore: add Husky, lint-staged, commitlint with conventional commits"
```

---

### Task 6: GitHub Actions CI

**Files:**

- Create: `.github/workflows/ci.yml`

- [ ] **Step 1: Create the workflow**

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  ci:
    runs-on: ubuntu-latest
    timeout-minutes: 10
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v4
        with:
          version: 9.12.0

      - uses: actions/setup-node@v4
        with:
          node-version-file: '.nvmrc'
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Lint
        run: pnpm lint

      - name: Type-check
        run: pnpm check

      - name: Test
        run: pnpm test

      - name: Build
        run: pnpm build
```

- [ ] **Step 2: Commit**

```bash
git add .github/workflows/ci.yml
git commit -m "ci: add GitHub Actions workflow for lint, type-check, test, build"
```

> 🛑 **CHECKPOINT**: end of Phase 0. Project compiles, lints, tests, and builds locally. CI workflow is ready (will run when pushed to GitHub).

---

## Phase 1 — Domain Layer

> **TDD discipline:** every domain task follows red → green → refactor → commit. Write the failing test first, run it, see it fail with the expected message, then write the minimal code to make it pass.

### Task 7: `Result<T, E>` type

**Files:**

- Create: `src/lib/domain/shared/Result.ts`
- Test: `tests/domain/shared/Result.test.ts`

- [ ] **Step 1: Write failing test**

```ts
// tests/domain/shared/Result.test.ts
import { describe, it, expect } from 'vitest';
import { Result } from '$domain/shared/Result';

describe('Result', () => {
  it('ok() creates a successful result', () => {
    const r = Result.ok(42);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value).toBe(42);
  });

  it('err() creates a failed result', () => {
    const r = Result.err(new Error('boom'));
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.message).toBe('boom');
  });

  it('map() transforms the value of an Ok', () => {
    const r = Result.ok(2).map((n) => n * 2);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value).toBe(4);
  });

  it('map() leaves an Err untouched', () => {
    const original = Result.err<number, string>('nope');
    const r = original.map((n) => n * 2);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toBe('nope');
  });

  it('flatMap() chains Ok results', () => {
    const r = Result.ok(2).flatMap((n) => Result.ok(n + 1));
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value).toBe(3);
  });

  it('flatMap() short-circuits on Err', () => {
    const r = Result.err<number, string>('first').flatMap((n) => Result.ok(n + 1));
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toBe('first');
  });
});
```

- [ ] **Step 2: Run test, expect failure**

```bash
pnpm test tests/domain/shared/Result.test.ts
```

Expected: FAIL — module not found.

- [ ] **Step 3: Implement `Result`**

```ts
// src/lib/domain/shared/Result.ts

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

export const Result = {
  ok: makeOk,
  err: makeErr,
} as const;
```

- [ ] **Step 4: Run tests, expect pass**

```bash
pnpm test tests/domain/shared/Result.test.ts
```

Expected: 6 passing.

- [ ] **Step 5: Commit**

```bash
git add src/lib/domain/shared/Result.ts tests/domain/shared/Result.test.ts
git commit -m "feat(domain): add Result<T, E> for railway-oriented error handling"
```

---

### Task 8: `DomainError` base class

**Files:**

- Create: `src/lib/domain/errors/DomainError.ts`
- Test: `tests/domain/errors/DomainError.test.ts`

- [ ] **Step 1: Write failing test**

```ts
// tests/domain/errors/DomainError.test.ts
import { describe, it, expect } from 'vitest';
import { DomainError } from '$domain/errors/DomainError';

class ConcreteError extends DomainError {
  readonly code = 'CONCRETE_ERROR';
}

describe('DomainError', () => {
  it('exposes a code and message', () => {
    const err = new ConcreteError('something happened');
    expect(err.code).toBe('CONCRETE_ERROR');
    expect(err.message).toBe('something happened');
  });

  it('is an instance of Error', () => {
    const err = new ConcreteError('boom');
    expect(err).toBeInstanceOf(Error);
    expect(err).toBeInstanceOf(DomainError);
  });

  it('preserves the class name in the stack', () => {
    const err = new ConcreteError('boom');
    expect(err.name).toBe('ConcreteError');
  });
});
```

- [ ] **Step 2: Run, expect fail**

```bash
pnpm test tests/domain/errors/DomainError.test.ts
```

- [ ] **Step 3: Implement**

```ts
// src/lib/domain/errors/DomainError.ts

/**
 * Base class for all errors that originate from the domain layer.
 * Every concrete subclass MUST set a stable `code` for programmatic identification.
 */
export abstract class DomainError extends Error {
  abstract readonly code: string;

  constructor(message: string) {
    super(message);
    this.name = new.target.name;
  }
}
```

- [ ] **Step 4: Run, expect pass**

```bash
pnpm test tests/domain/errors/DomainError.test.ts
```

- [ ] **Step 5: Commit**

```bash
git add src/lib/domain/errors/DomainError.ts tests/domain/errors/DomainError.test.ts
git commit -m "feat(domain): add DomainError base class with stable error codes"
```

---

### Task 9: `Email` value object

**Files:**

- Create: `src/lib/domain/value-objects/Email.ts`, `src/lib/domain/errors/InvalidEmailError.ts`
- Test: `tests/domain/value-objects/Email.test.ts`

- [ ] **Step 1: Write failing test**

```ts
// tests/domain/value-objects/Email.test.ts
import { describe, it, expect } from 'vitest';
import { Email } from '$domain/value-objects/Email';
import { InvalidEmailError } from '$domain/errors/InvalidEmailError';

describe('Email', () => {
  it('accepts a valid email', () => {
    const r = Email.create('yohan.finelle@gmail.com');
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.toString()).toBe('yohan.finelle@gmail.com');
  });

  it('lowercases the email', () => {
    const r = Email.create('Yohan.FINELLE@Gmail.COM');
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.toString()).toBe('yohan.finelle@gmail.com');
  });

  it('trims whitespace', () => {
    const r = Email.create('  hi@example.com  ');
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.toString()).toBe('hi@example.com');
  });

  it.each(['', 'not-an-email', '@nodomain', 'no@dot', 'spaces in@email.com'])(
    'rejects invalid email %s',
    (input) => {
      const r = Email.create(input);
      expect(r.ok).toBe(false);
      if (!r.ok) {
        expect(r.error).toBeInstanceOf(InvalidEmailError);
        expect(r.error.code).toBe('INVALID_EMAIL');
      }
    },
  );

  it('two equal emails are .equals()', () => {
    const a = Email.create('a@b.com');
    const b = Email.create('A@B.com');
    if (a.ok && b.ok) {
      expect(a.value.equals(b.value)).toBe(true);
    }
  });
});
```

- [ ] **Step 2: Run, expect fail**

```bash
pnpm test tests/domain/value-objects/Email.test.ts
```

- [ ] **Step 3: Implement `InvalidEmailError`**

```ts
// src/lib/domain/errors/InvalidEmailError.ts
import { DomainError } from './DomainError';

export class InvalidEmailError extends DomainError {
  readonly code = 'INVALID_EMAIL';

  constructor(input: string) {
    super(`Invalid email address: "${input}"`);
  }
}
```

- [ ] **Step 4: Implement `Email`**

```ts
// src/lib/domain/value-objects/Email.ts
import { Result } from '$domain/shared/Result';
import { InvalidEmailError } from '$domain/errors/InvalidEmailError';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class Email {
  private constructor(private readonly value: string) {}

  static create(raw: string): Result<Email, InvalidEmailError> {
    const normalized = raw.trim().toLowerCase();
    if (!EMAIL_PATTERN.test(normalized)) {
      return Result.err(new InvalidEmailError(raw));
    }
    return Result.ok(new Email(normalized));
  }

  toString(): string {
    return this.value;
  }

  equals(other: Email): boolean {
    return this.value === other.value;
  }
}
```

- [ ] **Step 5: Run, expect pass**

```bash
pnpm test tests/domain/value-objects/Email.test.ts
```

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat(domain): add Email value object with normalization and validation"
```

---

### Task 10: `ProjectSlug` value object

**Files:**

- Create: `src/lib/domain/value-objects/ProjectSlug.ts`, `src/lib/domain/errors/InvalidProjectSlugError.ts`
- Test: `tests/domain/value-objects/ProjectSlug.test.ts`

- [ ] **Step 1: Write failing test**

```ts
// tests/domain/value-objects/ProjectSlug.test.ts
import { describe, it, expect } from 'vitest';
import { ProjectSlug } from '$domain/value-objects/ProjectSlug';
import { InvalidProjectSlugError } from '$domain/errors/InvalidProjectSlugError';

describe('ProjectSlug', () => {
  it.each(['deardiary', 'projet-24h', 'aprr-clean-archi'])('accepts valid slug %s', (s) => {
    const r = ProjectSlug.create(s);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.toString()).toBe(s);
  });

  it.each(['', 'CapitalLetters', 'with space', 'with_underscore', 'trailing-', '-leading'])(
    'rejects invalid slug "%s"',
    (s) => {
      const r = ProjectSlug.create(s);
      expect(r.ok).toBe(false);
      if (!r.ok) expect(r.error).toBeInstanceOf(InvalidProjectSlugError);
    },
  );

  it('compares by value', () => {
    const a = ProjectSlug.create('foo');
    const b = ProjectSlug.create('foo');
    if (a.ok && b.ok) expect(a.value.equals(b.value)).toBe(true);
  });
});
```

- [ ] **Step 2: Run, expect fail**

- [ ] **Step 3: Implement**

```ts
// src/lib/domain/errors/InvalidProjectSlugError.ts
import { DomainError } from './DomainError';

export class InvalidProjectSlugError extends DomainError {
  readonly code = 'INVALID_PROJECT_SLUG';

  constructor(input: string) {
    super(`Invalid project slug: "${input}"`);
  }
}
```

```ts
// src/lib/domain/value-objects/ProjectSlug.ts
import { Result } from '$domain/shared/Result';
import { InvalidProjectSlugError } from '$domain/errors/InvalidProjectSlugError';

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export class ProjectSlug {
  private constructor(private readonly value: string) {}

  static create(raw: string): Result<ProjectSlug, InvalidProjectSlugError> {
    if (!SLUG_PATTERN.test(raw)) {
      return Result.err(new InvalidProjectSlugError(raw));
    }
    return Result.ok(new ProjectSlug(raw));
  }

  toString(): string {
    return this.value;
  }

  equals(other: ProjectSlug): boolean {
    return this.value === other.value;
  }
}
```

- [ ] **Step 4: Run, expect pass**

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat(domain): add ProjectSlug value object"
```

---

### Task 11: `DateRange`, `ProjectStatus`, `ProjectType`, `MediaAsset`, `TechStack` value objects

**Files:**

- Create: `src/lib/domain/value-objects/DateRange.ts`, `ProjectStatus.ts`, `ProjectType.ts`, `MediaAsset.ts`, `TechStack.ts`
- Create: `src/lib/domain/errors/InvalidDateRangeError.ts`
- Test: `tests/domain/value-objects/DateRange.test.ts`, `MediaAsset.test.ts`, `TechStack.test.ts`

- [ ] **Step 1: `DateRange` test**

```ts
// tests/domain/value-objects/DateRange.test.ts
import { describe, it, expect } from 'vitest';
import { DateRange } from '$domain/value-objects/DateRange';
import { InvalidDateRangeError } from '$domain/errors/InvalidDateRangeError';

describe('DateRange', () => {
  it('accepts start before end', () => {
    const r = DateRange.create(new Date('2024-01-01'), new Date('2024-12-31'));
    expect(r.ok).toBe(true);
  });

  it('accepts start with no end (ongoing)', () => {
    const r = DateRange.create(new Date('2024-01-01'), undefined);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.isOngoing()).toBe(true);
  });

  it('rejects end before start', () => {
    const r = DateRange.create(new Date('2024-12-31'), new Date('2024-01-01'));
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toBeInstanceOf(InvalidDateRangeError);
  });
});
```

- [ ] **Step 2: Run, expect fail**

- [ ] **Step 3: Implement `InvalidDateRangeError`**

```ts
// src/lib/domain/errors/InvalidDateRangeError.ts
import { DomainError } from './DomainError';

export class InvalidDateRangeError extends DomainError {
  readonly code = 'INVALID_DATE_RANGE';
  constructor(message: string) {
    super(message);
  }
}
```

- [ ] **Step 4: Implement `DateRange`**

```ts
// src/lib/domain/value-objects/DateRange.ts
import { Result } from '$domain/shared/Result';
import { InvalidDateRangeError } from '$domain/errors/InvalidDateRangeError';

export class DateRange {
  private constructor(
    public readonly start: Date,
    public readonly end: Date | undefined,
  ) {}

  static create(start: Date, end: Date | undefined): Result<DateRange, InvalidDateRangeError> {
    if (end !== undefined && end.getTime() < start.getTime()) {
      return Result.err(new InvalidDateRangeError('End date must be after start date'));
    }
    return Result.ok(new DateRange(start, end));
  }

  isOngoing(): boolean {
    return this.end === undefined;
  }
}
```

- [ ] **Step 5: Implement `ProjectStatus`**

```ts
// src/lib/domain/value-objects/ProjectStatus.ts

/** Allowed project statuses surfaced in the UI. */
export const PROJECT_STATUSES = ['finished', 'in-progress', 'archived'] as const;
export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export function isProjectStatus(value: string): value is ProjectStatus {
  return (PROJECT_STATUSES as readonly string[]).includes(value);
}
```

- [ ] **Step 6: Implement `ProjectType`**

```ts
// src/lib/domain/value-objects/ProjectType.ts

export const PROJECT_TYPES = ['personal', 'professional', 'academic', 'competitive'] as const;
export type ProjectType = (typeof PROJECT_TYPES)[number];

export function isProjectType(value: string): value is ProjectType {
  return (PROJECT_TYPES as readonly string[]).includes(value);
}
```

- [ ] **Step 7: Test for `MediaAsset`**

```ts
// tests/domain/value-objects/MediaAsset.test.ts
import { describe, it, expect } from 'vitest';
import { MediaAsset } from '$domain/value-objects/MediaAsset';

describe('MediaAsset', () => {
  it('creates an image asset', () => {
    const r = MediaAsset.create({ type: 'image', src: '/img/a.png', alt: 'A' });
    expect(r.ok).toBe(true);
  });

  it('rejects empty src', () => {
    const r = MediaAsset.create({ type: 'image', src: '', alt: 'A' });
    expect(r.ok).toBe(false);
  });

  it('rejects empty alt for images', () => {
    const r = MediaAsset.create({ type: 'image', src: '/img/a.png', alt: '' });
    expect(r.ok).toBe(false);
  });
});
```

- [ ] **Step 8: Implement `MediaAsset`**

```ts
// src/lib/domain/value-objects/MediaAsset.ts
import { Result } from '$domain/shared/Result';
import { DomainError } from '$domain/errors/DomainError';

export class InvalidMediaAssetError extends DomainError {
  readonly code = 'INVALID_MEDIA_ASSET';
}

export type MediaType = 'image' | 'gif' | 'video';

interface MediaAssetProps {
  type: MediaType;
  src: string;
  alt: string;
  caption?: string;
}

export class MediaAsset {
  private constructor(public readonly props: Readonly<MediaAssetProps>) {}

  static create(props: MediaAssetProps): Result<MediaAsset, InvalidMediaAssetError> {
    if (props.src.trim().length === 0) {
      return Result.err(new InvalidMediaAssetError('src must not be empty'));
    }
    if (props.type === 'image' && props.alt.trim().length === 0) {
      return Result.err(new InvalidMediaAssetError('alt is required for images (a11y)'));
    }
    return Result.ok(new MediaAsset(Object.freeze({ ...props })));
  }
}
```

- [ ] **Step 9: Test and implement `TechStack`**

```ts
// tests/domain/value-objects/TechStack.test.ts
import { describe, it, expect } from 'vitest';
import { TechStack } from '$domain/value-objects/TechStack';

describe('TechStack', () => {
  it('creates from a non-empty list', () => {
    const r = TechStack.create(['Spring Boot', 'Angular']);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.toArray()).toEqual(['Spring Boot', 'Angular']);
  });

  it('deduplicates entries while preserving order', () => {
    const r = TechStack.create(['A', 'B', 'A']);
    if (r.ok) expect(r.value.toArray()).toEqual(['A', 'B']);
  });

  it('trims and rejects empty entries', () => {
    const r = TechStack.create(['  Java  ', '']);
    expect(r.ok).toBe(false);
  });

  it('rejects empty stack', () => {
    const r = TechStack.create([]);
    expect(r.ok).toBe(false);
  });
});
```

```ts
// src/lib/domain/value-objects/TechStack.ts
import { Result } from '$domain/shared/Result';
import { DomainError } from '$domain/errors/DomainError';

export class InvalidTechStackError extends DomainError {
  readonly code = 'INVALID_TECH_STACK';
}

export class TechStack {
  private constructor(private readonly items: readonly string[]) {}

  static create(raw: readonly string[]): Result<TechStack, InvalidTechStackError> {
    if (raw.length === 0) {
      return Result.err(new InvalidTechStackError('TechStack must not be empty'));
    }
    const trimmed: string[] = [];
    for (const item of raw) {
      const t = item.trim();
      if (t.length === 0) {
        return Result.err(new InvalidTechStackError('TechStack entries must not be empty'));
      }
      if (!trimmed.includes(t)) trimmed.push(t);
    }
    return Result.ok(new TechStack(trimmed));
  }

  toArray(): readonly string[] {
    return this.items;
  }
}
```

- [ ] **Step 10: Run all tests**

```bash
pnpm test
```

Expected: all green (Result, DomainError, Email, ProjectSlug, DateRange, MediaAsset, TechStack).

- [ ] **Step 11: Commit**

```bash
git add -A
git commit -m "feat(domain): add value objects (DateRange, MediaAsset, TechStack, ProjectStatus, ProjectType)"
```

---

### Task 12: `Project` entity

**Files:**

- Create: `src/lib/domain/entities/Project.ts`, `src/lib/domain/errors/ProjectNotFoundError.ts`
- Test: `tests/domain/entities/Project.test.ts`

- [ ] **Step 1: Write failing test**

```ts
// tests/domain/entities/Project.test.ts
import { describe, it, expect } from 'vitest';
import { Project } from '$domain/entities/Project';
import { ProjectSlug } from '$domain/value-objects/ProjectSlug';
import { TechStack } from '$domain/value-objects/TechStack';
import { DateRange } from '$domain/value-objects/DateRange';

const baseProps = () => {
  const slug = ProjectSlug.create('deardiary');
  const stack = TechStack.create(['Spring Boot', 'Angular']);
  const range = DateRange.create(new Date('2024-09-01'), new Date('2025-06-01'));
  if (!slug.ok || !stack.ok || !range.ok) throw new Error('test setup failed');
  return {
    slug: slug.value,
    title: 'DearDiary',
    summary: 'A journaling app',
    description: '## DearDiary\n\nLong description.',
    stack: stack.value,
    status: 'finished' as const,
    type: 'personal' as const,
    featured: true,
    dateRange: range.value,
    repoUrl: 'https://github.com/x/y',
    liveUrl: undefined,
    media: [],
    architecture: undefined,
    highlights: ['Hexagonal architecture'],
  };
};

describe('Project', () => {
  it('creates a valid project', () => {
    const r = Project.create(baseProps());
    expect(r.ok).toBe(true);
  });

  it('rejects empty title', () => {
    const r = Project.create({ ...baseProps(), title: '   ' });
    expect(r.ok).toBe(false);
  });

  it('rejects empty summary', () => {
    const r = Project.create({ ...baseProps(), summary: '' });
    expect(r.ok).toBe(false);
  });

  it('exposes the slug as identifier', () => {
    const r = Project.create(baseProps());
    if (r.ok) expect(r.value.slug.toString()).toBe('deardiary');
  });
});
```

- [ ] **Step 2: Run, expect fail**

- [ ] **Step 3: Implement `ProjectNotFoundError`**

```ts
// src/lib/domain/errors/ProjectNotFoundError.ts
import { DomainError } from './DomainError';

export class ProjectNotFoundError extends DomainError {
  readonly code = 'PROJECT_NOT_FOUND';
  constructor(slug: string) {
    super(`Project not found: ${slug}`);
  }
}
```

- [ ] **Step 4: Implement `Project`**

```ts
// src/lib/domain/entities/Project.ts
import { Result } from '$domain/shared/Result';
import { DomainError } from '$domain/errors/DomainError';
import type { ProjectSlug } from '$domain/value-objects/ProjectSlug';
import type { TechStack } from '$domain/value-objects/TechStack';
import type { DateRange } from '$domain/value-objects/DateRange';
import type { ProjectStatus } from '$domain/value-objects/ProjectStatus';
import type { ProjectType } from '$domain/value-objects/ProjectType';
import type { MediaAsset } from '$domain/value-objects/MediaAsset';

export class InvalidProjectError extends DomainError {
  readonly code = 'INVALID_PROJECT';
}

export interface ProjectProps {
  slug: ProjectSlug;
  title: string;
  summary: string;
  description: string;
  stack: TechStack;
  status: ProjectStatus;
  type: ProjectType;
  featured: boolean;
  dateRange: DateRange;
  repoUrl?: string | undefined;
  liveUrl?: string | undefined;
  media: readonly MediaAsset[];
  architecture?: string | undefined;
  highlights: readonly string[];
}

export class Project {
  private constructor(private readonly props: Readonly<ProjectProps>) {}

  static create(props: ProjectProps): Result<Project, InvalidProjectError> {
    if (props.title.trim().length === 0) {
      return Result.err(new InvalidProjectError('title is required'));
    }
    if (props.summary.trim().length === 0) {
      return Result.err(new InvalidProjectError('summary is required'));
    }
    if (props.description.trim().length === 0) {
      return Result.err(new InvalidProjectError('description is required'));
    }
    return Result.ok(new Project(Object.freeze({ ...props })));
  }

  get slug(): ProjectSlug {
    return this.props.slug;
  }
  get title(): string {
    return this.props.title;
  }
  get summary(): string {
    return this.props.summary;
  }
  get description(): string {
    return this.props.description;
  }
  get stack(): TechStack {
    return this.props.stack;
  }
  get status(): ProjectStatus {
    return this.props.status;
  }
  get type(): ProjectType {
    return this.props.type;
  }
  get featured(): boolean {
    return this.props.featured;
  }
  get dateRange(): DateRange {
    return this.props.dateRange;
  }
  get repoUrl(): string | undefined {
    return this.props.repoUrl;
  }
  get liveUrl(): string | undefined {
    return this.props.liveUrl;
  }
  get media(): readonly MediaAsset[] {
    return this.props.media;
  }
  get architecture(): string | undefined {
    return this.props.architecture;
  }
  get highlights(): readonly string[] {
    return this.props.highlights;
  }
}
```

- [ ] **Step 5: Run, expect pass**

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat(domain): add Project entity with invariants and ProjectNotFoundError"
```

---

### Task 13: `Experience` and `Skill` entities

**Files:**

- Create: `src/lib/domain/entities/Experience.ts`, `src/lib/domain/entities/Skill.ts`
- Test: `tests/domain/entities/Experience.test.ts`, `Skill.test.ts`

- [ ] **Step 1: Write failing tests for `Experience`**

```ts
// tests/domain/entities/Experience.test.ts
import { describe, it, expect } from 'vitest';
import { Experience } from '$domain/entities/Experience';
import { DateRange } from '$domain/value-objects/DateRange';

const range = DateRange.create(new Date('2025-09-01'), new Date('2026-08-31'));
const baseProps = () => {
  if (!range.ok) throw new Error('setup');
  return {
    company: 'APRR',
    location: 'Saint-Apollinaire',
    role: 'Alternant développeur',
    type: 'alternance' as const,
    dateRange: range.value,
    summary: 'Migration PHP 7→8',
    highlights: ['OIDC', 'Clean Archi'],
  };
};

describe('Experience', () => {
  it('creates a valid experience', () => {
    const r = Experience.create(baseProps());
    expect(r.ok).toBe(true);
  });

  it('rejects empty company', () => {
    const r = Experience.create({ ...baseProps(), company: '' });
    expect(r.ok).toBe(false);
  });

  it('rejects empty role', () => {
    const r = Experience.create({ ...baseProps(), role: '' });
    expect(r.ok).toBe(false);
  });
});
```

- [ ] **Step 2: Implement `Experience`**

```ts
// src/lib/domain/entities/Experience.ts
import { Result } from '$domain/shared/Result';
import { DomainError } from '$domain/errors/DomainError';
import type { DateRange } from '$domain/value-objects/DateRange';

export class InvalidExperienceError extends DomainError {
  readonly code = 'INVALID_EXPERIENCE';
}

export const EXPERIENCE_TYPES = ['alternance', 'stage', 'cdi', 'cdd', 'freelance'] as const;
export type ExperienceType = (typeof EXPERIENCE_TYPES)[number];

export interface ExperienceProps {
  company: string;
  location: string;
  role: string;
  type: ExperienceType;
  dateRange: DateRange;
  summary: string;
  highlights: readonly string[];
}

export class Experience {
  private constructor(private readonly props: Readonly<ExperienceProps>) {}

  static create(props: ExperienceProps): Result<Experience, InvalidExperienceError> {
    if (props.company.trim().length === 0)
      return Result.err(new InvalidExperienceError('company is required'));
    if (props.role.trim().length === 0)
      return Result.err(new InvalidExperienceError('role is required'));
    if (props.summary.trim().length === 0)
      return Result.err(new InvalidExperienceError('summary is required'));
    return Result.ok(new Experience(Object.freeze({ ...props })));
  }

  get company(): string {
    return this.props.company;
  }
  get location(): string {
    return this.props.location;
  }
  get role(): string {
    return this.props.role;
  }
  get type(): ExperienceType {
    return this.props.type;
  }
  get dateRange(): DateRange {
    return this.props.dateRange;
  }
  get summary(): string {
    return this.props.summary;
  }
  get highlights(): readonly string[] {
    return this.props.highlights;
  }
}
```

- [ ] **Step 3: Test and implement `Skill`**

```ts
// tests/domain/entities/Skill.test.ts
import { describe, it, expect } from 'vitest';
import { Skill } from '$domain/entities/Skill';

describe('Skill', () => {
  it('creates a valid skill', () => {
    const r = Skill.create({ name: 'Spring Boot', category: 'framework', level: 'advanced' });
    expect(r.ok).toBe(true);
  });

  it('rejects empty name', () => {
    const r = Skill.create({ name: ' ', category: 'framework', level: 'advanced' });
    expect(r.ok).toBe(false);
  });
});
```

```ts
// src/lib/domain/entities/Skill.ts
import { Result } from '$domain/shared/Result';
import { DomainError } from '$domain/errors/DomainError';

export class InvalidSkillError extends DomainError {
  readonly code = 'INVALID_SKILL';
}

export const SKILL_CATEGORIES = [
  'language',
  'framework',
  'database',
  'devops',
  'design',
  'soft',
] as const;
export type SkillCategory = (typeof SKILL_CATEGORIES)[number];

export const SKILL_LEVELS = ['novice', 'intermediate', 'advanced', 'expert'] as const;
export type SkillLevel = (typeof SKILL_LEVELS)[number];

export interface SkillProps {
  name: string;
  category: SkillCategory;
  level: SkillLevel;
}

export class Skill {
  private constructor(private readonly props: Readonly<SkillProps>) {}

  static create(props: SkillProps): Result<Skill, InvalidSkillError> {
    if (props.name.trim().length === 0)
      return Result.err(new InvalidSkillError('name is required'));
    return Result.ok(new Skill(Object.freeze({ ...props })));
  }

  get name(): string {
    return this.props.name;
  }
  get category(): SkillCategory {
    return this.props.category;
  }
  get level(): SkillLevel {
    return this.props.level;
  }
}
```

- [ ] **Step 4: Run, expect pass; commit**

```bash
pnpm test
git add -A
git commit -m "feat(domain): add Experience and Skill entities with invariants"
```

---

### Task 14: `ContactMessage` entity + `ContactMessageRejectedError`

**Files:**

- Create: `src/lib/domain/entities/ContactMessage.ts`, `src/lib/domain/errors/ContactMessageRejectedError.ts`
- Test: `tests/domain/entities/ContactMessage.test.ts`

- [ ] **Step 1: Test**

```ts
// tests/domain/entities/ContactMessage.test.ts
import { describe, it, expect } from 'vitest';
import { ContactMessage } from '$domain/entities/ContactMessage';
import { Email } from '$domain/value-objects/Email';

const validEmail = () => {
  const r = Email.create('hi@example.com');
  if (!r.ok) throw new Error('setup');
  return r.value;
};

describe('ContactMessage', () => {
  it('creates a valid message', () => {
    const r = ContactMessage.create({
      id: 'uuid-1',
      email: validEmail(),
      name: 'Alice',
      subject: 'Hello',
      message: 'A reasonably long message body.',
      receivedAt: new Date(),
    });
    expect(r.ok).toBe(true);
  });

  it('rejects empty name', () => {
    const r = ContactMessage.create({
      id: 'uuid-2',
      email: validEmail(),
      name: '',
      subject: 'x',
      message: 'message body',
      receivedAt: new Date(),
    });
    expect(r.ok).toBe(false);
  });

  it('rejects message > 5000 chars', () => {
    const long = 'a'.repeat(5001);
    const r = ContactMessage.create({
      id: 'uuid-3',
      email: validEmail(),
      name: 'Bob',
      subject: 'x',
      message: long,
      receivedAt: new Date(),
    });
    expect(r.ok).toBe(false);
  });
});
```

- [ ] **Step 2: Implement error**

```ts
// src/lib/domain/errors/ContactMessageRejectedError.ts
import { DomainError } from './DomainError';

export type ContactMessageRejectedReason =
  | 'invalid-name'
  | 'invalid-subject'
  | 'invalid-message'
  | 'message-too-long'
  | 'rate-limited'
  | 'spam-detected';

export class ContactMessageRejectedError extends DomainError {
  readonly code = 'CONTACT_MESSAGE_REJECTED';
  constructor(
    public readonly reason: ContactMessageRejectedReason,
    message: string,
  ) {
    super(message);
  }
}
```

- [ ] **Step 3: Implement entity**

```ts
// src/lib/domain/entities/ContactMessage.ts
import { Result } from '$domain/shared/Result';
import { ContactMessageRejectedError } from '$domain/errors/ContactMessageRejectedError';
import type { Email } from '$domain/value-objects/Email';

export const MAX_MESSAGE_LENGTH = 5000;
export const MAX_SUBJECT_LENGTH = 200;
export const MAX_NAME_LENGTH = 120;

export interface ContactMessageProps {
  id: string;
  email: Email;
  name: string;
  subject: string;
  message: string;
  receivedAt: Date;
}

export class ContactMessage {
  private constructor(private readonly props: Readonly<ContactMessageProps>) {}

  static create(props: ContactMessageProps): Result<ContactMessage, ContactMessageRejectedError> {
    const name = props.name.trim();
    const subject = props.subject.trim();
    const message = props.message.trim();

    if (name.length === 0 || name.length > MAX_NAME_LENGTH)
      return Result.err(
        new ContactMessageRejectedError('invalid-name', `name must be 1..${MAX_NAME_LENGTH} chars`),
      );
    if (subject.length === 0 || subject.length > MAX_SUBJECT_LENGTH)
      return Result.err(
        new ContactMessageRejectedError(
          'invalid-subject',
          `subject must be 1..${MAX_SUBJECT_LENGTH} chars`,
        ),
      );
    if (message.length === 0)
      return Result.err(new ContactMessageRejectedError('invalid-message', 'message is empty'));
    if (message.length > MAX_MESSAGE_LENGTH)
      return Result.err(
        new ContactMessageRejectedError(
          'message-too-long',
          `message exceeds ${MAX_MESSAGE_LENGTH} chars`,
        ),
      );

    return Result.ok(new ContactMessage(Object.freeze({ ...props, name, subject, message })));
  }

  get id(): string {
    return this.props.id;
  }
  get email(): Email {
    return this.props.email;
  }
  get name(): string {
    return this.props.name;
  }
  get subject(): string {
    return this.props.subject;
  }
  get message(): string {
    return this.props.message;
  }
  get receivedAt(): Date {
    return this.props.receivedAt;
  }
}
```

- [ ] **Step 4: Run, commit**

```bash
pnpm test
git add -A
git commit -m "feat(domain): add ContactMessage entity with length and rate-limit invariants"
```

> 🛑 **CHECKPOINT (end of Phase 1):** all domain tests green, coverage ≥ 95% on `src/lib/domain/`. Run `pnpm test:coverage` and verify.

---

## Phase 2 — Application Layer

### Task 15: Ports (interfaces)

**Files:**

- Create: `src/lib/application/ports/ProjectRepository.ts`, `ExperienceRepository.ts`, `SkillRepository.ts`, `ContactMessageRepository.ts`, `EmailService.ts`, `Clock.ts`

- [ ] **Step 1: Define each port**

```ts
// src/lib/application/ports/Clock.ts
export interface Clock {
  now(): Date;
}
```

```ts
// src/lib/application/ports/ProjectRepository.ts
import type { Project } from '$domain/entities/Project';
import type { ProjectSlug } from '$domain/value-objects/ProjectSlug';
import type { Result } from '$domain/shared/Result';
import type { ProjectNotFoundError } from '$domain/errors/ProjectNotFoundError';
import type { DomainError } from '$domain/errors/DomainError';

export interface ProjectRepository {
  findAll(): Promise<Result<readonly Project[], DomainError>>;
  findFeatured(): Promise<Result<readonly Project[], DomainError>>;
  findBySlug(slug: ProjectSlug): Promise<Result<Project, ProjectNotFoundError | DomainError>>;
}
```

```ts
// src/lib/application/ports/ExperienceRepository.ts
import type { Experience } from '$domain/entities/Experience';
import type { Result } from '$domain/shared/Result';
import type { DomainError } from '$domain/errors/DomainError';

export interface ExperienceRepository {
  findAll(): Promise<Result<readonly Experience[], DomainError>>;
}
```

```ts
// src/lib/application/ports/SkillRepository.ts
import type { Skill } from '$domain/entities/Skill';
import type { Result } from '$domain/shared/Result';
import type { DomainError } from '$domain/errors/DomainError';

export interface SkillRepository {
  findAll(): Promise<Result<readonly Skill[], DomainError>>;
}
```

```ts
// src/lib/application/ports/ContactMessageRepository.ts
import type { ContactMessage } from '$domain/entities/ContactMessage';
import type { Result } from '$domain/shared/Result';
import type { DomainError } from '$domain/errors/DomainError';

export interface ContactMessageRepository {
  save(message: ContactMessage): Promise<Result<void, DomainError>>;
  countRecentByIpHash(ipHash: string, since: Date): Promise<Result<number, DomainError>>;
  markEmailSent(id: string): Promise<Result<void, DomainError>>;
}
```

```ts
// src/lib/application/ports/EmailService.ts
import type { Result } from '$domain/shared/Result';
import type { DomainError } from '$domain/errors/DomainError';

export interface ContactNotificationPayload {
  fromEmail: string;
  fromName: string;
  subject: string;
  message: string;
  receivedAt: Date;
}

export interface EmailService {
  sendContactNotification(payload: ContactNotificationPayload): Promise<Result<void, DomainError>>;
}
```

- [ ] **Step 2: Verify type-check**

```bash
pnpm check
```

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat(application): add repository, email and clock ports"
```

---

### Task 16: In-memory fakes (test doubles)

**Files:**

- Create: `tests/fakes/InMemoryProjectRepository.ts`, `InMemoryExperienceRepository.ts`, `InMemorySkillRepository.ts`, `InMemoryContactMessageRepository.ts`, `FakeEmailService.ts`, `FixedClock.ts`

- [ ] **Step 1: Implement `InMemoryProjectRepository`**

```ts
// tests/fakes/InMemoryProjectRepository.ts
import type { ProjectRepository } from '$application/ports/ProjectRepository';
import type { Project } from '$domain/entities/Project';
import type { ProjectSlug } from '$domain/value-objects/ProjectSlug';
import { Result } from '$domain/shared/Result';
import { ProjectNotFoundError } from '$domain/errors/ProjectNotFoundError';
import type { DomainError } from '$domain/errors/DomainError';

export class InMemoryProjectRepository implements ProjectRepository {
  constructor(private projects: readonly Project[] = []) {}

  setProjects(projects: readonly Project[]): void {
    this.projects = projects;
  }

  async findAll() {
    return Result.ok<readonly Project[], DomainError>(this.projects);
  }

  async findFeatured() {
    return Result.ok<readonly Project[], DomainError>(this.projects.filter((p) => p.featured));
  }

  async findBySlug(slug: ProjectSlug) {
    const found = this.projects.find((p) => p.slug.equals(slug));
    if (!found)
      return Result.err<Project, ProjectNotFoundError | DomainError>(
        new ProjectNotFoundError(slug.toString()),
      );
    return Result.ok<Project, ProjectNotFoundError | DomainError>(found);
  }
}
```

- [ ] **Step 2: Implement other fakes**

```ts
// tests/fakes/InMemoryExperienceRepository.ts
import type { ExperienceRepository } from '$application/ports/ExperienceRepository';
import type { Experience } from '$domain/entities/Experience';
import { Result } from '$domain/shared/Result';
import type { DomainError } from '$domain/errors/DomainError';

export class InMemoryExperienceRepository implements ExperienceRepository {
  constructor(private items: readonly Experience[] = []) {}
  setItems(items: readonly Experience[]) {
    this.items = items;
  }
  async findAll() {
    return Result.ok<readonly Experience[], DomainError>(this.items);
  }
}
```

```ts
// tests/fakes/InMemorySkillRepository.ts
import type { SkillRepository } from '$application/ports/SkillRepository';
import type { Skill } from '$domain/entities/Skill';
import { Result } from '$domain/shared/Result';
import type { DomainError } from '$domain/errors/DomainError';

export class InMemorySkillRepository implements SkillRepository {
  constructor(private items: readonly Skill[] = []) {}
  setItems(items: readonly Skill[]) {
    this.items = items;
  }
  async findAll() {
    return Result.ok<readonly Skill[], DomainError>(this.items);
  }
}
```

```ts
// tests/fakes/InMemoryContactMessageRepository.ts
import type { ContactMessageRepository } from '$application/ports/ContactMessageRepository';
import type { ContactMessage } from '$domain/entities/ContactMessage';
import { Result } from '$domain/shared/Result';
import type { DomainError } from '$domain/errors/DomainError';

export class InMemoryContactMessageRepository implements ContactMessageRepository {
  public saved: ContactMessage[] = [];
  public emailSent: Set<string> = new Set();
  public recentCounts: Map<string, number> = new Map();

  async save(message: ContactMessage) {
    this.saved.push(message);
    return Result.ok<void, DomainError>(undefined);
  }
  async countRecentByIpHash(ipHash: string, _since: Date) {
    return Result.ok<number, DomainError>(this.recentCounts.get(ipHash) ?? 0);
  }
  async markEmailSent(id: string) {
    this.emailSent.add(id);
    return Result.ok<void, DomainError>(undefined);
  }
}
```

```ts
// tests/fakes/FakeEmailService.ts
import type { EmailService, ContactNotificationPayload } from '$application/ports/EmailService';
import { Result } from '$domain/shared/Result';
import type { DomainError } from '$domain/errors/DomainError';

export class FakeEmailService implements EmailService {
  public sent: ContactNotificationPayload[] = [];
  public shouldFail = false;
  async sendContactNotification(payload: ContactNotificationPayload) {
    if (this.shouldFail) {
      return Result.err<void, DomainError>(
        new (class extends Error {
          code = 'EMAIL_FAILED';
        })('email failed') as unknown as DomainError,
      );
    }
    this.sent.push(payload);
    return Result.ok<void, DomainError>(undefined);
  }
}
```

```ts
// tests/fakes/FixedClock.ts
import type { Clock } from '$application/ports/Clock';

export class FixedClock implements Clock {
  constructor(private current: Date) {}
  now(): Date {
    return new Date(this.current);
  }
  set(d: Date): void {
    this.current = d;
  }
}
```

- [ ] **Step 3: Type-check; commit**

```bash
pnpm check
git add -A
git commit -m "test(fakes): add in-memory test doubles for repositories, email, and clock"
```

---

### Task 17: `ListProjects` use case

**Files:**

- Create: `src/lib/application/use-cases/ListProjects.ts`
- Test: `tests/application/use-cases/ListProjects.test.ts`

- [ ] **Step 1: Test**

```ts
// tests/application/use-cases/ListProjects.test.ts
import { describe, it, expect } from 'vitest';
import { createListProjects } from '$application/use-cases/ListProjects';
import { InMemoryProjectRepository } from '../../fakes/InMemoryProjectRepository';
import { Project } from '$domain/entities/Project';
import { ProjectSlug } from '$domain/value-objects/ProjectSlug';
import { TechStack } from '$domain/value-objects/TechStack';
import { DateRange } from '$domain/value-objects/DateRange';

function buildProject(slug: string, featured = false): Project {
  const slugVO = ProjectSlug.create(slug);
  const stack = TechStack.create(['ts']);
  const range = DateRange.create(new Date('2024-01-01'), undefined);
  if (!slugVO.ok || !stack.ok || !range.ok) throw new Error('setup');
  const r = Project.create({
    slug: slugVO.value,
    title: slug,
    summary: 'sum',
    description: 'desc',
    stack: stack.value,
    status: 'finished',
    type: 'personal',
    featured,
    dateRange: range.value,
    repoUrl: undefined,
    liveUrl: undefined,
    media: [],
    architecture: undefined,
    highlights: [],
  });
  if (!r.ok) throw new Error('build failed');
  return r.value;
}

describe('ListProjects', () => {
  it('returns all projects', async () => {
    const repo = new InMemoryProjectRepository([buildProject('a'), buildProject('b', true)]);
    const useCase = createListProjects({ projectRepository: repo });
    const r = await useCase({});
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.length).toBe(2);
  });

  it('returns only featured when featured: true', async () => {
    const repo = new InMemoryProjectRepository([buildProject('a'), buildProject('b', true)]);
    const useCase = createListProjects({ projectRepository: repo });
    const r = await useCase({ featured: true });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.value.length).toBe(1);
      expect(r.value[0]?.slug.toString()).toBe('b');
    }
  });
});
```

- [ ] **Step 2: Implement**

```ts
// src/lib/application/use-cases/ListProjects.ts
import type { ProjectRepository } from '$application/ports/ProjectRepository';
import type { Project } from '$domain/entities/Project';
import type { Result } from '$domain/shared/Result';
import type { DomainError } from '$domain/errors/DomainError';

export interface ListProjectsDeps {
  projectRepository: ProjectRepository;
}

export interface ListProjectsInput {
  featured?: boolean;
}

export type ListProjects = (
  input: ListProjectsInput,
) => Promise<Result<readonly Project[], DomainError>>;

export function createListProjects({ projectRepository }: ListProjectsDeps): ListProjects {
  return async (input) => {
    if (input.featured) return projectRepository.findFeatured();
    return projectRepository.findAll();
  };
}
```

- [ ] **Step 3: Run, commit**

```bash
pnpm test
git add -A
git commit -m "feat(application): add ListProjects use case"
```

---

### Task 18: `GetProjectBySlug` use case

**Files:**

- Create: `src/lib/application/use-cases/GetProjectBySlug.ts`
- Test: `tests/application/use-cases/GetProjectBySlug.test.ts`

- [ ] **Step 1: Test**

```ts
// tests/application/use-cases/GetProjectBySlug.test.ts
import { describe, it, expect } from 'vitest';
import { createGetProjectBySlug } from '$application/use-cases/GetProjectBySlug';
import { InMemoryProjectRepository } from '../../fakes/InMemoryProjectRepository';
import { ProjectNotFoundError } from '$domain/errors/ProjectNotFoundError';
import { InvalidProjectSlugError } from '$domain/errors/InvalidProjectSlugError';

describe('GetProjectBySlug', () => {
  it('returns InvalidProjectSlugError for malformed slug', async () => {
    const repo = new InMemoryProjectRepository([]);
    const useCase = createGetProjectBySlug({ projectRepository: repo });
    const r = await useCase({ slug: 'BadSlug!' });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toBeInstanceOf(InvalidProjectSlugError);
  });

  it('returns ProjectNotFoundError when slug valid but missing', async () => {
    const repo = new InMemoryProjectRepository([]);
    const useCase = createGetProjectBySlug({ projectRepository: repo });
    const r = await useCase({ slug: 'missing' });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toBeInstanceOf(ProjectNotFoundError);
  });
});
```

- [ ] **Step 2: Implement**

```ts
// src/lib/application/use-cases/GetProjectBySlug.ts
import type { ProjectRepository } from '$application/ports/ProjectRepository';
import { ProjectSlug } from '$domain/value-objects/ProjectSlug';
import type { Project } from '$domain/entities/Project';
import { Result } from '$domain/shared/Result';
import type { ProjectNotFoundError } from '$domain/errors/ProjectNotFoundError';
import type { InvalidProjectSlugError } from '$domain/errors/InvalidProjectSlugError';
import type { DomainError } from '$domain/errors/DomainError';

export interface GetProjectBySlugDeps {
  projectRepository: ProjectRepository;
}

export interface GetProjectBySlugInput {
  slug: string;
}

export type GetProjectBySlug = (
  input: GetProjectBySlugInput,
) => Promise<Result<Project, ProjectNotFoundError | InvalidProjectSlugError | DomainError>>;

export function createGetProjectBySlug({
  projectRepository,
}: GetProjectBySlugDeps): GetProjectBySlug {
  return async ({ slug }) => {
    const slugVO = ProjectSlug.create(slug);
    if (!slugVO.ok) return Result.err(slugVO.error);
    return projectRepository.findBySlug(slugVO.value);
  };
}
```

- [ ] **Step 3: Run, commit**

```bash
pnpm test
git add -A
git commit -m "feat(application): add GetProjectBySlug use case"
```

---

### Task 19: `ListExperiences` and `ListSkills`

**Files:**

- Create: `src/lib/application/use-cases/ListExperiences.ts`, `ListSkills.ts`
- Test: `tests/application/use-cases/ListExperiences.test.ts`, `ListSkills.test.ts`

- [ ] **Step 1: Test + implement `ListExperiences`**

```ts
// tests/application/use-cases/ListExperiences.test.ts
import { describe, it, expect } from 'vitest';
import { createListExperiences } from '$application/use-cases/ListExperiences';
import { InMemoryExperienceRepository } from '../../fakes/InMemoryExperienceRepository';

describe('ListExperiences', () => {
  it('returns empty list when none', async () => {
    const repo = new InMemoryExperienceRepository();
    const useCase = createListExperiences({ experienceRepository: repo });
    const r = await useCase();
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value).toEqual([]);
  });
});
```

```ts
// src/lib/application/use-cases/ListExperiences.ts
import type { ExperienceRepository } from '$application/ports/ExperienceRepository';
import type { Experience } from '$domain/entities/Experience';
import type { Result } from '$domain/shared/Result';
import type { DomainError } from '$domain/errors/DomainError';

export interface ListExperiencesDeps {
  experienceRepository: ExperienceRepository;
}

export type ListExperiences = () => Promise<Result<readonly Experience[], DomainError>>;

export function createListExperiences({
  experienceRepository,
}: ListExperiencesDeps): ListExperiences {
  return async () => experienceRepository.findAll();
}
```

- [ ] **Step 2: Same for `ListSkills`**

```ts
// tests/application/use-cases/ListSkills.test.ts
import { describe, it, expect } from 'vitest';
import { createListSkills } from '$application/use-cases/ListSkills';
import { InMemorySkillRepository } from '../../fakes/InMemorySkillRepository';

describe('ListSkills', () => {
  it('returns empty list when none', async () => {
    const useCase = createListSkills({ skillRepository: new InMemorySkillRepository() });
    const r = await useCase();
    expect(r.ok).toBe(true);
  });
});
```

```ts
// src/lib/application/use-cases/ListSkills.ts
import type { SkillRepository } from '$application/ports/SkillRepository';
import type { Skill } from '$domain/entities/Skill';
import type { Result } from '$domain/shared/Result';
import type { DomainError } from '$domain/errors/DomainError';

export interface ListSkillsDeps {
  skillRepository: SkillRepository;
}
export type ListSkills = () => Promise<Result<readonly Skill[], DomainError>>;

export function createListSkills({ skillRepository }: ListSkillsDeps): ListSkills {
  return async () => skillRepository.findAll();
}
```

- [ ] **Step 3: Run, commit**

```bash
pnpm test
git add -A
git commit -m "feat(application): add ListExperiences and ListSkills use cases"
```

---

### Task 20: `SubmitContactMessage` use case

**Files:**

- Create: `src/lib/application/use-cases/SubmitContactMessage.ts`
- Test: `tests/application/use-cases/SubmitContactMessage.test.ts`

- [ ] **Step 1: Test (the most complex use case — covers happy path, validation, rate limit, email failure)**

```ts
// tests/application/use-cases/SubmitContactMessage.test.ts
import { describe, it, expect } from 'vitest';
import { createSubmitContactMessage } from '$application/use-cases/SubmitContactMessage';
import { InMemoryContactMessageRepository } from '../../fakes/InMemoryContactMessageRepository';
import { FakeEmailService } from '../../fakes/FakeEmailService';
import { FixedClock } from '../../fakes/FixedClock';
import { ContactMessageRejectedError } from '$domain/errors/ContactMessageRejectedError';
import { InvalidEmailError } from '$domain/errors/InvalidEmailError';

const setup = () => ({
  contactRepository: new InMemoryContactMessageRepository(),
  emailService: new FakeEmailService(),
  clock: new FixedClock(new Date('2026-05-04T10:00:00Z')),
});

const validInput = (
  overrides: Partial<{
    email: string;
    name: string;
    subject: string;
    message: string;
    ipHash: string;
  }> = {},
) => ({
  email: 'user@example.com',
  name: 'Alice',
  subject: 'Hello',
  message: 'A reasonably long message body.',
  ipHash: 'hash-1',
  ...overrides,
});

describe('SubmitContactMessage', () => {
  it('saves message and sends email on happy path', async () => {
    const deps = setup();
    const useCase = createSubmitContactMessage(deps);
    const r = await useCase(validInput());
    expect(r.ok).toBe(true);
    expect(deps.contactRepository.saved.length).toBe(1);
    expect(deps.emailService.sent.length).toBe(1);
  });

  it('rejects invalid email', async () => {
    const deps = setup();
    const useCase = createSubmitContactMessage(deps);
    const r = await useCase(validInput({ email: 'not-an-email' }));
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toBeInstanceOf(InvalidEmailError);
  });

  it('rejects when rate limited', async () => {
    const deps = setup();
    deps.contactRepository.recentCounts.set('hash-1', 5);
    const useCase = createSubmitContactMessage(deps);
    const r = await useCase(validInput());
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.error).toBeInstanceOf(ContactMessageRejectedError);
      expect((r.error as ContactMessageRejectedError).reason).toBe('rate-limited');
    }
  });

  it('still saves when email fails (degraded mode)', async () => {
    const deps = setup();
    deps.emailService.shouldFail = true;
    const useCase = createSubmitContactMessage(deps);
    const r = await useCase(validInput());
    expect(deps.contactRepository.saved.length).toBe(1);
    // Strategy: succeed at the use-case level (message saved), surface email failure separately via flag.
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.emailDelivered).toBe(false);
  });
});
```

- [ ] **Step 2: Implement**

```ts
// src/lib/application/use-cases/SubmitContactMessage.ts
import type { ContactMessageRepository } from '$application/ports/ContactMessageRepository';
import type { EmailService } from '$application/ports/EmailService';
import type { Clock } from '$application/ports/Clock';
import { ContactMessage } from '$domain/entities/ContactMessage';
import { Email } from '$domain/value-objects/Email';
import { Result } from '$domain/shared/Result';
import { ContactMessageRejectedError } from '$domain/errors/ContactMessageRejectedError';
import type { InvalidEmailError } from '$domain/errors/InvalidEmailError';
import type { DomainError } from '$domain/errors/DomainError';

export const RATE_LIMIT_MAX = 5;
export const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;

export interface SubmitContactMessageDeps {
  contactRepository: ContactMessageRepository;
  emailService: EmailService;
  clock: Clock;
  idGenerator?: () => string;
}

export interface SubmitContactMessageInput {
  email: string;
  name: string;
  subject: string;
  message: string;
  ipHash: string;
}

export interface SubmitContactMessageOutput {
  id: string;
  emailDelivered: boolean;
}

export type SubmitContactMessage = (
  input: SubmitContactMessageInput,
) => Promise<
  Result<SubmitContactMessageOutput, ContactMessageRejectedError | InvalidEmailError | DomainError>
>;

const defaultIdGenerator = (): string =>
  globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;

export function createSubmitContactMessage({
  contactRepository,
  emailService,
  clock,
  idGenerator = defaultIdGenerator,
}: SubmitContactMessageDeps): SubmitContactMessage {
  return async (input) => {
    const now = clock.now();
    const since = new Date(now.getTime() - RATE_LIMIT_WINDOW_MS);
    const countResult = await contactRepository.countRecentByIpHash(input.ipHash, since);
    if (!countResult.ok) return Result.err(countResult.error);
    if (countResult.value >= RATE_LIMIT_MAX) {
      return Result.err(
        new ContactMessageRejectedError('rate-limited', 'Too many messages, retry later'),
      );
    }

    const emailVO = Email.create(input.email);
    if (!emailVO.ok) return Result.err(emailVO.error);

    const message = ContactMessage.create({
      id: idGenerator(),
      email: emailVO.value,
      name: input.name,
      subject: input.subject,
      message: input.message,
      receivedAt: now,
    });
    if (!message.ok) return Result.err(message.error);

    const saved = await contactRepository.save(message.value);
    if (!saved.ok) return Result.err(saved.error);

    const notification = await emailService.sendContactNotification({
      fromEmail: emailVO.value.toString(),
      fromName: input.name,
      subject: input.subject,
      message: input.message,
      receivedAt: now,
    });

    let emailDelivered = false;
    if (notification.ok) {
      emailDelivered = true;
      await contactRepository.markEmailSent(message.value.id);
    }

    return Result.ok({ id: message.value.id, emailDelivered });
  };
}
```

- [ ] **Step 3: Run, commit**

```bash
pnpm test
git add -A
git commit -m "feat(application): add SubmitContactMessage with rate limiting and email fallback"
```

> 🛑 **CHECKPOINT (end of Phase 2):** all use cases tested, no infrastructure dependencies leaking into application layer.

---

> **The plan continues in `docs/superpowers/plans/2026-05-04-portfolio-implementation-part2.md`** — Phases 3 through 10 (infrastructure adapters, composition root, design system, pages, content, polish, deployment) will be appended in a follow-up file to keep each file readable. The structure and TDD discipline remain identical.

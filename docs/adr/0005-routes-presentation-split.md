# ADR 0005 — Découpage entre `routes/` et la couche présentation

**Statut :** Accepté
**Date :** 2026-05-04

## Contexte

SvelteKit impose un répertoire `src/routes/` pour le routage par système de fichiers — le
framework lit le filesystem pour décider quelle URL correspond à quelle page. Conceptuellement,
ce répertoire fait partie de la **couche présentation**, mais le reste de cette couche
(view-models, mappers domaine→VM, orchestration au niveau des pages) vit dans
`src/lib/presentation/`. Une lecture stricte de la Clean Architecture interdirait du code
spécifique au framework dans la couche présentation ; en pratique, SvelteKit ne laisse pas
d'échappatoire.

## Décision

Considérer la couche présentation comme **physiquement scindée** entre deux répertoires :

- `src/lib/presentation/` — logique réutilisable, indépendante du framework : view-models,
  mappers, orchestrateurs de pages. Importable, testable en isolation, sans imports SvelteKit.
- `src/routes/` — contrôleurs de pages spécifiques à SvelteKit (`+page.server.ts`) et composants
  (`+page.svelte`), imposés par la convention de routage par filesystem.

Les fichiers `+page.server.ts` restent **fins** : récupérer les dépendances depuis le composition
root, déléguer aux use cases, mapper les résultats en view-models, renvoyer la charge utile
JSON-sérialisable. Aucune logique métier dans les routes.

## Conséquences

- Pour : pragmatique — on travaille avec le framework plutôt que contre lui. Les routes sont
  petites et prévisibles ; un nouveau contributeur peut naviguer dans le code sans surprise.
- Pour : `lib/presentation/` reste réutilisable si le projet migrait un jour vers un autre
  framework (par ex. Astro), puisque aucune logique d'orchestration ne dépend de primitives
  SvelteKit.
- Pour : les tests se concentrent sur `lib/presentation/` ; les fichiers de `routes/` sont
  assez fins pour que des tests d'intégration suffisent à les couvrir.
- Contre : une lecture stricte de la Clean Architecture exigerait zéro code de framework dans
  la couche présentation. On accepte ce compromis comme une documentation honnête de la
  réalité, pas comme une dette cachée.
- Rejeté : des fichiers `routes/` qui ne feraient que ré-exporter depuis `lib/presentation/pages/...`
  — ajoute deux fichiers par page sans bénéfice réel, nuit à la lisibilité, et masque le
  couplage au framework au lieu de l'assumer.

Voir l'ADR 0001 pour le contexte plus large de Clean Architecture.

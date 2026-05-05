# ADR 0001 — Clean Architecture

**Statut :** Accepté
**Date :** 2026-05-04

## Contexte

Ce portfolio appartient à Yohan Finelle, étudiant en BUT Informatique qui souhaite démontrer
une **rigueur architecturale** auprès des recruteurs et des écoles d'ingénieurs (cycle ingénieur).
Stricto sensu, un site CV de 5 pages est suffisamment petit pour qu'une « Clean Architecture »
soit du sur-dimensionnement — mais ici, le portfolio est lui-même la démonstration. La structure
doit être lisible au premier coup d'œil par quelqu'un qui parcourt le dépôt lors d'une admission
ou d'un recrutement.

## Décision

Appliquer une Clean Architecture à 4 couches dans `src/lib/` :

- `domain/` — entités, value-objects, erreurs et le type `Result`. Aucun import de framework.
- `application/` — use cases et ports (interfaces) dont la couche domaine a besoin.
- `infrastructure/` — adaptateurs concrets : markdown sur le système de fichiers.
- `presentation/` — view-models et mappers qui transforment les entités du domaine en charges
  utiles JSON pour les loaders SvelteKit.

`src/routes/` est traité comme une **extension** de la couche présentation (routage par
système de fichiers imposé par SvelteKit, voir ADR 0005). Les dépendances pointent toujours
vers l'intérieur. Les use cases n'importent jamais l'infrastructure ni les routes. Le
composition root (`src/lib/composition-root.ts`) câble les implémentations concrètes.

## Conséquences

- Pour : frontières claires, use cases testables (fakes en mémoire), les recruteurs perçoivent
  immédiatement la rigueur académique.
- Pour : remplacer une infrastructure (par ex. markdown → API headless) ne touche qu'une seule
  couche.
- Contre : plus de fichiers qu'une application SvelteKit « naïve ». Les view-models et mappers
  ajoutent un niveau d'indirection qu'un CV de 2 pages ignorerait.
- Rejeté : structure plate (tout dans `src/lib/`) — rendrait la logique métier invisible et
  irait à l'encontre de l'objectif énoncé.
- Rejeté : découpage en 3 couches (sans présentation) — les view-models sont nécessaires car
  SvelteKit sérialise en JSON les valeurs renvoyées par les loaders ; les classes (`Project`,
  `DateRange`) ne survivent pas à l'aller-retour JSON.

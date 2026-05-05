# ADR 0004 — Result<T, E> plutôt que les exceptions

**Statut :** Accepté
**Date :** 2026-05-04

## Contexte

Les couches domaine et application doivent traiter de manière cohérente les cas d'échec :
projet introuvable par son slug, frontmatter markdown malformé, erreurs de lecture du système
de fichiers. Trois options idiomatiques en TypeScript :

- (a) Lever des exceptions et laisser `try/catch` les propager.
- (b) Renvoyer une union discriminée `Result<T, E>` (programmation orientée railway).
- (c) Renvoyer `T | null` / `T | undefined` sans contexte d'erreur.

Le domaine doit rester pur (aucun import de framework), et les recruteurs qui relisent le code
doivent voir un traitement d'erreurs explicite et vérifié par le typage.

## Décision

`Result<T, E>` vit dans `src/lib/domain/shared/Result.ts`, avec `map` / `flatMap` pour le
chaînage. Chaque fabrique du domaine et chaque use case renvoie `Result<Success, DomainError>`.
Les adaptateurs d'infrastructure capturent les exceptions externes (lecture filesystem, parsing)
et les convertissent en `Result.err` à la frontière. L'union `DomainError` est définie par use
case, ce qui permet à TypeScript de réduire exhaustivement au point d'appel.

## Conséquences

- Pour : les erreurs sont des valeurs, vérifiées par le typage de bout en bout. TypeScript
  infère l'union d'erreurs par use case ; oublier une branche devient une erreur de compilation.
- Pour : impose un traitement explicite — pas d'exceptions silencieusement avalées, pas de 500
  surprises en production.
- Pour : composable via `map` / `flatMap`. Démontré par 7 tests de lois algébriques dans
  `Result.test.ts` (identité, associativité, etc.).
- Pour : s'accorde naturellement avec la frontière de la Clean Architecture — l'infrastructure
  fait la traduction exception/Result, le reste du code reste pur.
- Contre : plus verbeux que `try/catch`. Chaque appel chaîné nécessite un
  `if (!r.ok) return Result.err(...)` ou un `flatMap`.
- Contre : exige de la discipline à la frontière du framework. Les loaders SvelteKit
  s'attendent à des exceptions ; on convertit `Result.err` en `error()`/`fail()` explicitement.
- Rejeté : exceptions (option a) — propagation silencieuse, faciles à oublier, contournent le
  système de types.
- Rejeté : retour `null` (option c) — efface l'information d'erreur ; l'appelant ne peut pas
  distinguer un projet absent d'un fichier malformé ou d'un disque indisponible.

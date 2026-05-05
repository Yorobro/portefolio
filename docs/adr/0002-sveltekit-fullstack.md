# ADR 0002 — SvelteKit fullstack avec adapter-node

**Statut :** Remplacé par [ADR 0006](./0006-passage-adapter-static.md)
**Date :** 2026-05-04

> Cet ADR est conservé pour traçabilité historique. Le formulaire de contact a été retiré
> et l'application est désormais entièrement statique (voir ADR 0006).

## Contexte

La stack professionnelle de Yohan est Java/Spring + Angular. Pour le portfolio, il a souhaité
utiliser Svelte et Node.js pour démontrer une polyvalence au-delà de ses outils du quotidien.
Trois options étaient sur la table :

- (a) Un site SSG markdown statique (par ex. Astro/Eleventy générant du HTML statique).
- (b) Un monorepo avec SvelteKit côté frontend et une API Node séparée côté backend.
- (c) SvelteKit fullstack via `adapter-node`.

Contraintes : devoir inclure un formulaire de contact fonctionnel (vraie logique côté serveur,
pas un proxy de type Formspree), démontrer TypeScript de bout en bout, garder le déploiement
simple pour un développeur seul.

## Décision

SvelteKit avec `adapter-node`. Les pages sont rendues côté serveur (SSR) : `+page.server.ts`
s'exécute sur Node, `+page.svelte` s'exécute à la fois côté serveur (HTML initial) et côté
client (hydratation). Les form actions traitent le formulaire de contact côté serveur, en
renvoyant des charges utiles mappées via `Result` à travers `fail()`.

## Conséquences

- Pour : un seul dépôt, un seul artefact de déploiement, SSR pour le SEO et la performance
  perçue.
- Pour : permet de garder un seul modèle mental — pas de frontière API/client à concevoir
  pour un petit site.
- Pour : le formulaire de contact devient une vraie démonstration de TypeScript côté serveur,
  avec une gestion d'erreurs en mode railway via `Result` (voir ADR 0004) plutôt qu'un proxy
  SaaS externe.
- Pour : amélioration progressive — le formulaire fonctionne sans JavaScript grâce aux form
  actions SvelteKit.
- Contre : nécessite un runtime Node.js en production (pas d'hébergement purement statique).
  Pas un vrai inconvénient compte tenu de l'exigence du formulaire.
- Rejeté : SSG (option a) — ne pouvait pas héberger une vraie form action.
- Rejeté : monorepo avec API séparée (option b) — sur-dimensionné pour un site de 5 pages.

## Suite

Le formulaire de contact a finalement été retiré du périmètre. L'argument central de cet ADR
disparaît avec lui. Voir [ADR 0006](./0006-passage-adapter-static.md) pour la décision de
migrer vers `adapter-static`.

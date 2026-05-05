# ADR 0006 — Passage à adapter-static après retrait du formulaire

**Statut :** Accepté
**Date :** 2026-05-05
**Remplace :** [ADR 0002](./0002-sveltekit-fullstack.md)

## Contexte

L'ADR 0002 avait acté SvelteKit avec `adapter-node` pour pouvoir héberger un formulaire de
contact côté serveur (logique réelle, rate-limiting, envoi d'email transactionnel via Resend,
journalisation des messages dans SQLite). Cette contrainte — « avoir un vrai backend » —
était l'argument structurant de la décision.

Le formulaire de contact a finalement été retiré du périmètre du portfolio : le contact se fait
désormais directement via les coordonnées affichées (téléphone, email, lien `mailto:`). Plus
aucune écriture côté serveur n'est nécessaire. Les seules données dynamiques restantes — projets,
expériences, compétences — proviennent de fichiers markdown statiques chargés au build.

Trois options ont été évaluées :

- (a) Garder `adapter-node` malgré tout, en SSR sans formulaire.
- (b) Passer à `adapter-static` et prerender l'intégralité du site.
- (c) Garder `adapter-node` et ajouter à terme une nouvelle feature dynamique pour justifier
  le runtime serveur.

## Décision

Migration vers `@sveltejs/adapter-static` avec `prerender = true` au niveau du layout racine.
Toutes les pages — accueil, projets (liste et détail), parcours, compétences, ainsi que le
sitemap — sont générées en HTML statique au build. Le sitemap devient un endpoint
`+server.ts` également prerendered.

Conséquences directes sur l'arborescence :

- Suppression de la couche infrastructure liée au formulaire :
  `infrastructure/email/`, `infrastructure/persistence/sqlite/`, `infrastructure/clock/`.
- Suppression des entités et value-objects associés : `ContactMessage`, `Email`,
  `ContactMessageRejectedError`, `InvalidEmailError`.
- Suppression du use case `SubmitContactMessage` et de ses ports
  (`ContactMessageRepository`, `EmailService`, `Clock`).
- Suppression des dépendances runtime devenues mortes : `better-sqlite3`, `drizzle-orm`,
  `drizzle-kit`, `resend`, `uuid`.
- Réduction du composition root aux quatre use cases de lecture restants.
- Réduction des variables d'environnement à `PUBLIC_SITE_URL` et `CONTENT_DIR`.

## Conséquences

- Pour : surface d'attaque côté serveur réduite à zéro — le site est servi comme des fichiers
  statiques.
- Pour : hébergement gratuit sur les plateformes statiques standards (Cloudflare Pages,
  GitHub Pages, Netlify) ou simple `nginx` sur un VPS, sans runtime Node à monitorer.
- Pour : le code restant gagne en cohérence narrative — Clean Architecture sur du contenu
  markdown statique, sans poids mort.
- Pour : performance et score Lighthouse améliorés, prerender natif.
- Contre : on perd la démonstration explicite « j'ai écrit du Node côté serveur ». La
  démonstration fullstack passe désormais par la rigueur du code et l'architecture, plus par
  la présence d'un runtime.
- Contre : l'historique de l'ADR 0002 garde la trace d'un revirement — c'est assumé et
  documenté plutôt que réécrit.

## Note historique

Le code lié au formulaire (Result + railway-oriented sur du serveur, hash IP avec sel,
rate-limiting, envoi d'email transactionnel) reste consultable dans l'historique git pour
quiconque veut juger ce travail. L'ADR 0004 sur `Result<T, E>` reste pleinement valide : le
pattern est toujours utilisé par les use cases de lecture restants (`ListProjects`,
`GetProjectBySlug`, `ListExperiences`, `ListSkills`).

# ADR 0003 — Contenu en markdown plutôt que CMS ou base de données

**Statut :** Accepté
**Date :** 2026-05-04

## Contexte

Le portfolio doit stocker des descriptions de projets, des expériences professionnelles et
un catalogue de compétences. Le contenu évolue ponctuellement (un nouveau projet, un nouveau
stage) mais pas à haute fréquence. Trois options :

- (a) Fichiers markdown dans `content/` avec frontmatter YAML, parsés au build ou à la requête.
- (b) Un CMS headless (Contentful, Sanity, Strapi).
- (c) Lignes en base SQLite ou PostgreSQL avec une UI d'administration.

Le portfolio est aussi le dépôt de travail du développeur — le workflow de contenu ne doit pas
distraire de la démonstration de qualité de code.

## Décision

Fichiers markdown avec frontmatter YAML, validés par des schémas Zod, parsés par `gray-matter`
et `remark`. Les fichiers vivent dans `content/projects/`, `content/experiences/` et
`content/skills/`. Yohan les édite directement avec n'importe quel éditeur de texte. Le
frontmatter est parsé en entités du domaine via un adaptateur filesystem qui implémente les
ports de repository définis dans `application/`.

## Conséquences

- Pour : tout le portfolio — y compris son contenu — vit dans l'historique git. Pas d'état
  externe, pas d'abonnement CMS, pas d'UI d'administration à construire et maintenir.
- Pour : modifier le contenu, c'est juste ouvrir un fichier `.md`. Les pull requests peuvent
  relire les changements de contenu.
- Pour : les schémas Zod du frontmatter détectent un contenu mal formé au build, avant qu'il
  n'atteigne une page.
- Pour : l'adaptateur markdown est une démonstration propre de Clean Architecture — le code du
  domaine ignore d'où viennent les octets.
- Contre : chaque changement de contenu nécessite un rebuild et un redéploiement. Acceptable
  pour un portfolio mis à jour environ une fois par mois.
- Contre : pas d'UI de prévisualisation pour les éditeurs non techniques. Non pertinent — le
  seul éditeur est Yohan.
- Rejeté : CMS (option b) — ajoute du coût d'infra, du vendor lock-in, et remplace une
  démonstration de compétence code par une UI de configuration.
- Rejeté : base de données (option c) — exigerait une UI d'admin (ou de l'édition SQL brute),
  sur-dimensionné pour un contenu statique qui change mensuellement.

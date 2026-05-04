---
slug: deardiary
title: DearDiary
summary: Application personnelle de journal intime et de suivi de contacts, fullstack Spring Boot + Angular en architecture hexagonale stricte.
type: personal
status: finished
featured: true
dateStart: 2024-09-01
dateEnd: 2025-06-01
liveUrl: https://deardiary.noctabou.win
stack:
  - Spring Boot
  - Java
  - Angular
  - TypeScript
  - NgRx
  - MySQL
  - Docker
  - Flyway
highlights:
  - Architecture hexagonale stricte (ports & adapters) côté back
  - Atomic Design rigoureux (atomes / molécules / organismes) côté front
  - State management NgRx avec optimistic updates et rollback
  - Pattern Result<T,E> railway-oriented en TypeScript
  - Tests unitaires sur le domaine métier et tests d'intégration
  - Containerisation Docker pour un déploiement reproductible
  - Migrations DB versionnées avec Flyway
architecture: |
  Le back est découpé en couches hexagonales strictes. La couche **domain** contient les
  entités métier (entries, contacts, mood) sans aucune dépendance technique. La couche
  **application** définit les use-cases et les ports — interfaces que les adapters externes
  doivent implémenter. La couche **infrastructure** regroupe les adapters JPA pour la
  persistance, les mappers entité-domaine, et les controllers REST qui font office
  d'adapters d'entrée HTTP. Cette séparation permet de tester le domaine en isolation
  totale et de remplacer n'importe quelle dépendance externe sans toucher au métier.

  Le front Angular reproduit la même séparation : un dossier `domain` héberge les modèles
  immuables, `application` définit les use-cases et les ports vers les repositories,
  `infrastructure` implémente les adapters HTTP, et `presentation` suit l'Atomic Design
  (atoms, molecules, organisms, templates, pages). Les composants ne connaissent que les
  facades NgRx et n'ont aucune dépendance directe vers le réseau.
media:
  - type: image
    src: /images/projects/deardiary/login.png
    alt: Page de connexion de DearDiary avec formulaire email et mot de passe
    caption: Page de connexion
  - type: image
    src: /images/projects/deardiary/homepage.png
    alt: Tableau de bord DearDiary avec graphique d'humeur sur l'année
    caption: Tableau de bord avec évolution de l'humeur
  - type: image
    src: /images/projects/deardiary/calendrier.png
    alt: Vue calendrier de DearDiary listant les entrées du journal au jour le jour
    caption: Vue calendrier des entrées
  - type: image
    src: /images/projects/deardiary/type_relations.png
    alt: Écran de gestion des types de relations entre contacts
    caption: Gestion des types de relations
---

DearDiary est une application personnelle de journal intime couplée à un gestionnaire de
contacts. Elle permet à l'utilisateur d'écrire des entrées quotidiennes, de qualifier son
humeur, puis d'analyser l'évolution émotionnelle sur l'année via des statistiques agrégées.
Le second pan de l'application sert à organiser et suivre les personnes que l'utilisateur
fréquente — un carnet de relations enrichi qui se croise avec les entrées du journal.

J'ai conçu et développé l'application en autonomie, en choisissant Spring Boot et Angular
pour me forcer à appliquer rigoureusement une architecture hexagonale sur les deux côtés.
Côté back, le domaine métier est totalement isolé des frameworks : les entités sont des
objets Java purs, et les ports décrivent ce que le métier attend de l'extérieur sans rien
savoir de la persistance ou du transport. Les adapters JPA et REST sont injectés dans la
couche application via la configuration Spring.

Côté front, j'ai poussé l'Atomic Design jusqu'à la cohérence complète — chaque écran se
construit en composant des organismes eux-mêmes faits de molécules et d'atomes
réutilisables. Le state management NgRx applique des optimistic updates avec rollback
sur les actions mutantes, et toutes les opérations asynchrones passent par un type
`Result<T, E>` railway-oriented qui rend le flot d'erreurs explicite.

Le projet est containerisé avec Docker Compose (back, front, MySQL), et les migrations
de schéma sont versionnées via Flyway pour rester reproductibles entre environnements.
Les tests unitaires couvrent le domaine et la logique applicative, et des tests
d'intégration valident les contrats des adapters avec une base réelle.

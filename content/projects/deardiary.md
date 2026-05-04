---
slug: deardiary
title: DearDiary
summary: Application personnelle de journal intime et de suivi de contacts, fullstack Spring Boot + Angular.
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
  - NgRx Signals
  - MySQL
  - Docker
  - Flyway
highlights:
  - Architecture hexagonale côté Spring Boot
  - Clean Architecture côté Angular
  - Atomic Design rigoureux côté front
  - State management avec NgRx Signals
  - Containerisation Docker pour un déploiement reproductible
  - Migrations DB versionnées avec Flyway
architecture: |
  Côté **back**, l'application suit une architecture hexagonale stricte. La couche
  domaine contient les vraies entités métier (entries, contacts) avec leur
  comportement et leurs invariants. Les use-cases applicatifs s'appuient sur des
  ports — interfaces que les adapters d'infrastructure (JPA, REST) implémentent.

  Côté **front**, j'ai appliqué la Clean Architecture. La différence avec le
  back est volontaire : ici les modèles du domaine sont des entités anémiques,
  qui ne portent que de la donnée. La logique vit dans les use-cases, et la
  couche présentation est structurée en Atomic Design (atomes, molécules,
  organismes, templates, pages). NgRx Signals gère l'état applicatif.
media:
  - type: image
    src: /images/projects/deardiary/login.png
    alt: Page de connexion de DearDiary
    caption: Page de connexion
  - type: image
    src: /images/projects/deardiary/homepage.png
    alt: Tableau de bord de DearDiary
    caption: Tableau de bord
  - type: image
    src: /images/projects/deardiary/calendrier.png
    alt: Vue calendrier des entrées du journal
    caption: Vue calendrier des entrées
  - type: image
    src: /images/projects/deardiary/type_relations.png
    alt: Écran de gestion des types de relations entre contacts
    caption: Gestion des types de relations
---

DearDiary est une application personnelle de journal intime couplée à un gestionnaire de
contacts. L'utilisateur écrit des entrées quotidiennes pour conserver une trace de ses
journées, et tient en parallèle un carnet de relations qu'il peut croiser avec son journal.

J'ai conçu et développé l'application en autonomie, en choisissant Spring Boot et Angular
pour me forcer à appliquer une vraie discipline architecturale sur les deux côtés. Le
projet m'a servi à mettre en pratique l'architecture hexagonale côté serveur et la Clean
Architecture côté client.

Le tout est containerisé avec Docker Compose pour un déploiement reproductible, et les
migrations de schéma sont versionnées via Flyway.

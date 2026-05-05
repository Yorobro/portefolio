---
slug: deardiary
title: DearDiary
summary: Mon appli de journal intime et de suivi de contacts. Fullstack Spring Boot et Angular, conçue en solo.
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
  - Atomic Design pour le découpage des composants
  - Gestion d'état avec NgRx Signals
  - Conteneurisation Docker pour un déploiement reproductible
  - Migrations DB versionnées avec Flyway
architecture: |
  Côté **back**, j'ai poussé l'archi hexagonale jusqu'au bout. La couche
  domaine porte les vraies entités métier (entries, contacts) avec leur
  comportement et leurs invariants. Les use-cases s'appuient sur des
  ports, et les adapters d'infra (JPA, REST) viennent les implémenter.

  Côté **front**, j'ai voulu tester une autre approche : Clean Architecture
  avec des modèles de domaine anémiques (porteurs de données uniquement),
  toute la logique dans les use-cases, et une présentation structurée en
  Atomic Design (atomes, molécules, organismes, templates, pages). NgRx
  Signals gère l'état applicatif. La différence avec le back est volontaire :
  je voulais voir comment ça tient sur deux philosophies différentes.
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

DearDiary, c'est mon appli perso de journal intime, couplée à un gestionnaire
de contacts. L'idée : écrire ses entrées au quotidien pour garder une trace
de ses journées, et tenir en parallèle un carnet de relations qu'on peut
croiser avec son journal.

Je l'ai conçue et développée seul, et j'ai volontairement choisi Spring Boot
et Angular pour me forcer à appliquer une vraie discipline d'archi des deux
côtés. C'est le projet sur lequel j'ai mis le plus de soin sur la structure
du code : hexagonal côté serveur, Clean Architecture côté client, Atomic
Design pour le découpage front.

Le tout tourne dans Docker Compose pour que je puisse le redéployer
n'importe où sans souci, et les migrations DB sont versionnées avec Flyway.

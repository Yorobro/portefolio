---
slug: aprr
title: APRR
summary: Alternance chez APRR — migration PHP 7.3 vers 8.4, refonte en Clean Architecture, OIDC, CI/CD Azure DevOps et développement WPF/MVVM.
type: professional
status: finished
featured: true
dateStart: 2025-09-01
dateEnd: 2026-08-31
stack:
  - PHP 8.4
  - Clean Architecture
  - OIDC
  - Azure DevOps
  - WPF
  - MVVM
  - .NET
highlights:
  - Migration PHP 7.3 vers 8.4 (modernisation, deprecations, typage strict)
  - Implémentation de l'authentification OIDC
  - Refonte de l'application en Clean Architecture (couches, inversion des dépendances)
  - Conception et développement d'évolutions fonctionnelles back et front
  - Automatisation CI/CD avec pipelines Azure DevOps
  - Réalisation et suivi des recettes applicatives
  - Développement d'interfaces WPF en MVVM côté .NET
architecture: |
  La stratégie a consisté à appliquer la **Clean Architecture** à un projet PHP existant
  sans tout réécrire d'un coup. Le métier a été progressivement extrait des controllers
  et des modèles ActiveRecord pour devenir une couche **domain** indépendante de tout
  framework. Les use-cases applicatifs orchestrent ce domaine derrière des interfaces
  (ports), et les implémentations concrètes (persistance, services externes, transport
  HTTP) deviennent des **adapters** injectés par un conteneur de dépendances.

  Les controllers ont été refondus en **thin adapters** : ils valident l'entrée, appellent
  un use-case, et formatent la réponse — toute la logique métier vit dans la couche
  application. Cette refonte a été accompagnée de l'introduction de tests unitaires sur
  le domaine, qui pouvaient enfin tourner sans base de données.

  L'authentification a été extraite de l'application historique vers une couche **OIDC**
  séparée, qui s'intègre comme un middleware standard. Les pipelines Azure DevOps
  automatisent le build, les tests, et le déploiement multi-environnements.
media: []
---

Cette alternance chez APRR (Saint-Apollinaire) a couvert l'ensemble du cycle de vie d'une
application interne historique : modernisation technique, refonte architecturale,
évolutions fonctionnelles, et industrialisation du déploiement. Le périmètre touchait à
la fois le back PHP et des outils internes en WPF/.NET.

J'ai piloté la migration de PHP 7.3 vers 8.4 — un saut majeur qui a impliqué de traiter
les deprecations accumulées, d'introduire un typage plus strict, et de remplacer les
patterns devenus obsolètes par leurs équivalents modernes. En parallèle, j'ai refondu
l'architecture de l'application en Clean Architecture, ce qui a nécessité d'isoler le
métier des frameworks, d'inverser les dépendances vers les bons sens, et de transformer
les controllers en adaptateurs minces.

Côté authentification, j'ai mis en place un flux OIDC complet, ce qui a clarifié la
séparation entre identité et logique applicative. Côté outillage, j'ai conçu les
pipelines CI/CD sur Azure DevOps pour automatiser builds, tests et déploiements, et
j'ai pris en charge les recettes applicatives jusqu'à leur validation.

En complément du back PHP, j'ai développé des interfaces WPF en MVVM côté .NET pour des
outils internes — un travail qui m'a fait pratiquer la séparation Vue / ViewModel /
Modèle dans un contexte différent et m'a permis de comparer les approches Clean
Architecture côté PHP et MVVM côté .NET.

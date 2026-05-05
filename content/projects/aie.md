---
slug: aie
title: A.I.E
summary: Appli WPF d'arbre généalogique en MVVM, faite en équipe de cinq avec une CI/CD GitHub Actions.
type: academic
status: finished
featured: true
dateStart: 2024-01-01
dateEnd: 2024-04-30
stack:
  - C#
  - WPF
  - MVVM
  - .NET
  - GitHub Actions
highlights:
  - Projet universitaire en équipe de cinq
  - Archi MVVM (Vue / ViewModel / Modèle bien séparés)
  - Visualisation interactive d'un arbre généalogique
  - CI/CD avec GitHub Actions
  - Coordination via Git et workflow de pull requests
media:
  - type: image
    src: /images/projects/aie/accueil.png
    alt: Page d'accueil de l'application A.I.E
    caption: Page d'accueil
  - type: image
    src: /images/projects/aie/tree_loaded.png
    alt: Arbre généalogique chargé dans A.I.E
    caption: Arbre généalogique chargé
  - type: image
    src: /images/projects/aie/tree_temporalite_loaded.png
    alt: Vue temporelle de l'arbre généalogique dans A.I.E
    caption: Vue temporelle de l'arbre
---

A.I.E, c'est un projet uni mené à l'IUT en équipe de cinq. L'objectif :
livrer une appli WPF capable de représenter et de naviguer dans un arbre
généalogique. L'utilisateur peut explorer les relations familiales, sauter
de génération en génération et filtrer les branches.

On a appliqué MVVM proprement : la Vue se limite au binding XAML, les
ViewModels exposent l'état observable et les commandes, les modèles décrivent
la structure généalogique sans rien savoir de l'affichage. Cette séparation
nous a permis de bosser en parallèle sans se marcher dessus.

Côté outillage, on a mis en place une CI/CD avec GitHub Actions : à chaque
pull request, le workflow lance le build et les tests, ce qui sécurise les
contributions de cinq développeurs qui poussent en parallèle.

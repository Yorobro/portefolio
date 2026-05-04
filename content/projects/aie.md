---
slug: aie
title: A.I.E
summary: Application WPF d'arbre généalogique en MVVM, développée en équipe de cinq avec une CI/CD GitHub Actions.
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
  - Projet universitaire mené en équipe de cinq personnes
  - Architecture MVVM (séparation Vue / ViewModel / Modèle)
  - Visualisation interactive d'un arbre généalogique
  - CI/CD avec GitHub Actions
  - Coordination en équipe via Git et workflow de pull requests
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

A.I.E est un projet universitaire mené à l'IUT en équipe de cinq personnes. L'objectif
était de livrer une application WPF capable de représenter et de naviguer dans un arbre
généalogique. L'utilisateur peut explorer les relations familiales, naviguer entre les
générations et filtrer les branches.

Nous avons appliqué une architecture MVVM : la couche Vue se limite au binding XAML,
les ViewModels exposent l'état observable et les commandes, et les modèles décrivent
la structure généalogique sans rien savoir de l'affichage. Cette séparation nous a
permis de paralléliser le travail en équipe.

Côté outillage, nous avons mis en place une chaîne CI/CD avec GitHub Actions : à
chaque pull request, le workflow déclenche le build et les tests, ce qui sécurise
l'intégration des contributions des cinq développeurs.

---
slug: aie
title: A.I.E
summary: Application WPF en équipe pour visualiser et naviguer dans un arbre généalogique, en architecture MVVM rigoureuse.
type: academic
status: finished
featured: false
dateStart: 2024-01-01
dateEnd: 2024-04-30
stack:
  - C#
  - WPF
  - MVVM
  - .NET
highlights:
  - Architecture MVVM rigoureuse (séparation Vue / ViewModel / Modèle)
  - Visualisation interactive d'un arbre généalogique
  - Navigation hiérarchique et filtrage des relations
  - Travail en équipe (gestion de versions, intégration, communication)
media: []
---

A.I.E est un projet universitaire mené en équipe à l'IUT, dont l'objectif était de
livrer une application WPF capable de représenter et de naviguer dans un arbre
généalogique. L'utilisateur peut explorer les relations familiales, naviguer entre les
générations, et filtrer les branches selon différents critères.

Nous avons appliqué une architecture MVVM rigoureuse : la couche Vue ne contient que du
binding XAML, les ViewModels exposent l'état observable et les commandes, et les modèles
décrivent la structure généalogique sans rien savoir de l'affichage. Cette séparation
nous a permis de paralléliser le travail dans l'équipe — les uns sur les
visualisations, les autres sur la logique de navigation et les modèles.

Le projet a été l'occasion de pratiquer le travail en équipe sur un cycle complet :
découpage des tâches, gestion de versions Git, intégration continue des contributions,
et démonstration finale. C'est le contexte dans lequel j'ai pris goût à la séparation
nette des responsabilités dans une application graphique — un réflexe que je retrouve
aujourd'hui dans tous mes projets.

---
slug: pixometre
title: PIXomètre
summary: Appli web PHP en MVC strict pour aider les enseignants à gérer leurs sessions PIX. Développée en équipe.
type: academic
status: finished
featured: false
dateStart: 2024-09-01
dateEnd: 2024-12-31
stack:
  - PHP
  - MVC
  - MySQL
highlights:
  - Architecture MVC stricte, sans framework
  - Outil métier pensé pour les enseignants qui organisent les sessions PIX
  - "Gestion complète d'une session : planification, candidats, résultats"
  - Travail en équipe avec Git
media: []
---

PIXomètre, c'est un projet uni mené en équipe à l'IUT. Le besoin était
concret : permettre aux enseignants de gérer leurs sessions PIX, la
certification française des compétences numériques. L'outil couvre la
planification des sessions, le suivi des candidats et la consultation des
résultats.

On a tout fait en PHP pur, sans framework, en suivant une archi MVC stricte.
La base de données est MySQL. La contrainte "no framework" nous a obligés
à structurer nous-mêmes le routage, le rendu des vues et l'accès aux
données. C'est un excellent exercice pour comprendre ce que les frameworks
modernes font sous le capot.

L'interface est pensée pour un usage côté prof : tableaux denses, filtres,
actions groupées. Le projet a aussi été un bon entraînement à la coordination
en équipe. Découpage des écrans, revues via Git, alignement régulier sur les
choix techniques.

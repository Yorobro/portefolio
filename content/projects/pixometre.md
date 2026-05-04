---
slug: pixometre
title: PIXomètre
summary: Application web PHP en architecture MVC stricte, développée en équipe pour aider les enseignants à gérer leurs sessions PIX.
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
  - Outil métier pensé pour les enseignants organisateurs de sessions PIX
  - "Gestion complète d'une session : planification, candidats, résultats"
  - Travail en équipe avec Git
media: []
---

PIXomètre est un projet universitaire mené en équipe à l'IUT. L'objectif est concret :
permettre aux enseignants de gérer leurs sessions PIX, la certification française des
compétences numériques. L'outil couvre la planification des sessions, le suivi des
candidats et la consultation des résultats.

Nous avons développé l'application en PHP pur, sans framework, en suivant une
architecture MVC stricte. La base de données est MySQL. Cette contrainte « no
framework » nous a obligés à structurer nous-mêmes le routage, le rendu des vues et
l'accès aux données — un excellent exercice pour comprendre ce que les frameworks
modernes font sous le capot.

L'interface est pensée pour un usage côté enseignant : tableaux denses, filtres, et
actions groupées. Le projet a aussi été un bon exercice de coordination en équipe —
découpage des écrans, revues via Git, et alignement régulier sur les choix techniques.

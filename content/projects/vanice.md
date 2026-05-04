---
slug: vanice
title: Vanice
summary: Mod technique endgame pour Minecraft développé en Kotlin, centré sur des machines complexes et un stockage d'énergie à grande échelle.
type: personal
status: in-progress
featured: true
dateStart: 2024-06-01
stack:
  - Kotlin
  - Forge
  - Minecraft
highlights:
  - Architecture orientée systèmes / composants
  - Mod endgame avec chaînes de production avancées
  - Stockage d'énergie à grande échelle
  - Système d'automatisation et de stockage d'items inspiré et étendu d'Applied Energistics
  - Collaboration en binôme avec un autre développeur
  - Kotlin sur l'API de modding Forge
media: []
---

Vanice est un mod technique pour Minecraft conçu pour la phase endgame du jeu. L'objectif
est de proposer aux joueurs déjà familiers des grands mods techniques (Mekanism, Applied
Energistics, Refined Storage) un cran supplémentaire en complexité et en échelle :
machines avancées, chaînes de production multi-étapes, et stockage d'énergie à très
grande capacité.

Le mod est écrit en Kotlin sur l'API Forge. L'une des pièces maîtresses est une
réinterprétation enrichie d'Applied Energistics, avec un système de stockage et
d'automatisation des items repensé pour absorber les volumes typiques d'un endgame
multi-mods. L'architecture du code repose sur une séparation claire entre les définitions
de blocs, les machines (logique métier), et les systèmes transversaux (énergie, réseau,
stockage), ce qui garde le code testable malgré la nature très intégrée d'un mod
Minecraft.

Je développe le mod en collaboration avec un ami : nous nous répartissons les chantiers
(systèmes vs machines vs intégration) et avançons en parallèle. Le projet est encore en
cours et le repo est privé pour le moment. Des screenshots, gifs et démonstrations vidéo
des machines déjà fonctionnelles sont disponibles sur demande.

# Decision Labs Edge est disponible

> Language: fr

- HTML: https://decision-labs.com/fr/blog/announcing-decision-labs-edge
- LLM: https://decision-labs.com/llm/fr/blog/announcing-decision-labs-edge.md

Nous lançons [Decision Labs Edge](https://edge.decision-labs.com/) : des poids et des outils pour l'IA sur l'appareil, pour du matériel sans liaison cloud stable.

Les appareils de terrain, comme les pièges photographiques, les bouées, les drones et les nœuds de capteurs, fonctionnent souvent avec une connexion irrégulière, peu d'énergie et des limites de latence strictes. Un aller-retour vers le cloud échoue quand le réseau coupe. L'inférence sur l'appareil permet à ces systèmes d'évaluer la télémétrie et les données de capteurs là où elles sont produites.

## De quoi il s'agit

Decision Labs Edge convertit des checkpoints [LiteRT](https://ai.google.dev/edge/litert) (`.tflite`) pour la prévision de séries temporelles dans un format livrable. Des modèles de perception géospatiale sont prévus. Un même artefact doit tourner sur CPU, GPU et NPU, sur Android, iOS, Linux de terrain, le web et les systèmes embarqués, sans une chaîne distincte pour chaque plateforme.

Disponible dans le [catalogue de modèles](https://edge.decision-labs.com/) :

- **Toto-2**, checkpoints Edge (à partir de 4M, y compris des tailles plus grandes)
- **Chronos-2** (120M)
- **TimesFM 2.5** (200M)

Les poids de détection et de segmentation (bâtiments, véhicules, navires, panneaux solaires, couverture du sol et classes proches) suivront.

## Pour qui

Les équipes qui doivent décider localement : télémétrie d'installations, réseaux de mesure environnementale, et bientôt des images aériennes. Cela comprend la maintenance prévisionnelle, la mesure de l'air et de l'eau, et la perception sur le terrain, là où chaque wattheure et chaque seconde de latence comptent.

## Pour commencer

Les modèles et les cas d'usage sont sur [edge.decision-labs.com](https://edge.decision-labs.com/). Si vous avez besoin d'aide pour l'intégration LiteRT ou le déploiement sur le terrain, la page Edge renvoie aussi vers un entretien d'une heure avec nous.

Questions : [écrivez-nous](/fr/contact).

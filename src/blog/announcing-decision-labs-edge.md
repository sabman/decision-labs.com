---
title: "Announcing Decision Labs Edge"
date: "2026-07-23"
author: "Decision Labs"
category: "Blog"
readTime: "3 min read"
featured: true
image: "/images/blog/edge-hero.png"
linkType: "internal"
slug: "announcing-decision-labs-edge"
link: ""
---

We are launching [Decision Labs Edge](https://edge.decision-labs.com/): on-device AI weights and tooling for hardware that cannot rely on a stable cloud link.

Field devices such as camera traps, buoys, drones, and sensor nodes often run with patchy uplinks, tight power budgets, and hard latency limits. Cloud round-trips fail when the network drops. On-device inference is how those systems act on telemetry and sensor streams where the data is collected.

## What it is

Decision Labs Edge converts and ships production [LiteRT](https://ai.google.dev/edge/litert) (`.tflite`) checkpoints for time-series forecasting, with geospatial perception models on the roadmap. One artifact is meant to run across CPU, GPU, and NPU targets on Android, iOS, Linux edge, Web, and embedded systems, without rebuilding a separate pipeline per platform.

Available now in the [model store](https://edge.decision-labs.com/):

- **Toto-2** edge checkpoints (from 4M up through larger field sizes)
- **Chronos-2** (120M)
- **TimesFM 2.5** (200M)

Geospatial detection and segmentation weights (buildings, vehicles, ships, solar panels, land cover, and related classes) are listed as coming soon.

## Who it is for

Teams that need local decisions on equipment telemetry, environmental sensor networks, and (soon) overhead imagery: predictive maintenance, air and water sensing, and field perception where every watt and every second of latency counts.

## Get started

Browse models and use cases at [edge.decision-labs.com](https://edge.decision-labs.com/). If you need help with LiteRT integration or field rollout, the Edge site also links a one-hour support session with our team.

Questions: [get in touch](/contact).

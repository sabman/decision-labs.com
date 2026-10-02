# Building GeoAgents: Workshop at GeoAI 2026

> Blog post by Shoaib Burq.

- HTML: https://decision-labs.com/blog/geoai-2026-geoagents-workshop
- LLM: https://decision-labs.com/llm/blog/geoai-2026-geoagents-workshop.md

- Published: 2026-06-21
- Author: Shoaib Burq
- Category: Talk

We attended [GeoAI 2026](https://geoaiconference.org/) in Ghent, Belgium (3 to 6 June 2026) and ran a pre-conference workshop on the afternoon of 3 June: **Building GeoAgents: A Hands-on Guide to Agent Protocols** (workshop W6).

The conference theme was *GeoAI – Bridging AI and Geography for Science and Society*. Our session focused on agent protocols for geospatial systems: how to wire up UI, orchestration, and backend services in a way that different tools can work together.

![GeoAI 2026 workshop session in Ghent](https://decision-labs.com/images/blog/geoai-2026-workshop-hero.jpg)

[More photos from the workshop](https://photos.google.com/share/AF1QipOhyoBjeKbnSiOSXionqxe5HSWxRtAN4Qb791G8sMrtlMAL2_gYmIEcavLG86P0VQ?key=eTEyVXJCWVoteEtXNkFoYzBybHpzSGdRQm5ndlR3)

## What we covered

Agentic AI is showing up in more geospatial applications. The workshop looked at three protocol layers that are starting to appear in production-style setups:

- **Agent-Governed UI (AG-UI)**: frontend patterns for human-in-the-loop workflows
- **Agent-to-Agent (A2A)**: backend orchestration and communication between agents
- **Model Context Protocol (MCP)**: state management and reproducibility for agent tools

Examples drew on [EarthGPT.app](https://www.earthgpt.app/) and [Geobase](https://geobase.app/), both built with protocol-driven agent architectures.

## Exercises

Participants worked through a spiral of Colab notebooks and local apps in the [workshop repository](https://github.com/decision-labs/geoai-2026-practical-exercise):

1. **Setup** (Exercise 0): API keys and Colab port map
2. **Routing MCP** (Exercise 1): OpenRouteService tools over MCP
3. **Agentic chat** (Exercises 2 to 3): Pydantic AI agents with AG-UI and map clients
4. **Geocoding and routing** (Exercise 5): combined ORS MCP plus place-name routing
5. **A2A orchestration** (Exercise 6): routing and weather agents behind an AG-UI orchestrator
6. **Human-in-the-loop** (Exercise 7, optional): geospatial analysis with approval steps before drawing isochrones in chat

![Human-in-the-loop isochrone workflow from Exercise 7](https://decision-labs.com/images/blog/geoai-2026-hitl.png)

7. **Geobase demo** (Exercise 8): Kroo Bay similarity search with CLI agents and MapLibre

Most exercises run in Colab with pre-configured environments. No local setup was required for the core path.

![Workshop participants working through exercises](https://decision-labs.com/images/blog/geoai-2026-workshop-1.jpg)

![Workshop room at GeoAI 2026](https://decision-labs.com/images/blog/geoai-2026-workshop-2.jpg)

![Hands-on session in progress](https://decision-labs.com/images/blog/geoai-2026-workshop-3.jpg)

## Materials

Workshop code, notebooks, slide decks, and a glossary are in the GitHub repository:

[github.com/decision-labs/geoai-2026-practical-exercise](https://github.com/decision-labs/geoai-2026-practical-exercise)

Start with [Exercise 0](https://github.com/decision-labs/geoai-2026-practical-exercise/tree/main/00-workshop-setup) if you want to work through the notebooks on your own. The repo includes Colab badges for each exercise.

## Related work

This workshop followed work we presented at [BiDS 2025](/blog/ai-agents-for-earth-observation) on AI agents for Earth observation. GeoAI 2026 shifted the focus from EO agent types and specifications to the protocol stack needed to build and run them.

Questions or feedback on the workshop materials: [get in touch](/contact).

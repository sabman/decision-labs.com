---
title: "AI Agents for Earth Observation: Talk and BoF at BiDS 2025"
date: "2026-06-21"
author: "Shoaib Burq & M. Hassan"
category: "Talk"
readTime: "8 min read"
featured: true
image: "/images/blog/ai-agents-for-earth-observation.jpg"
linkType: "internal"
slug: "ai-agents-for-earth-observation"
link: ""
---

At [Big Data from Space 2025](https://www.bigdatafromspace2025.org/) (BiDS) in Riga, Latvia, we ran two sessions on agentic AI for Earth observation: a talk on how agents work in EO, and a Birds of a Feather (BoF) session to start community work on open specifications.

## The talk

**Agentic AI for Earth Observation** | S. Burq & M. Hassan, Decision Labs

<iframe src="https://speakerdeck.com/player/467d9112eaa54f3ab1c180dfb849ef22" width="710" height="400" frameborder="0" allowfullscreen></iframe>

[View the full slide deck on Speaker Deck →](https://speakerdeck.com/sabman/ai-agents-for-earth-observation)

### How agentic AI works: a primer for Earth observation

The talk had four goals:

- Introduce the concept of agentic AI
- Explain how agents work
- Provide examples of EO-related agents
- Call to action for collaboration on open EO agents

### Motivating example: EarthGPT.app

![EarthGPT.app, a conversational Earth observation interface](/images/blog/earthgpt.jpg)

Our starting point was [EarthGPT.app](https://www.earthgpt.app/), a conversational interface for EO tasks. It shows what agents can do when they have access to a geospatial toolbox.

### Introduction to agentic AI

The talk introduced a vocabulary that is becoming standard in agentic systems:

- **Tools**
- **Agents**
- **Workflows**
- **Memory**
- **Evals**

![What is an agent? An LLM-driven planner that selects and sequences tools](/images/blog/what-is-agent.png)

An **agent** is an LLM-driven planner. Given a user goal, it decides which tools to call and in what order. The user does not wire each step manually.

### Travel planner workflow

To make this concrete before moving to EO, we used a simple travel example, the kind of question anyone in Riga might ask:

*"I am in Riga today, can you suggest some places to visit and what should I wear?"*

The agent's toolbox for this task:

- **`geocode-destination()`**: get coordinates for the destination city
- **`get-weather-info()`**: get weather information for the destination
- **`find-attractions()`**: find attractions and points of interest
- **`create-itinerary()`**: create a daily itinerary with optimized routes
- **`generate-tour-summary()`**: generate a tour summary with recommendations

![Travel planner workflow: geocode, weather, attractions, itinerary, summary](/images/blog/travel-planner.gif)

The LLM plans the workflow and calls the tools in the correct order: `geocode-destination()` → `get-weather-info()` → `find-attractions()` → `create-itinerary()` → `generate-tour-summary()`.

The same pattern applies to EO: the user states a goal, the agent assembles the pipeline.

### EO-related agent examples

The deck lists agent types that map onto real EO work:

- **Catalog Agent**: searches satellite archives (Copernicus, Sentinel, Landsat)
- **Database Agent**: queries PostGIS and vector DBs
- **File Agent**: loads GeoJSON, shapefiles, NetCDF datasets
- **Imagery Agent**: processes SAR, multispectral, and hyperspectral data
- **Forecasting Agent**: predicts weather, climate, and crop yield using ML/ARIMA
- **Visualization Agent**: plots maps (Deck.gl, Leaflet, Mapbox, Kepler.gl)
- **Vision Agent**: detects objects in images (cars, buildings, vessels, crops)

A single user request can involve several agents working in sequence or in parallel.

### Tools: the arms and sensors of an agent

Tools are how agents interact with the world. In EO, they fall into four types:

- **APIs**: geocoders, routing, catalog services
- **Models**: vision, multimodal, forecasting
- **Commands**: `gdal`, `ogr2ogr`, and other CLI geospatial tools
- **Data access**: STAC catalogues, vector databases

![geoai-sdk, an open toolkit for geospatial agent tools](/images/blog/tools.png)

We highlighted [geoai-sdk](https://github.com/decision-labs/geoai-sdk) as an open toolkit that wraps many of these capabilities into a consistent interface agents can call.

### Multi-agent topology

Complex EO tasks rarely involve a single agent. Multi-agent systems coordinate specialised agents (catalog search, imagery processing, vector analysis) under a planner or orchestrator.

![Multi-agent topology for Earth observation workflows](/images/blog/multiagent-topography.png)

*Principle of building AI agents, [Sam Bhagwat](https://sam-bhagwat.github.io/)*

### Case study: maritime and fisheries

**Illegal fishing detection in the Mediterranean**

User asks: *"Detect vessels fishing illegally in EU waters."*

Tools:

- **ESA Sentinel-1 SAR** → vessel detection
- **AIS data integration** → match vessels with AIS signals
- **Vector analysis tool** → cross-check with legal fishing zones
- **Routing tool** → closest coast guard patrols

**Output:** alerts and patrol coordination. The analyst gets actionable results, not a stack of intermediate files to interpret manually.

Workflow: Sentinel-1 SAR → AIS integration → vector analysis → routing.

### What we covered

- What is an agent?
- What are tools?
- What is a workflow?
- What is a multi-agent system?
- What are examples of Earth Observation agents?

### What's next

![Example EO agent workflows](/images/blog/example-workflows.png)

Open problems and active areas of work:

- **Context length**: fitting larger EO workflows and datasets into agent memory
- **MCP, A2A, RAG, vector DBs**: standard protocols and retrieval over spatial data
- **Multi-agent systems**: orchestration at scale across specialised EO agents

## Birds of a Feather: Towards an Open Ecosystem

Alongside the talk, we hosted a 60-minute BoF session, **AI Agents for Earth Observation Analytics: Towards an Open Ecosystem**, with EO practitioners, AI/ML researchers, data scientists, and developers from across the conference.

The goal was a working session, not another presentation: start a community effort to develop specifications for EO AI agents, so tools, frameworks, and workflows can interoperate rather than each team building in isolation.

### What we discussed

Participants mapped the current landscape: what agent tools and frameworks people are already using, where interoperability breaks down between EO systems, and which specification gaps hurt most in practice.

Four core specification areas emerged as priorities:

- **Agent interface standards**: APIs, protocols, and data formats for how EO agents expose capabilities and exchange messages
- **Tool integration specifications**: plugin architecture, capability discovery, and consistent wrappers around GDAL, STAC, vision models, and the rest of the EO stack
- **Workflow definition standards**: how multi-step pipelines are described, executed, monitored, and recovered when something fails
- **Metadata and testing**: agent capability descriptions, versioning, backward compatibility, and validation frameworks so implementations can be verified against the spec

The technical discussion covered agent topologies (hierarchical, peer-to-peer, federated), communication patterns (message passing, event-driven, REST/GraphQL), and alignment with existing EO standards (STAC, OGC, OpenAPI) rather than reinventing what the community already has.

### EO Agent Specifications Working Group

The BoF proposed forming an **EO Agent Specifications Working Group** with a clear charter:

| Area | Focus |
|------|-------|
| **Specification Development** | Core technical specs for agent interfaces, tools, and workflows |
| **Community & Outreach** | Engagement, adoption, and contributor onboarding |
| **Testing & Validation** | Compliance frameworks and reference implementations |
| **Documentation & Education** | Guides, examples, and training resources |

Governance would follow an open contribution model: a steering committee of key stakeholders, focused technical working groups for each spec area, and a community advisory board for broader input.

### Roadmap

The group outlined an initial deliverable timeline:

- **Month 3**: Core specification framework
- **Month 6**: Agent interface standards (first draft)
- **Month 9**: Tool integration specifications
- **Month 12**: Reference implementations
- **Month 15**: Testing and validation suite

Immediate next steps include setting up communication channels, a shared repository with contribution guidelines, and scheduling the first working group meeting.

## Get involved

If you attended the BoF in Riga or are reading this from elsewhere, we are building an open EO agent ecosystem and welcome collaborators.

If you work on agentic EO systems, build tools that agents should call, or care about interoperability standards for spatial AI, [get in touch](/contact). Join our [newsletter](/newsletter) for working group updates.

![Decision Labs newsletter QR code](/images/blog/decision-labs-newsletter-qr-code.png)

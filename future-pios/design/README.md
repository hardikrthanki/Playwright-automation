# PIOS Design Prototype (Isolated)

This folder is a **static UI redesign** of the PIOS vision site.

It is **not** connected to:

- `scripts/air-core/`
- `config/`
- `execution-report/`
- live npm scripts
- the current AIR report

## Open these links

If local server is running on 8765:

- Home: http://localhost:8765/index.html
- **Full interactive demo:** http://localhost:8765/start.html
- Workspace: http://localhost:8765/workspace.html
- RIE: http://localhost:8765/products/rie.html
- AIR: http://localhost:8765/products/air.html
- RI: http://localhost:8765/products/ri.html
- OI: http://localhost:8765/products/oi.html
- Evidence: http://localhost:8765/platform/evidence.html
- Knowledge: http://localhost:8765/platform/knowledge.html

## What the Start demo does now (matches your live design)

1. **Input screen** — upload files or paste requirement; Analyze disabled until input exists  
2. **Analyze screen** — progress %, radar, pipeline checklist, lifecycle stages, counters unlock live  
3. **Review screen** — KPI cards, metadata, AI/Human/Repository progress, finding queue with Accept/Edit/Reject/Explain, gaps, dependency path  

Architecture correction preserved: AIR readiness vs RI decision boundary is shown in review metadata.

See `SCREEN_MAP.md` for the crawl of your live site.

## What changed vs the live ChatGPT site

| Live site | This redesign |
| --- | --- |
| Ten equal Intelligence Modules | Platform + 4 products: RIE, AIR, RI, OI |
| Project Intelligence as a peer module | Project Workspace / Overview |
| Evidence / Knowledge / AI as peer products | Shared PIOS platform services |
| Lifecycle without Release / Observe | Understand → Validate → Prove → Release → Observe → Learn → Reuse |
| No RI / OI | RI and OI visible (Planned where needed) |
| AIR framed as strategy generation | AIR framed as validation intelligence + readiness signals |
| Release decision implied inside validation | RI owns GO / CONDITIONAL GO / NO-GO |

## Canonical naming used here

- **PIOS** — Product Intelligence Operating System
- **AIR** — Automation Intelligence Report
- **OI** — Operational Intelligence

## Files

```text
design/
├── README.md
├── styles.css
├── index.html
├── workspace.html
├── start.html
└── products/
    ├── rie.html
    ├── air.html
    ├── ri.html
    └── oi.html
```

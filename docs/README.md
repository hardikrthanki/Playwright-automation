# AIR Developer Documentation

AIR is the Automation Intelligence Platform inside this repository. It converts automation execution results into release decisions, quality health, evidence, recommendations, and exportable dashboards.

This documentation set explains AIR as a product and as an engineering system. Start here, then follow the engine-specific documents as work moves into AIR Core.

## Current Status

- AIR v1.0 UI is frozen.
- The dashboard reads normalized `air-results.json`.
- Playwright is the first input source.
- AIR must remain framework-independent.
- Future engines should improve intelligence, not redesign the UI.

## Documentation Map

| Document | Purpose |
| --- | --- |
| [PRODUCT_VISION.md](PRODUCT_VISION.md) | Product mission, audience, and principles |
| [ARCHITECTURE.md](ARCHITECTURE.md) | High-level AIR architecture |
| [SYSTEM_ARCHITECTURE.md](SYSTEM_ARCHITECTURE.md) | Runtime flow and boundaries |
| [DATA_MODEL.md](DATA_MODEL.md) | `air-results.json` contract |
| [UI_GUIDELINES.md](UI_GUIDELINES.md) | Frozen AIR v1.0 UI rules |
| [COMPONENT_GUIDELINES.md](COMPONENT_GUIDELINES.md) | Reusable UI/component expectations |
| [PARSER.md](PARSER.md) | Parser design and responsibilities |
| [AIR_CORE.md](AIR_CORE.md) | AIR Core ownership and roadmap |
| [QUALITY_ENGINE.md](QUALITY_ENGINE.md) | Quality score rules |
| [RELEASE_ENGINE.md](RELEASE_ENGINE.md) | GO / CONDITIONAL GO / NO GO logic |
| [JOURNEY_ENGINE.md](JOURNEY_ENGINE.md) | Business journey mapping |
| [MODULE_ENGINE.md](MODULE_ENGINE.md) | Module health model |
| [EVIDENCE_ENGINE.md](EVIDENCE_ENGINE.md) | Evidence correlation |
| [SEARCH_ENGINE.md](SEARCH_ENGINE.md) | Search indexing and behavior |
| [HISTORY_ENGINE.md](HISTORY_ENGINE.md) | Historical execution strategy |
| [AI_ENGINE.md](AI_ENGINE.md) | Recommendation and reasoning goals |
| [PLUGIN_ARCHITECTURE.md](PLUGIN_ARCHITECTURE.md) | Future adapter/plugin model |
| [ROADMAP.md](ROADMAP.md) | AIR product evolution |
| [VERSION_HISTORY.md](VERSION_HISTORY.md) | Release history |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Contribution workflow |
| [CODING_STANDARDS.md](CODING_STANDARDS.md) | Engineering standards |
| [CHANGELOG.md](CHANGELOG.md) | Change log |

## Main Commands

```powershell
npm run test:execution
npm run report:execution
npm run report:execution:pdf
npm run typecheck
```

## Key Outputs

- `test-results/results.json`: Playwright JSON reporter output.
- `execution-report/air-results.json`: normalized AIR model.
- `execution-report/index.html`: AIR dashboard.
- `execution-report/AIR_Report.pdf`: exportable PDF when generated.


# AI Engine

AIR AI should reason, not merely summarize.

## Responsibilities

- Explain release decision.
- Identify likely investigation path.
- Recommend next QA work.
- Highlight weak coverage.
- Identify risky modules.
- Suggest automation improvements.
- Prepare future root-cause analysis.

## Inputs

- AIR data model.
- Release decision.
- Quality factors.
- Failed tests.
- Evidence metadata.
- Module health.
- Business journey health.
- Historical trends when available.

## Output

- Why AIR recommends GO/CONDITIONAL GO/NO GO.
- Priority recommendations.
- Risk explanation.
- Next QA focus.
- Future validation gaps.

## Current Recommendation Engine

Current implementation:

- `scripts/air-core/services/recommendation-engine.js`

The current engine is rule-based. It reads normalized release, module, and future-validation data and produces traceable recommendations. Future AI reasoning should build on this contract instead of replacing dashboard logic directly.

## Rule

AI recommendations must be traceable to data. If evidence is missing, AIR should say that evidence is missing instead of pretending certainty.

# Release Engine

The Release Engine decides whether a build can be released.

## Decisions

- `GO`
- `CONDITIONAL GO`
- `NO GO`

## Inputs

- Critical journey status.
- Pass rate.
- Quality score.
- Blocker or critical failures.
- Module risk.
- Coverage.
- Future security/performance signals.

## Current Implementation

The Release Engine is implemented in:

- `scripts/air-core/engine/release-engine.js`

Release rules are configuration-driven through:

- `config/air.release.json`
- legacy threshold fallback from `config/air.thresholds.json`

The engine consumes quality output but does not calculate quality score or confidence.

## Decision Guidance

| Decision | Meaning |
| --- | --- |
| GO | Critical journeys passed, no blockers, score above threshold |
| CONDITIONAL GO | Critical journeys passed but warnings or moderate risk exist |
| NO GO | Critical journey failed, blocker found, or score below threshold |

## Required Output

The engine must produce:

```json
{
  "release": {
    "decision": "GO",
    "status": "GO",
    "confidence": 100,
    "risk": "LOW",
    "riskLevel": "LOW",
    "reasons": [],
    "warnings": [],
    "blockers": [],
    "requiredActions": [],
    "recommendedAction": "Proceed with release monitoring.",
    "explanation": "AIR recommends GO because..."
  }
}
```

`releaseDecision` remains as a compatibility alias for the current dashboard.

## Engine Rules

- No Playwright-specific logic.
- No UI logic.
- No quality score calculation.
- No fake data.
- If execution is partial and partial release is not explicitly allowed, the engine returns `CONDITIONAL_GO`.
- If a configured critical journey fails, the engine returns `NO_GO`.
- If configured critical failures exist, the engine returns `NO_GO`.
- If warnings or not-executed critical areas exist, the engine returns `CONDITIONAL_GO`.
- If all configured release rules pass, the engine returns `GO`.

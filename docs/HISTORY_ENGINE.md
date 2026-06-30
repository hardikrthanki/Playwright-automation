# History Engine

The History Engine tracks quality over time.

## Purpose

AIR should eventually answer whether quality is improving, stable, or declining.

## Current State

Current implementation:

- `scripts/air-core/engine/history-engine.js`

Execution history is stored in `execution-report/history/air-history.json` when generated.

## Output Contract

```json
{
  "history": {
    "executions": [],
    "trends": {},
    "comparison": {},
    "regressions": [],
    "improvements": [],
    "summary": {
      "status": "First Execution",
      "totalExecutions": 1
    }
  }
}
```

If no previous execution exists, the History Engine returns `First Execution` instead of inventing comparison data.

## Future Trend Types

- Pass rate trend.
- Quality score trend.
- Module health trend.
- Journey health trend.
- Duration trend.
- Coverage trend.
- Failure trend.
- Release decision trend.

## Build Comparison

AIR compares:

- Current run vs previous run.
- Current build vs baseline.
- Module-by-module changes.
- New failures vs recurring failures.

The current engine calculates comparison metrics for quality, pass rate, failures, duration, module coverage, and journey coverage.

## No Fake Chart Rule

If history is unavailable, show a clear roadmap/empty state rather than invented trend data.

# History Engine

The History Engine tracks quality over time.

## Purpose

AIR should answer how quality changes over time, not only what happened in the current execution.

The History Engine supports:

- Build comparison.
- Quality trend analysis.
- Release trend analysis.
- Module trend analysis.
- Journey trend analysis.
- Failure trend analysis.
- Evidence trend analysis.
- Historical timeline data.

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

## Current Trend Types

- Pass rate trend.
- Quality score trend.
- Business health trend.
- Module coverage trend.
- Journey coverage trend.
- Duration trend.
- Coverage trend.
- Failure trend.
- Failure rate trend.
- Evidence trend.
- Release decision trend.

## Build Comparison

AIR compares:

- Current run vs previous run.
- Current build vs baseline.
- Module-by-module changes.
- New failures vs recurring failures.
- Resolved failures.
- Failure severity changes.
- Evidence totals.
- Confidence changes.

The current engine calculates comparison metrics for quality, confidence, pass rate, failures, duration, module coverage, journey coverage, and evidence totals.

The Historical Intelligence dashboard reads from `history.comparison` and must display `This is the first recorded execution` when `history.comparison.status` is `First Execution`.

## Historical Intelligence

The dashboard uses History Engine output to answer:

- What changed since the previous build?
- Is quality improving or declining?
- Which modules improved, declined, stayed stable, were added, or were removed?
- Which journeys regressed or recovered?
- Which failures are new, resolved, recurring, or critical?
- Why did release status change?
- Where should the team focus next?

No historical insight may be inferred unless it is backed by stored execution history.

## No Fake Chart Rule

If history is unavailable, show a clear roadmap/empty state rather than invented trend data.

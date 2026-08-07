# History Engine

The History Engine tracks quality over time.

## Purpose

AIR should answer how quality changes over time, not only what happened in the current execution.

The History Engine supports:

- Build comparison.
- Added, removed, and modified test detection.
- Quality trend analysis.
- Release trend analysis.
- Module trend analysis.
- Journey trend analysis.
- Failure trend analysis.
- Per-test failure timeline analysis.
- Recurring failure pattern detection.
- Flaky test detection across executions.
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
    "comparison": {
      "status": "First Execution | Compared",
      "metrics": {},
      "tests": {
        "added": [],
        "removed": [],
        "modified": [],
        "summary": {}
      },
      "modules": {
        "added": [],
        "removed": [],
        "improved": [],
        "regressed": [],
        "stable": [],
        "notExecuted": [],
        "summary": {}
      },
      "businessJourneys": {
        "added": [],
        "removed": [],
        "improved": [],
        "regressed": [],
        "stable": [],
        "notExecuted": [],
        "summary": {}
      },
      "failures": {
        "added": [],
        "resolved": [],
        "recurring": [],
        "severityChanges": [],
        "summary": {}
      },
      "release": {
        "current": "GO",
        "previous": "GO",
        "changed": false,
        "reasonChanges": {
          "added": [],
          "removed": []
        }
      }
    },
    "regressions": [],
    "improvements": [],
    "releaseTimeline": [],
    "executionIntelligence": {
      "failureTimelines": [],
      "recurringFailures": [],
      "activeRecurringFailures": [],
      "flakyTests": [],
      "focus": [],
      "summary": {}
    },
    "whatChanged": {
      "status": "First Execution | Compared",
      "summary": "",
      "items": []
    },
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
- Test count trend.
- Business health trend.
- Module coverage trend.
- Journey coverage trend.
- Duration trend.
- Coverage trend.
- Failure trend.
- Failure rate trend.
- Evidence trend.
- Release decision trend.
- Module health trends by module name.
- Business journey health trends by journey name.

Each trend point should include explicit execution context so the UI never has to show ambiguous numeric labels:

- `index`
- `build`
- `generatedAt`
- `generatedAtDisplay`
- `releaseDecision`
- `qualityScore`
- `label`
- `value`

The dashboard should display `Build <value>` or compact `B<value>` when build metadata exists. If build metadata is unavailable, display `Execution <index>` or compact `E<index>`. Hover tooltips should include build/execution label, execution date/time, quality score, and release decision.

Each numeric trend includes a summary object with:

- `highest`
- `lowest`
- `average`
- `direction`
- `delta`

For failure, flaky, failure-rate, and duration trends, lower values are treated as better when calculating direction.

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

The engine also owns structured comparison data for tests, modules, journeys, failures, and release reason changes. The dashboard should prefer these History Engine fields before calculating display-only fallbacks.

The Historical Intelligence dashboard reads from `history.comparison` and must display `This is the first recorded execution` when `history.comparison.status` is `First Execution`.

## Execution Intelligence

The History Engine also produces `history.executionIntelligence`.

This layer answers:

- Which failure patterns are new, recurring, persistent, historical, or recently fixed?
- Which recurring failures are still active in the current execution?
- Which tests appear flaky because their status changes across executions?
- What should the team focus on next based on historical movement?

Failure timeline records include:

- Test identity.
- Module, severity, and category.
- Timeline points across stored executions.
- Failed occurrence count.
- Occurrence rate.
- Consecutive failure count.
- Current status.
- Classification.
- Human-readable summary.

Flaky records include:

- Status timeline.
- Status-change count.
- Flakiness percentage.
- Confidence.
- Recommendation.

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

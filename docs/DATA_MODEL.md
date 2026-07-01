# AIR Data Model

`air-results.json` is the core contract of AIR. Every dashboard page must read from this model instead of raw Playwright JSON.

## Top-Level Schema

```json
{
  "schemaVersion": "1.0",
  "reportInfo": {},
  "project": {},
  "environment": {},
  "execution": {},
  "executionContext": {},
  "source": {},
  "summary": {},
  "discovery": {},
  "quality": {},
  "release": {},
  "releaseDecision": {},
  "businessJourneys": [],
  "modules": [],
  "tests": [],
  "failedTests": [],
  "evidence": {},
  "recommendations": [],
  "searchIndex": [],
  "history": {},
  "futureValidation": {},
  "navigation": [],
  "engineLog": [],
  "validation": {}
}
```

## Required Sections

| Section | Purpose |
| --- | --- |
| `reportInfo` | Report name, product name, generation metadata |
| `project` | Project, environment, build, branch, commit, trigger |
| `execution` | Execution ID, timing, duration, source |
| `executionContext` | Execution type, scope, coverage, confidence, validation level |
| `summary` | Totals, pass rate, quality, release decision |
| `discovery` | Test discovery, mapping status, suggestions, configuration issues |
| `quality` | Configurable quality score details |
| `release` | Canonical release decision, confidence, risk, reasons, warnings, blockers, required actions |
| `releaseDecision` | Compatibility alias for the current dashboard |
| `businessJourneys` | User-flow health |
| `modules` | Module health and coverage |
| `tests` | Normalized test records |
| `failedTests` | Failure-focused subset |
| `evidence` | Screenshots, videos, traces, logs, raw reports |
| `recommendations` | Suggested next actions |
| `searchIndex` | Normalized searchable entries across AIR sections |
| `history` | Historical executions, trends, comparisons, regressions, improvements |
| `futureValidation` | API, DB, security, performance placeholders |
| `engineLog` | AIR Core engine execution status |
| `validation` | AIR model contract validation result |

## Summary Contract

The `summary` section is built from normalized AIR test records.

```json
{
  "summary": {
    "total": 69,
    "passed": 69,
    "failed": 0,
    "skipped": 0,
    "flaky": 0,
    "interrupted": 0,
    "durationMs": 701308,
    "duration": "11m 41s",
    "passRate": 100,
    "failureRate": 0,
    "executionStatus": "Passed",
    "businessHealth": 100,
    "qualityScore": 100,
    "releaseDecision": "GO",
    "estimatedReleaseRisk": "LOW"
  }
}
```

`execution-summary-engine.js` owns only execution-level fields: totals, status counts, flaky count, duration, pass rate, failure rate, and execution status. Business health, quality score, and release decision are added by separate AIR engines.

## Discovery Contract

The Discovery Engine owns `discovery`.

```json
{
  "discovery": {
    "summary": {
      "discovered": 69,
      "mapped": 69,
      "unmapped": 0,
      "newTests": 0,
      "suggestions": 0,
      "configurationIssues": 0
    },
    "newTests": [],
    "mappedTests": [],
    "unmappedTests": [],
    "suggestions": [],
    "configurationIssues": [],
    "configSync": {
      "status": "Prepared",
      "autoUpdateEnabled": false,
      "message": "Discovery suggestions are report-only."
    }
  }
}
```

Discovery suggestions must not automatically modify AIR configuration.

## Execution Context Contract

The Execution Context Engine owns `executionContext`.

```json
{
  "executionContext": {
    "type": "Regression",
    "scope": "Whole Product",
    "executedModules": ["Authentication", "Billing"],
    "configuredModules": ["Authentication", "Billing", "Signup"],
    "coverage": 67,
    "confidence": 90,
    "validationLevel": "Partial Validation"
  }
}
```

AIR must not treat a module-only or partial execution as full product regression.

## Failed Tests Contract

The Failure Engine owns `failedTests[]`.

```json
{
  "failedTests": [
    {
      "testId": "example.spec.ts > should fail",
      "testName": "example.spec.ts > should fail",
      "module": "Authentication",
      "status": "failed",
      "severity": "Critical",
      "category": "Authentication",
      "businessImpact": "Critical business flow may be blocked.",
      "errorMessage": "Expected dashboard to be visible.",
      "evidence": [],
      "recommendedInvestigationAction": "Review login/session evidence, auth state, and user account configuration."
    }
  ]
}
```

## Business Journeys Contract

The Journey Engine owns `businessJourneys[]`.

```json
{
  "businessJourneys": [
    {
      "name": "Authentication",
      "critical": true,
      "total": 12,
      "passed": 12,
      "failed": 0,
      "skipped": 0,
      "interrupted": 0,
      "score": 100,
      "healthPercentage": 100,
      "coverage": 100,
      "testCount": 12,
      "failedCount": 0,
      "status": "Healthy",
      "risk": "Low",
      "executionState": "Executed",
      "modules": ["Authentication"],
      "affectedModules": ["Authentication"],
      "failedDependencies": [],
      "notExecutedSteps": [],
      "criticalSteps": ["Authentication"],
      "recommendation": "Continue monitoring this journey."
    }
  ]
}
```

If a journey step has no executed tests, it should be marked `Not Executed` or `Partial`, not failed by default.

## Evidence Contract

The Evidence Engine owns `evidence`.

```json
{
  "evidence": {
    "screenshots": [],
    "videos": [],
    "traces": [],
    "logs": [],
    "attachments": [],
    "rawReports": [],
    "byTest": {},
    "byModule": {},
    "summary": {
      "screenshots": 0,
      "videos": 0,
      "traces": 0,
      "logs": 0,
      "attachments": 0,
      "rawReports": 0,
      "total": 0
    }
  }
}
```

`playwrightReport` remains as a compatibility field for the current dashboard. Generic AIR integrations should prefer `rawReports[]`.

## Quality Contract

The Quality Engine owns `quality`.

```json
{
  "quality": {
    "score": 100,
    "confidence": 100,
    "grade": "Excellent",
    "factors": {
      "passRate": 100,
      "businessHealth": 100,
      "moduleHealth": 100,
      "journeyCoverage": 75,
      "evidenceReadiness": 100,
      "failureSeverity": 100
    },
    "weights": {
      "passRate": 0.65,
      "businessHealth": 0.35
    },
    "explanation": []
  }
}
```

The current dashboard still reads `summary.qualityScore` for compatibility. AIR Core should use `quality.score`.

## Release Contract

The Release Engine owns `release`.

```json
{
  "release": {
    "decision": "GO",
    "status": "GO",
    "confidence": 100,
    "risk": "LOW",
    "riskLevel": "LOW",
    "reasons": [
      "Critical journeys passed",
      "No blocker failures detected"
    ],
    "warnings": [],
    "blockers": [],
    "requiredActions": [],
    "recommendedAction": "Proceed with release monitoring.",
    "explanation": "AIR recommends GO because pass rate is 100%, business health is 100%, quality score is 100, and no configured release blockers were detected."
  }
}
```

Decision codes are:

- `GO`
- `CONDITIONAL_GO`
- `NO_GO`

`status` is the display value used by the current report:

- `GO`
- `CONDITIONAL GO`
- `NO GO`

`releaseDecision` remains as a compatibility alias until the dashboard is fully migrated to `release`.

## Search Contract

The Search Engine owns `searchIndex[]`.

```json
{
  "searchIndex": [
    {
      "id": "release-decision",
      "type": "release",
      "title": "Release Decision: GO",
      "target": "#executive",
      "status": "GO",
      "module": "",
      "priority": "LOW",
      "category": "",
      "keywords": ["release", "decision"],
      "text": "release Release Decision: GO GO LOW release decision confidence"
    }
  ]
}
```

Search entries are generated from AIR model sections only. The dashboard may use `target` to navigate, but the Search Engine does not inspect HTML or browser state.

## History Contract

The History Engine owns `history`.

```json
{
  "history": {
    "executions": [],
    "trends": {},
    "comparison": {
      "status": "First Execution",
      "current": {},
      "previous": {},
      "metrics": {
        "quality": {},
        "confidence": {},
        "passRate": {},
        "failures": {},
        "durationMs": {},
        "moduleCoverage": {},
        "journeyCoverage": {},
        "evidence": {}
      }
    },
    "regressions": [],
    "improvements": [],
    "summary": {
      "status": "First Execution",
      "totalExecutions": 1
    }
  }
}
```

History must work when only one execution exists. In that case AIR returns `First Execution` instead of fake comparison data.

## Engine Log Contract

The Engine Orchestrator owns `engineLog`.

```json
{
  "engineLog": [
    {
      "engine": "Execution Summary Engine",
      "status": "passed",
      "startedAt": "2026-06-30T00:00:00.000Z",
      "endedAt": "2026-06-30T00:00:00.000Z"
    }
  ]
}
```

When there are no failures, AIR must return:

```json
{
  "failedTests": []
}
```

## No Fake Values Rule

If a value is not available, AIR should show one of:

- `No Data Available`
- `Not Executed`
- `Planned`
- `Roadmap`

AIR must not invent values and present them as real execution data.

## Validation Contract

AIR Core validates the generated model before the dashboard is rendered.

```json
{
  "validation": {
    "valid": true,
    "warnings": []
  }
}
```

Validation warnings should not block report generation during local execution, but they should be treated as engineering issues before release.

# Journey Engine

The Journey Engine maps AIR module health and failure outputs to business journeys.

## Purpose

Executives and QA leads care about user journeys more than individual test files. The Journey Engine turns module health and failure impact into business-flow health.

## Examples

- Registration.
- Authentication.
- Profile Setup.
- Risk Profile.
- Compliance.
- Subscription.
- Payment.
- Dashboard.

## Configuration

Journey rules should live in `config/air.journeys.json`.

Each journey can define:

- Name.
- Criticality.
- Matching rules.
- Related modules.
- Release impact.

## Output

For each journey:

- ID.
- Total tests.
- Passed.
- Failed.
- Skipped.
- Score.
- Health.
- Coverage.
- Status.
- Health percentage.
- Related modules.
- Affected modules.
- Failed dependencies.
- Not-executed steps.
- Critical steps.
- Risk.
- Execution state.
- Recommendation.

## Current Implementation

Current engine:

- `scripts/air-core/engine/journey-engine.js`

Compatibility wrapper:

- `scripts/air-core/services/journey-health.js`

## Responsibilities

- Read business journey configuration.
- Map modules to business journey steps.
- Calculate journey step status: Healthy, Warning, Critical, Not Executed, or Partial.
- Calculate journey health percentage.
- Identify affected journeys from `failedTests[]` and module health.
- Identify not-executed journey steps.
- Calculate journey coverage percentage.
- Calculate journey test count and failed count.
- Generate journey risk and execution state.
- Generate journey-level recommendation.
- Return clean `businessJourneys[]` for `air-results.json`.
- Calculate overall business health.

## Non-Responsibilities

- No Playwright-specific logic.
- No UI rendering.
- No release decision logic.
- No module risk calculation.
- No evidence collection.
- No quality score logic.
- No raw execution-record dependency.

## Status Rules

| Status | Meaning |
| --- | --- |
| Healthy | Executed journey has no failures and meets health threshold |
| Warning | Executed journey has non-critical failures, skipped tests, interrupted tests, or low score |
| Critical | Critical journey has failed tests or failed module dependencies |
| Not Executed | No tests were executed for the journey step |
| Partial | Some configured or inferred module coverage is missing |

## Input Contract

Journey Engine accepts normalized AIR data:

- `modules[]`
- `failedTests[]`
- execution summary
- journey configuration
- thresholds configuration
- execution scope when available

Journey Engine must not consume raw Playwright JSON or raw framework-specific records. It depends on AIR Core outputs from Module Engine and Failure Engine.

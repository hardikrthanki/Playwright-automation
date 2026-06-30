# Module Engine

The Module Engine calculates health for product modules.

## Purpose

Product Health answers: which modules are healthy, which modules need attention, and what should QA do next?

## Module Data

Each module should include:

- Name.
- Criticality.
- Total tests.
- Passed.
- Failed.
- Skipped.
- Duration.
- Score.
- Coverage.
- Status.
- Risk.
- Recommendation.
- Evidence.

## Current Implementation

Current engine:

- `scripts/air-core/engine/module-engine.js`

Compatibility wrapper:

- `scripts/air-core/services/module-health.js`

## Responsibilities

- Map normalized tests to configured modules.
- Enrich tests with module name and criticality.
- Calculate module health.
- Calculate module coverage.
- Calculate module test count and failed count.
- Calculate module risk.
- Produce module recommendation.

## Non-Responsibilities

- No Playwright-specific logic.
- No UI rendering.
- No release decision logic.
- No evidence collection.
- No journey scoring.

## Configuration

Module mapping should live in `config/air.modules.json` and related config files.

## Status Rules

| Status | Meaning |
| --- | --- |
| Healthy | No major risk |
| Warning | Some failures, gaps, or incomplete validation |
| Critical | Blocking failures or critical journey impact |
| Planned | Module validation planned but not implemented |

## Future Direction

Module details should support module-specific widgets, such as MFA for Authentication or Stripe/payment signals for Billing.

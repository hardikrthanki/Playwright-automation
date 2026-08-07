# Integration Contracts

This document defines how RIE, AIR, RI, future OI, and PIOS exchange data.

## Contract Principles

- Products communicate through stable IDs and shared models.
- Product-owned data should remain with the owning product.
- Shared relationships should be stored in the Knowledge Graph.
- Each product must work when another product is not installed.
- Missing upstream data should produce a clear empty state, not fake intelligence.

## RIE to AIR

RIE may provide:

- Requirement IDs.
- Story IDs.
- Acceptance criterion IDs.
- Planned test scenarios.
- Test case IDs.
- Module and journey mappings.
- Criticality.
- Coverage expectations.

AIR may use this to:

- Show requirement-aware execution coverage.
- Identify automation gaps.
- Explain which requirements are affected by failures.

AIR must still work without RIE.

## AIR to RI

AIR may provide:

- Execution IDs.
- Summary results.
- Module health.
- Journey health.
- Failed tests.
- Flaky tests.
- Recurring failures.
- Evidence links.
- Historical comparison.
- Release-impacting execution signals.

RI may use this to:

- Evaluate testing readiness.
- Evaluate evidence readiness.
- Assess release risk.
- Support release gate decisions.

RI must not modify AIR execution records.

## RI to PIOS

RI may provide:

- Release IDs.
- Release scope.
- Release decisions.
- Approval status.
- Accepted risks.
- Required actions.
- Release history.

PIOS may use this to:

- Provide lifecycle visibility.
- Connect releases to requirements, executions, defects, and production outcomes.

## Future OI Contracts

OI may provide:

- Production incident IDs.
- Affected modules.
- Affected journeys.
- Monitoring alerts.
- Availability summaries.
- MTTR.
- Customer impact.
- Related release or deployment.

PIOS may connect OI output back to RIE, AIR, and RI for learning loops.

## Minimal Shared Envelope

Any cross-product payload should include:

```json
{
  "id": "entity-id",
  "type": "entity-type",
  "sourceProduct": "RIE | AIR | RI | OI | PIOS",
  "projectId": "project-id",
  "productId": "product-id",
  "version": "contract-version",
  "generatedAt": "ISO-8601",
  "data": {}
}
```

## Compatibility Rule

Contracts should be additive where possible.

Removing or renaming fields requires a version change and migration plan.


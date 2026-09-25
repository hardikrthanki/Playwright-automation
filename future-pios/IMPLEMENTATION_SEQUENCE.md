# Future Implementation Sequence

Do not start these steps against the current AIR codebase until explicitly approved.

## Phase 0 — Structure only (this folder)

- Architecture overview
- Product boundaries
- Contracts
- Schemas
- Demo ID examples
- Empty stubs

**Status: in progress in `future-pios/`**

## Phase 1 — AIR boundary correction (later)

When approved, change current AIR so it emits **Validation Readiness** instead of governed release decisions.

Target mapping:

| Current AIR output | Future AIR output | Owner of final decision |
| --- | --- | --- |
| GO | SUFFICIENT | RI |
| CONDITIONAL GO | CONDITIONAL | RI |
| NO GO | INSUFFICIENT | RI |

Do not implement Phase 1 until this scaffold is reviewed.

## Phase 2 — Stable IDs + demo traceability

Use onboarding/subscription suite as the demo chain:

```text
Requirement → Journey → Test → Execution → Evidence
```

## Phase 3 — Thin Project Overview

Aggregation only. No new intelligence engine.

## Phase 4 — RIE MVP

Requirements around the same onboarding journey.

## Phase 5 — RI MVP

Consumes RIE + AIR. Owns GO / CONDITIONAL GO / NO-GO with human governance.

## Phase 6 — OI

After release flow is stable.

## Phase 7 — Knowledge + advanced AI

After evidence and relationships are reliable.

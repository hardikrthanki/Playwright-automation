# Contract: AIR → RI (Future)

## Today (current project)

AIR emits a release-style decision:

```text
GO | CONDITIONAL GO | NO GO
```

That remains true in the current live AIR until Phase 1 is approved.

## Future contract

AIR provides **validation readiness** to RI.

```text
AIR
 ↓
Validation Readiness (SUFFICIENT | CONDITIONAL | INSUFFICIENT)
 + reasons
 + blockers
 + warnings
 + evidence
 + confidence
 + quality signals
 ↓
RI
 ↓
Combined release readiness
 + gates
 + approvals
 + human governance
 ↓
GO | CONDITIONAL GO | NO-GO
```

## AIR may send

- Execution ID
- Validation readiness status
- Confidence
- Reasons / blockers / warnings
- Failed test refs
- Affected modules / journeys
- Evidence IDs / links
- Quality signals

## AIR must not send as authoritative

- Final GO
- Final CONDITIONAL GO
- Final NO-GO
- Approvals
- Accepted release risks

## RI may consume

AIR validation readiness as one input among:

- Requirement readiness (from RIE)
- Defect readiness
- Technical / business / deployment readiness
- Evidence readiness
- Release risks and gates

## Independence

AIR must still work without RI installed.
RI must still work when AIR data is missing (clear empty state, no fake intelligence).

# Validation Readiness Contract (Future)

This is the future replacement for AIR's current release-decision output.

## Values

```text
SUFFICIENT
CONDITIONAL
INSUFFICIENT
```

## Meaning

| Value | Meaning |
| --- | --- |
| SUFFICIENT | Validation evidence meets configured criteria |
| CONDITIONAL | No hard blockers, but warnings / gaps need review |
| INSUFFICIENT | Blockers or threshold failures make validation incomplete |

## Payload shape

See `../schemas/validation-readiness.schema.json`.

Minimum fields:

```json
{
  "validationReadiness": "CONDITIONAL",
  "confidence": 82,
  "reasons": [],
  "blockers": [],
  "warnings": [],
  "requiredActions": [],
  "evidence": {},
  "affectedModules": [],
  "affectedJourneys": [],
  "failedTests": [],
  "qualitySignals": {}
}
```

## Ownership stamp

Every payload should declare:

```json
{
  "ownership": {
    "product": "AIR",
    "signal": "validationReadiness",
    "governedReleaseDecisionOwner": "RI"
  }
}
```

## Mapping from current AIR (migration aid only)

| Current | Future |
| --- | --- |
| GO | SUFFICIENT |
| CONDITIONAL GO | CONDITIONAL |
| NO GO | INSUFFICIENT |

Do not apply this mapping in the live project until Phase 1 is approved.

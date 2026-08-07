# ADR-003: Independent Products

## Status

Accepted

## Context

The ecosystem should be commercially and technically flexible. Some teams may adopt only AIR, only RIE, or only RI.

## Decision

Each product must remain useful independently.

- AIR must work without RIE or RI.
- RIE must work without AIR or RI.
- RI must work without RIE or AIR.

Connected mode should add value, but it must not be mandatory for product usefulness.

## Consequences

- Products need clear local data contracts.
- Missing upstream data should result in clean empty states.
- Integrations should be additive.
- Shared platform adoption can happen gradually.


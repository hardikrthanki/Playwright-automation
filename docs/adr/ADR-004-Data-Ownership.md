# ADR-004: Data Ownership Boundaries

## Status

Accepted

## Context

Multiple products reference the same lifecycle entities. Without ownership rules, products could duplicate or overwrite each other's data.

## Decision

No product owns another product's data.

Ownership:

- PIOS owns shared platform data.
- RIE owns requirements, stories, acceptance criteria, dependencies, and planned coverage.
- AIR owns executions, automation results, evidence, failure intelligence, and historical execution data.
- RI owns releases, gates, risks, approvals, and release decisions.
- OI will own production incidents and operational outcomes.

Products may reference external data through shared IDs and Knowledge Graph relationships, but must not modify data they do not own.

## Consequences

- Data synchronization risk is reduced.
- Auditability improves.
- Integration contracts become necessary.
- Cross-product updates must go through the owning product or approved APIs.


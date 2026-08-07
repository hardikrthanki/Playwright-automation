# ADR-002: Knowledge Graph as Shared Relationship Engine

## Status

Accepted

## Context

RIE, AIR, and RI all need to understand relationships between requirements, tests, evidence, defects, releases, and production outcomes. If each product stores its own relationships independently, traceability will become inconsistent.

## Decision

PIOS will provide a shared Knowledge Graph for entity relationships.

Products may own their own data, but relationships between products should be represented through graph nodes and edges with source, confidence, and evidence metadata.

## Consequences

- Traceability becomes consistent across products.
- AI and reporting can reason across the lifecycle.
- Inferred relationships must include confidence.
- Low-confidence relationships require confirmation.
- Products should query the graph instead of duplicating relationship logic.


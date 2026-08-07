# ADR-001: PIOS as Platform

## Status

Accepted

## Context

The ecosystem includes multiple intelligence products: RIE, AIR, RI, and future OI. There was a risk that PIOS could become another dashboard that duplicates product-specific functionality.

## Decision

PIOS is the shared platform layer, not a fourth business application.

PIOS owns shared infrastructure:

- Authentication.
- Organizations.
- Projects and products.
- Users and roles.
- Shared domain model.
- Knowledge Graph.
- Search.
- AI services.
- Audit.
- Notifications.
- Integrations.
- API gateway.
- Reporting and export foundation.

RIE, AIR, RI, and future OI remain independent products.

## Consequences

- Product boundaries remain clean.
- Shared infrastructure can evolve once and serve all products.
- PIOS must not duplicate RIE, AIR, RI, or OI screens.
- Cross-product intelligence depends on shared IDs and relationships.


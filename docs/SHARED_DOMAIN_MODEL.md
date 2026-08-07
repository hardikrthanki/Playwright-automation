# Shared Domain Model

The shared domain model defines the entities that RIE, AIR, RI, OI, and PIOS use to communicate.

The model should remain product-neutral. Product-specific data belongs to the owning product, while shared IDs and relationships belong to PIOS.

## Core Entities

| Entity | Description | Primary Owner |
| --- | --- | --- |
| Organization | Customer or internal organization | PIOS |
| Project | Delivery context under a product or workspace | PIOS |
| Product | Long-lived product being built and released | PIOS |
| User | Person using the platform | PIOS |
| Role | Permission role | PIOS |
| Team | Group of users | PIOS |
| Requirement | Business or product requirement | RIE |
| Epic | High-level work package | RIE |
| Feature | Product capability | RIE |
| Story | User story or implementation unit | RIE |
| Acceptance Criterion | Testable condition for a story or requirement | RIE |
| Dependency | Relationship or prerequisite between entities | RIE / PIOS graph |
| Module | Functional area of the product | Shared reference |
| Journey | Business or user workflow | Shared reference |
| API | Service endpoint or contract | Shared reference |
| Database Table | Data storage element | Shared reference |
| Test Scenario | Business validation scenario | RIE |
| Test Case | Manual or automated test case | RIE |
| Automation Test | Framework-specific automated test | AIR |
| Execution | Test run or validation run | AIR |
| Execution Result | Result of a test or attempt | AIR |
| Evidence | Screenshot, video, trace, log, API response, DB record, or document | AIR / shared evidence service |
| Defect | Bug or issue found during validation | RI / external issue tracker |
| Risk | Release, requirement, execution, or operational risk | RI |
| Release | Planned deployment or delivery package | RI |
| Release Gate | Release readiness rule | RI |
| Approval | Human approval or override | RI |
| Decision | GO, CONDITIONAL GO, NO-GO, or pending decision | RI |
| Environment | Test, staging, UAT, production, or custom environment | PIOS |
| Build | Build or deployment artifact | AIR / RI |
| Deployment | Deployment event | RI / OI |
| Production Incident | Production issue or operational event | OI |

## Stable Identifier Pattern

Every shared entity should support:

```json
{
  "id": "entity-unique-id",
  "externalId": "source-system-id",
  "source": "manual | air | rie | ri | jira | azure-devops | github | playwright | other",
  "projectId": "project-id",
  "productId": "product-id",
  "createdAt": "ISO-8601",
  "updatedAt": "ISO-8601"
}
```

Product-owned records may include additional fields, but the shared identity contract should remain stable.

## Core Relationships

```text
Product has Projects
Project has Requirements
Requirement has Stories
Story has Acceptance Criteria
Acceptance Criterion has Test Cases
Test Case may have Automation Tests
Automation Test produces Execution Results
Execution Result has Evidence
Execution Result may create or reference Defects
Defect affects Requirements, Modules, Journeys, or Releases
Release contains Requirements, Stories, Defects, Builds, and Test Executions
Release has Risks, Gates, Approvals, and Decisions
Production Incident may affect Release, Module, Journey, or Requirement
```

## Relationship Rules

- Relationships should be explicit whenever possible.
- Inferred relationships must include confidence and source.
- Low-confidence relationships require human confirmation.
- Products should read relationship data from the Knowledge Graph, not maintain competing relationship stores.
- A relationship may be directional and should support traversal in both directions.

## Evidence Quality

Evidence should be classified by source and strength.

Examples:

| Evidence Type | Strength |
| --- | --- |
| Passing UI execution with screenshot | Medium |
| Passing UI + API + DB validation | High |
| Manual note without artifact | Low |
| Failed test with screenshot, trace, and logs | High |
| Requirement document reference | Medium |
| Approved release gate | High |

Coverage confidence should depend on evidence quality, not only link count.


# Product Boundaries

This document defines where functionality belongs across PIOS, RIE, AIR, RI, and future OI.

## Boundary Rule

Place a feature in the product that owns the primary question.

## PIOS

Use PIOS when the question is:

- Who has access?
- Which project or product is this?
- How are entities related?
- Which integrations are connected?
- Where is shared data stored?
- What changed across the platform?

PIOS owns:

- Authentication.
- Organizations.
- Projects and products.
- Users and roles.
- Shared IDs.
- Knowledge Graph.
- Shared search.
- Integrations.
- Audit.
- Notifications.
- API gateway.

PIOS does not own requirement quality, execution analysis, or release decisions.

## RIE

Use RIE when the question is:

- What is required?
- Is the requirement clear?
- What depends on it?
- Is it testable?
- Is it covered?
- What changed?

RIE owns:

- Requirements.
- Stories.
- Acceptance criteria.
- Requirement dependencies.
- Requirement quality.
- Planned coverage.
- Requirement change history.

## AIR

Use AIR when the question is:

- What was tested?
- What passed or failed?
- What was skipped or not executed?
- What evidence exists?
- Which modules or journeys are healthy?
- Which failures are new, recurring, or flaky?
- What changed between executions?

AIR owns:

- Executions.
- Automation results.
- Evidence.
- Failure intelligence.
- Module and journey execution health.
- Historical execution intelligence.
- Execution recommendations.

## RI

Use RI when the question is:

- Is the release ready?
- What risk remains?
- Which gate is blocked?
- Who approved it?
- Should the release proceed?

RI owns:

- Releases.
- Release scope.
- Release gates.
- Release risks.
- Approvals.
- Release decisions.
- Release history.

## OI

Use OI when the question is:

- What happened in production?
- Which incidents occurred?
- Which release or module was affected?
- What is operational health?
- What is customer impact?

OI owns:

- Production incidents.
- Monitoring summaries.
- Availability.
- Operational health.
- MTTR.
- Production outcome intelligence.

OI is future scope.

## No Cross-Ownership

Products may reference each other's data through shared IDs and the Knowledge Graph, but they should not edit data owned by another product.

Examples:

- AIR can reference a RIE requirement but cannot edit it.
- RI can reference AIR evidence but cannot alter it.
- RIE can link planned coverage to AIR automation tests but cannot rewrite execution results.


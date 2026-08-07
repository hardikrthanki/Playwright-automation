# Knowledge Graph Specification

The Knowledge Graph is the relationship engine at the center of PIOS.

It connects requirements, tests, evidence, defects, releases, and production outcomes so every product can answer impact and traceability questions consistently.

## Purpose

The graph should answer:

- What does this requirement affect?
- Which tests validate this acceptance criterion?
- Which automation results prove this scenario?
- Which defects block this release?
- Which modules repeatedly create release risk?
- Which production incidents relate to a requirement, release, or module?

## Node Types

Initial node types:

- Product
- Project
- Requirement
- Epic
- Feature
- Story
- AcceptanceCriterion
- Dependency
- Module
- Journey
- API
- DatabaseTable
- TestScenario
- TestCase
- AutomationTest
- Execution
- ExecutionResult
- Evidence
- Defect
- Risk
- Release
- ReleaseGate
- Approval
- Decision
- Environment
- Build
- Deployment
- ProductionIncident

## Edge Types

Initial edge types:

| Edge | Meaning |
| --- | --- |
| `HAS_REQUIREMENT` | Project or product contains requirement |
| `HAS_STORY` | Requirement contains story |
| `HAS_ACCEPTANCE_CRITERION` | Story or requirement contains acceptance criterion |
| `DEPENDS_ON` | Entity depends on another entity |
| `AFFECTS` | Entity affects module, journey, API, DB table, release, or user role |
| `COVERS` | Test case covers requirement or acceptance criterion |
| `AUTOMATES` | Automation test automates test case |
| `EXECUTED_AS` | Automation test produced execution result |
| `HAS_EVIDENCE` | Execution result has evidence |
| `FOUND_DEFECT` | Execution result created or referenced defect |
| `BLOCKS` | Defect, dependency, or risk blocks another entity |
| `INCLUDED_IN_RELEASE` | Entity is included in release scope |
| `EXCLUDED_FROM_RELEASE` | Entity is explicitly excluded from release scope |
| `HAS_GATE` | Release has readiness gate |
| `HAS_APPROVAL` | Release has approval |
| `PRODUCED_DECISION` | Release produced decision |
| `DEPLOYED_AS` | Release produced deployment |
| `CAUSED_OR_RELATED_TO` | Deployment, release, module, or defect relates to production incident |

## Edge Metadata

Every edge should support:

```json
{
  "id": "edge-id",
  "from": "source-node-id",
  "to": "target-node-id",
  "type": "COVERS",
  "source": "manual | imported | configured | inferred | validated-inference",
  "confidence": 100,
  "createdAt": "ISO-8601",
  "updatedAt": "ISO-8601",
  "createdBy": "user-or-system",
  "evidence": [],
  "notes": ""
}
```

## Confidence Rules

| Source | Expected Confidence |
| --- | --- |
| Manual confirmed link | 100 |
| Imported explicit link | 90-100 |
| Configured mapping | 80-100 |
| Validated inference | 60-90 |
| Unconfirmed inference | Below 60 |

Unconfirmed inference should be displayed as possible impact, not confirmed truth.

## Product Usage

RIE uses the graph to:

- Show requirement dependencies.
- Identify missing coverage.
- Trace acceptance criteria to tests.
- Analyze change impact.

AIR uses the graph to:

- Map automation results to modules, journeys, requirements, and evidence.
- Identify impacted requirements from failed tests.
- Explain recurring failure impact.

RI uses the graph to:

- Evaluate release scope.
- Validate readiness gates.
- Identify requirement, defect, and evidence gaps.
- Explain release decisions.

OI will use the graph to:

- Connect production incidents to releases, modules, requirements, and defects.

## Graph Principle

Traceability before intelligence.

AI may summarize, prioritize, or recommend, but it must not invent graph relationships without a source, confidence level, and review path.


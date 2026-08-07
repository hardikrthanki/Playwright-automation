# PIOS Architecture

PIOS means Product Intelligence Operating System.

PIOS is the shared platform layer for a modular engineering intelligence ecosystem. It is not a fourth business application and should not duplicate the capabilities of RIE, AIR, RI, or future products.

## Vision

PIOS provides shared services that allow product teams to connect requirements, tests, evidence, defects, releases, and production outcomes into one explainable intelligence chain.

The platform hosts independent intelligence products:

```text
                  PIOS Platform
--------------------------------------------------
Authentication
Organizations
Projects
Users & Roles
Shared Domain Model
Knowledge Graph
Shared Search
AI Services
Audit & Activity
Notifications
Integrations
Reporting & Export
API Gateway
--------------------------------------------------
        |              |              |
        v              v              v
       RIE            AIR            RI
```

Future product:

- OI: Operational Intelligence

## Core Philosophy

Evidence before Intelligence. Intelligence before Automation. Automation before Visualization.

```text
Evidence
  -> Relationships
  -> Intelligence
  -> Recommendations
  -> Visualization
```

PIOS products must not present unsupported conclusions. Every meaningful insight should be traceable to evidence, explicit relationships, validated mappings, or clearly marked assumptions.

## Product Questions

Each product owns one primary question.

| Product | Primary Question | Ownership |
| --- | --- | --- |
| RIE | Are we building the right thing? | Requirements, acceptance criteria, dependencies, requirement quality, planned coverage |
| AIR | Did we validate the right thing correctly? | Execution, evidence, failures, history, module and journey health |
| RI | Can we safely release? | Release scope, readiness, gates, approvals, risk, release decision |
| OI | What happened in production? | Incidents, monitoring, operational health, production outcomes |

## Platform Responsibilities

PIOS owns shared infrastructure:

- Authentication.
- Organizations.
- Projects and product workspaces.
- Users and roles.
- Shared domain identifiers.
- Knowledge graph and relationships.
- Shared search.
- AI service access.
- Audit and activity history.
- Notifications.
- Integrations.
- API gateway.
- Reporting and export foundation.

PIOS answers platform questions:

- Who owns this product or project?
- Which intelligence products are enabled?
- Which integrations exist?
- Who has access?
- How are entities related?
- Where is shared data stored?
- Which AI services are available?
- What was changed and by whom?

PIOS must not answer product-specific intelligence questions such as:

- Is this requirement complete?
- Why did this test fail?
- Should this release go live?

Those belong to RIE, AIR, and RI.

## Independent Product Principle

Every intelligence product must remain valuable when used independently.

- A team can use AIR without RIE or RI.
- A team can use RIE without AIR or RI.
- A team can use RI without RIE or AIR.
- PIOS makes products stronger together, but should not make a product unusable alone.

## Screen Principle

Every screen should answer one clear question.

Examples:

| Screen | Question |
| --- | --- |
| RIE Dashboard | What are we building? |
| Requirement Detail | What exactly does this requirement mean? |
| Dependency Map | What does this affect? |
| AIR Dashboard | What happened during execution? |
| Module Dashboard | Which module needs attention? |
| Evidence Viewer | What proves this result? |
| Historical Dashboard | What changed? |
| RI Dashboard | Can we release? |
| Risk Dashboard | What could stop the release? |

If a screen answers multiple unrelated questions, split it or use progressive disclosure.

## Shared Product Structure

Each product should feel consistent:

```text
Dashboard
  -> Repository / List
  -> Detail
  -> Intelligence
  -> History
  -> Reports
  -> Settings
```

Example product navigation:

| RIE | AIR | RI |
| --- | --- | --- |
| Dashboard | Dashboard | Dashboard |
| Requirements | Executions | Releases |
| Requirement Detail | Module Intelligence | Readiness |
| Dependencies | Journey Intelligence | Risk |
| Coverage | Evidence | Approvals |
| History | History | History |
| Reports | Reports | Reports |
| Settings | Settings | Settings |

## Data Ownership Rule

No product owns another product's data.

| Owner | Owns | Other Products May |
| --- | --- | --- |
| PIOS | Users, roles, projects, organizations, integrations, shared IDs, relationships, audit | Reference platform entities |
| RIE | Requirements, stories, acceptance criteria, dependencies, planned coverage | Reference requirements |
| AIR | Executions, automation results, evidence, failure intelligence, module/journey execution health | Reference execution results |
| RI | Releases, gates, risk, approvals, release decisions | Reference release decisions |
| OI | Incidents, production telemetry summaries, operational outcomes | Reference production outcomes |

Example:

- AIR may reference requirements from RIE, but must not edit requirements.
- RI may consume AIR execution results, but must not modify them.
- RIE may plan coverage, but AIR owns actual execution outcomes.

## Development Sequence

1. Preserve AIR as the mature execution intelligence product.
2. Define PIOS Core models, relationships, and documentation.
3. Build Knowledge Graph foundations.
4. Build RIE MVP.
5. Build RI MVP.
6. Connect RIE -> AIR -> RI through shared IDs.
7. Add AI assistant capabilities after relationships and evidence are reliable.
8. Reserve OI for production intelligence after release intelligence is stable.

## Non-Goals

PIOS should not:

- Replace Jira, Azure DevOps, GitHub, GitLab, Playwright, Selenium, TestRail, Postman, CI/CD, or monitoring tools.
- Become one large mixed dashboard.
- Duplicate AIR functionality in RIE or RI.
- Allow AI to make unreviewed governance decisions.
- Infer critical relationships without evidence or confirmation.


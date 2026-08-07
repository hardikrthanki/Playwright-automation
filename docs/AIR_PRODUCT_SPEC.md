# AIR Product Specification

AIR means Automation Intelligence Report.

AIR is the execution intelligence product in the PIOS ecosystem.

## Primary Question

Did we validate the right thing correctly?

## Vision

AIR turns automation and validation execution results into explainable quality intelligence, evidence, historical trends, and release-impacting recommendations.

AIR is not a Playwright report. Playwright is one input source. AIR must remain framework-independent and able to support future execution sources such as Selenium, Cypress, Robot Framework, Appium, Postman, API validation, database validation, performance checks, security checks, accessibility checks, and visual validation.

## Why AIR Exists

Traditional automation reports answer:

- Which tests passed?
- Which tests failed?
- Where are the screenshots or traces?

AIR answers:

- What was tested?
- What passed, failed, skipped, blocked, or not executed?
- Which modules are healthy?
- Which business journeys are affected?
- Which failures are new, recurring, or flaky?
- What evidence supports the result?
- What changed compared with previous executions?
- What should QA or engineering investigate next?

## Responsibilities

AIR owns:

- Automation and validation executions.
- Normalized test results.
- Execution summaries.
- Module execution health.
- Business journey execution health.
- Failure intelligence.
- Evidence management.
- Historical execution intelligence.
- Search over execution data.
- Execution recommendations.
- AIR report generation.

## Data Ownership

AIR owns:

- Executions.
- Test results.
- Automation metadata.
- Execution attempts and retry status.
- Failure records.
- Evidence.
- Screenshots.
- Videos.
- Traces.
- Logs.
- Raw execution reports.
- Historical execution data.
- Execution-level AI insights.

AIR may reference:

- RIE requirements.
- RIE acceptance criteria.
- RIE test cases.
- RI releases.
- RI release decisions.
- PIOS shared projects, users, modules, journeys, and graph relationships.

AIR must not edit:

- Requirements.
- Acceptance criteria.
- Release decisions.
- Release approvals.
- Users, roles, or organizations.

## Core Capabilities

### Execution Intelligence

AIR should explain:

- Total tests.
- Passed tests.
- Failed tests.
- Skipped tests.
- Blocked or not-executed tests.
- Flaky tests.
- Retry behavior.
- Execution duration.
- Pass rate.
- Failure rate.
- Execution context.

AIR must not treat partial validation as full regression.

### Module Intelligence

AIR should calculate:

- Module health.
- Module coverage.
- Module test count.
- Module failed count.
- Module risk.
- Module recommendation.
- Module evidence.

Module filters must be data-driven and hide modules that do not match the selected status.

### Journey Intelligence

AIR should calculate:

- Journey health.
- Journey status.
- Affected journey steps.
- Failed dependencies.
- Not-executed steps.
- Journey-level recommendation.

Journey results must not invent data. If a journey step has no executed tests, AIR should show `Not Executed`, `Partial`, or `No Data Available`, not a false failure.

### Failure Intelligence

AIR should explain failures in plain language:

- Failure summary.
- Expected behavior.
- Observed behavior.
- Business or testing impact.
- Cause status.
- Technical error.
- Evidence links.
- Attempt-level evidence.
- Retry and flaky status.
- Recommended investigation action.

AIR should classify failures as product, automation, environment, test-data, external dependency, or unknown when enough data exists. Fallback explanations must be clearly marked.

### Evidence Management

AIR should preserve:

- Original screenshots.
- Annotated failure previews when reliable location data exists.
- Videos.
- Traces.
- Logs.
- Raw framework reports.

Raw reports must not be counted as sufficient per-test failure evidence.

Evidence metrics should distinguish:

- Evidence items.
- Tests with evidence.
- Attempts with evidence.

### Historical Intelligence

AIR should compare executions over time:

- Current vs previous execution.
- Quality trend.
- Pass rate trend.
- Failure trend.
- Flaky trend.
- Module trend.
- Journey trend.
- Release trend.
- New failures.
- Resolved failures.
- Recurring failures.
- Persistent failures.
- Recently fixed failures.
- Historical failure timelines.

Historical insight must use stored execution data. AIR must show a clear first-execution state when no history exists.

### Search

AIR search should cover:

- Modules.
- Tests.
- Failed tests.
- Business journeys.
- Evidence.
- Recommendations.
- Release reasons.
- Quality explanations.
- Roadmap items.

### Recommendations

AIR recommendations should be execution-focused.

Examples:

- Rerun affected failed tests.
- Review recurring failure evidence.
- Stabilize flaky tests before release gating.
- Add API validation for high-risk modules.
- Capture evidence for critical journeys.

Recommendations must show their source where possible.

## Explicitly Out of Scope

AIR does not own:

- Requirement authoring. That belongs to RIE.
- Requirement quality review. That belongs to RIE.
- Requirement approval. That belongs to RIE or external planning tools.
- Release governance. That belongs to RI.
- Release approvals. That belongs to RI.
- Final release decision authority. That belongs to RI and authorized users.
- User management. That belongs to PIOS.
- Project or organization management. That belongs to PIOS.
- Production operations. That belongs to future OI.

## AIR in Connected Mode

When connected to PIOS and RIE, AIR may receive:

- Requirement IDs.
- Acceptance criterion IDs.
- Test case IDs.
- Module and journey mappings.
- Criticality.
- Coverage expectations.

When connected to RI, AIR may send:

- Execution summaries.
- Failed tests.
- Flaky tests.
- Recurring failures.
- Evidence links.
- Module health.
- Journey health.
- Historical comparison.

AIR must still work without RIE or RI.

## Screen Set

AIR screens may include:

- Executive dashboard.
- Execution summary.
- Product health.
- Module intelligence.
- Journey intelligence.
- Failed tests.
- Evidence center.
- Historical intelligence.
- Search.
- AI insights.
- AIR Core.
- Roadmap.
- Reports.
- Settings.

Every screen should answer one clear question.


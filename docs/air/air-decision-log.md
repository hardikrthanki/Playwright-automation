# AIR Decision Log

Product: Automation Intelligence Reporting  
Purpose: Capture important product, design, and architecture decisions.

## Decision 001 - AIR Is Project Independent

Status: Accepted

AIR should not be tied only to OOLTool. The current implementation is generated from the OOLTool Playwright project, but the model should support any project that can provide structured execution data.

Reason:

- Keeps AIR reusable.
- Supports future multi-project dashboards.
- Avoids rewriting the report for every client.

## Decision 002 - Dark Theme Is The Default

Status: Accepted

AIR uses a dark dashboard style by default.

Reason:

- Matches enterprise monitoring and intelligence dashboards.
- Helps status colors stand out.
- Works well for presentation mode.
- Matches the AIR dashboard concept direction.

## Decision 003 - Dashboard Is Decision-Focused

Status: Accepted

AIR should show release decision and business health before raw test details.

Reason:

- Clients and product owners need fast answers.
- Raw Playwright results are useful but too technical as the first view.
- The report should answer "can we release?" quickly.

## Decision 004 - Evidence Is Mandatory

Status: Accepted

AIR must link to evidence such as Playwright HTML report, raw JSON, screenshots, videos, traces, and error context.

Reason:

- A report without evidence is only a claim.
- QA and development teams need proof and reproducibility.
- Evidence helps client trust.

## Decision 005 - Widgets Must Be Reusable

Status: Accepted

AIR should be built around reusable report widgets such as metric cards, tables, badges, charts, journey chips, and recommendation cards.

Reason:

- Reduces duplication.
- Makes future React implementation easier.
- Supports plugin-driven dashboards.

## Decision 006 - Plugins Are Preferred Over Hardcoding

Status: Proposed

Future integrations should use plugins instead of hardcoded project logic.

Reason:

- AIR will need Playwright, API, database, security, performance, Jira, Azure DevOps, and Slack integrations.
- Plugin boundaries keep the core report engine stable.

## Decision 007 - Static HTML Comes Before Full App

Status: Accepted

The current phase uses a generated static HTML report instead of building a full React app immediately.

Reason:

- Fastest path to client-ready output.
- No server required.
- Easy to share locally or export as PDF.
- Lets us validate product structure before investing in a full platform.

## Decision 008 - Controlled Flows Are Separate

Status: Accepted

Flows requiring external links, locked account state, reset URLs, or checkout URLs should be automated separately and shown as controlled/external flows.

Reason:

- Keeps normal regression stable.
- Avoids false failures when external state is unavailable.
- Makes report scope honest.

## Decision 009 - Release Rules Must Be Configurable

Status: Accepted

Release thresholds should start with default rules but eventually move into configuration.

Reason:

- Different clients have different risk tolerance.
- Some projects may treat skipped tests as blockers.
- Business health scoring may vary by module criticality.

## Decision 010 - Client Language Comes First

Status: Accepted

AIR should use client-readable wording before technical wording.

Reason:

- The report is intended for QA and non-QA stakeholders.
- Business validation is easier to understand than raw spec names.
- Technical detail is still available in the detailed test results page.

## Decision 011 - AIR Documentation Is Split Into Three Documents

Status: Accepted

AIR documentation will be maintained as:

- Product Specification
- Design System And Wireframes
- Decision Log

Reason:

- Product owners can review requirements without UI noise.
- Designers can work from the design system.
- Developers can understand architecture decisions and rationale.

## Decision 012 - AIR Should Preserve Missing-Data States

Status: Accepted

If Playwright JSON is missing, the report should still generate and explain what is missing.

Reason:

- Prevents broken-looking reports.
- Helps users recover quickly.
- Keeps the report generator reliable even after cleanup.

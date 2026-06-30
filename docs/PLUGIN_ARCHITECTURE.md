# Plugin Architecture

AIR should grow through adapters and plugins rather than hardcoded integrations.

## Plugin Types

| Plugin Type | Purpose |
| --- | --- |
| Parser adapter | Convert framework output to AIR model |
| Evidence adapter | Attach artifacts from external systems |
| Validation adapter | Add API, DB, performance, security, accessibility data |
| Export adapter | Generate PDF, HTML, JSON, evidence package |
| Integration adapter | Connect GitHub, Jira, Azure DevOps, Slack, Teams |

## Design Goals

- Keep AIR Core framework-independent.
- Avoid project-specific logic in engines.
- Allow new tools without changing dashboard logic.
- Validate plugin output against AIR schema.

## Future Examples

- Cypress parser.
- Selenium parser.
- Postman/API validation adapter.
- JMeter performance adapter.
- OWASP/ZAP security adapter.
- Jira defect sync adapter.


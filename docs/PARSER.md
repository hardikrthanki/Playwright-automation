# Parser

The parser converts raw framework output into the AIR model.

## Current Parser Adapter

Current input:

- `test-results/results.json`
- Playwright artifacts where available
- AIR configuration from `config/air.*.json`

Current output:

- `execution-report/air-results.json`

Command:

```powershell
npm run air:parse
```

## Parser Service

AIR Core should call the parser service, not a framework parser directly.

Current service:

- `scripts/air-core/services/parser-service.js`

Current adapter:

- `scripts/air-core/parser/playwright-parser.js`

The parser service selects an adapter using `AIR_FRAMEWORK` or config. If the requested adapter is not available, AIR falls back to Playwright and records an adapter warning in the normalized model.

## Parser Responsibilities

- Read raw execution results.
- Normalize test records.
- Map tests to modules.
- Map tests to business journeys.
- Extract duration, status, retries, errors, attachments.
- Build evidence references.
- Preserve framework metadata without leaking framework-specific logic into the dashboard.

## Parser Non-Responsibilities

- It should not render UI.
- It should not decide page layout.
- It should not hardcode OOLTool-specific behavior.
- It should not invent missing data.

## Future Adapter Model

Each framework should get its own parser adapter:

- Playwright
- Cypress
- Selenium
- Robot Framework
- Appium
- Postman
- JMeter

All adapters must output the same `air-results.json` schema.

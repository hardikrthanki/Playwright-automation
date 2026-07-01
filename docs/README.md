# AIR Developer Documentation

AIR is the Automation Intelligence Platform inside this repository. It converts automation execution results into release decisions, quality health, evidence, recommendations, and exportable dashboards.

This documentation set explains AIR as a product and as an engineering system. Start here, then follow the engine-specific documents as work moves into AIR Core.

## Current Status

- AIR v1.0 UI is frozen.
- AIR v1.1 Core is complete.
- AIR v1.2 focuses on Historical Intelligence and Build Comparison.
- The dashboard reads normalized `air-results.json`.
- Playwright is the first input source.
- AIR must remain framework-independent.
- Future work should improve intelligence and integrations, not redesign the UI.

## Documentation Map

| Document | Purpose |
| --- | --- |
| [PRODUCT_VISION.md](PRODUCT_VISION.md) | Product mission, audience, and principles |
| [ARCHITECTURE.md](ARCHITECTURE.md) | High-level AIR architecture |
| [SYSTEM_ARCHITECTURE.md](SYSTEM_ARCHITECTURE.md) | Runtime flow and boundaries |
| [DATA_MODEL.md](DATA_MODEL.md) | `air-results.json` contract |
| [UI_GUIDELINES.md](UI_GUIDELINES.md) | Frozen AIR v1.0 UI rules |
| [COMPONENT_GUIDELINES.md](COMPONENT_GUIDELINES.md) | Reusable UI/component expectations |
| [PARSER.md](PARSER.md) | Parser design and responsibilities |
| [AIR_CORE.md](AIR_CORE.md) | AIR Core ownership and roadmap |
| [QUALITY_ENGINE.md](QUALITY_ENGINE.md) | Quality score rules |
| [RELEASE_ENGINE.md](RELEASE_ENGINE.md) | GO / CONDITIONAL GO / NO GO logic |
| [JOURNEY_ENGINE.md](JOURNEY_ENGINE.md) | Business journey mapping |
| [MODULE_ENGINE.md](MODULE_ENGINE.md) | Module health model |
| [EVIDENCE_ENGINE.md](EVIDENCE_ENGINE.md) | Evidence correlation |
| [SEARCH_ENGINE.md](SEARCH_ENGINE.md) | Search indexing and behavior |
| [HISTORY_ENGINE.md](HISTORY_ENGINE.md) | Historical execution strategy |
| [AI_ENGINE.md](AI_ENGINE.md) | Recommendation and reasoning goals |
| [PLUGIN_ARCHITECTURE.md](PLUGIN_ARCHITECTURE.md) | Future adapter/plugin model |
| [ROADMAP.md](ROADMAP.md) | AIR product evolution |
| [VERSION_HISTORY.md](VERSION_HISTORY.md) | Release history |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Contribution workflow |
| [CODING_STANDARDS.md](CODING_STANDARDS.md) | Engineering standards |
| [CHANGELOG.md](CHANGELOG.md) | Change log |

## Main Commands

```powershell
npm run test:execution
npm run report:execution
npm run report:execution:pdf
npm run typecheck
```

## Controlled MFA User Flow

The MFA user-flow suite is intentionally disabled by default because some
scenarios can change a user's MFA state, trusted-device state, or backup-code
inventory.

### Required Base Variables

```powershell
$env:MFA_USER_FLOW_ENABLED="true"
$env:MFA_LOCAL_EMAIL="subscriber@example.com"
$env:MFA_LOCAL_PASSWORD="current-password"
```

### Authenticator OTP Automation

`MFA_LOCAL_TOTP_SECRET` is the authenticator manual setup key shown when MFA is
enabled. If it is not configured, OTP and remember-device tests are skipped with
the message `Skipped because MFA_LOCAL_TOTP_SECRET is not configured.`

```powershell
$env:MFA_LOCAL_TOTP_SECRET="BASE32SECRET"
npm run test:controlled:mfa -- --headed
```

Automated with `MFA_LOCAL_TOTP_SECRET`:

- Valid OTP login.
- Invalid OTP validation.
- Expired/future OTP validation.
- Retry behavior observation.
- Remember/trust device behavior.
- Regenerate/disable MFA when destructive mode is explicitly enabled.

### Backup-Code Login Automation

Backup codes are single-use. Use a fresh unused code for each run.
The expected backup-code format is `XXXX-XXXX-XX`. If the code appears as
`XXXX-XXXX-` in the UI, use the **Copy** or **Download** button from the
backup-code modal to capture the full value before running automation.

```powershell
$env:MFA_LOCAL_BACKUP_CODE="PY05-KW8T-A1"
npx playwright test tests/MfaUserFlow.spec.ts -g "Login using valid backup code" --headed
```

Automated with `MFA_LOCAL_BACKUP_CODE`:

- Login using a valid backup code.
- Invalid backup-code validation.

To validate that a used backup code cannot be reused, provide a separate fresh
code dedicated to that destructive test:

```powershell
$env:MFA_ALLOW_DESTRUCTIVE_USER_FLOW="true"
$env:MFA_REUSE_BACKUP_CODE="ZE5N-CIR-B2"
npx playwright test tests/MfaUserFlow.spec.ts -g "Reuse same backup code is rejected" --headed
```

Optional destructive checks, such as backup-code reuse, backup-code
regeneration, and disabling MFA, require:

```powershell
$env:MFA_ALLOW_DESTRUCTIVE_USER_FLOW="true"
```

### Manual Headed OTP Fallback

Use this when `MFA_LOCAL_TOTP_SECRET` is not available. The test pauses on the
MFA challenge screen so the tester can enter the authenticator OTP manually and
resume Playwright.

```powershell
$env:MFA_USER_FLOW_ENABLED="true"
$env:MFA_LOCAL_EMAIL="subscriber@example.com"
$env:MFA_LOCAL_PASSWORD="current-password"
$env:MFA_MANUAL_OTP_FLOW_ENABLED="true"
npx playwright test tests/MfaUserFlow.spec.ts -g "Manual headed MFA login fallback" --headed
```

If the tester selects **Trust this device** during the paused step, this optional
flag validates that the next login skips MFA in the same browser context:

```powershell
$env:MFA_MANUAL_EXPECT_TRUSTED_DEVICE="true"
```

Google OAuth MFA checks are tracked separately and require:

```powershell
$env:MFA_ALLOW_GOOGLE_USER_FLOW="true"
$env:MFA_GOOGLE_EMAIL="google-user@example.com"
```

## Key Outputs

- `test-results/results.json`: Playwright JSON reporter output.
- `execution-report/air-results.json`: normalized AIR model.
- `execution-report/index.html`: AIR dashboard.
- `execution-report/AIR_Report.pdf`: exportable PDF when generated.

## Manual Product Defects

AIR can include confirmed product defects that are discovered during manual
verification but should still affect module health, release decision, search,
and recommendations. Configure them in:

```text
config/air.manual-defects.json
```

Manual defects are converted into normalized failed AIR test records before
summary, module, journey, quality, release, recommendation, and search engines
run. Use this only for confirmed product defects, not temporary test-data issues.

## AIR v1.2 Historical Intelligence

The Historical Intelligence dashboard uses History Engine output to compare the current execution with prior executions.

It covers:

- Executive build comparison.
- Quality trends.
- Module trends.
- Business journey trends.
- Failure intelligence.
- Release intelligence.
- Engineering insights.
- Historical timeline.

If only one execution exists, AIR shows a professional first-execution empty state instead of inventing comparison data.

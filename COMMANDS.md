# OOLTool Playwright Command Reference

Use these commands from:

```powershell
C:\Users\BAPS\Documents\Oools_paywright
```

## Full Automation Suite

Recommended stable suite with AIR report:

```powershell
npm run execution:headed
```

Run all tests in headed browser mode:

```powershell
npx playwright test --headed
```

Run all tests in normal/headless mode:

```powershell
npx playwright test
```

Run all tests and then generate AIR execution report:

```powershell
npx playwright test --headed
npm run report:execution
```

Run the configured stable suite only:

```powershell
npm run test:stable -- --headed
```

## Generate AIR Report From Last Run

Use this after any test execution:

```powershell
npm run report:execution
```

If you only want to regenerate files and do not want the browser to open:

```powershell
npm run air:parse
node scripts/generate-execution-report.js
```

Open AIR execution report:

```powershell
start execution-report\index.html
```

AIR report file:

```text
execution-report\index.html
```

AIR normalized data file:

```text
execution-report\air-results.json
```

## Open Playwright HTML Report

```powershell
npx playwright show-report
```

This opens the Playwright report in the browser, usually at:

```text
http://localhost:9323
```

## Run Specific Test Files

Onboarding:

```powershell
npx playwright test tests/onboarding.spec.ts --headed
```

Subscriber billing:

```powershell
npx playwright test tests/Subscriber.spec.ts --headed
```

Profile:

```powershell
npx playwright test tests/Profile.spec.ts --headed
```

Profile password mismatch:

```powershell
npx playwright test tests/ProfilePasswordMismatch.spec.ts --headed
```

Profile wrong current password:

```powershell
npx playwright test tests/ProfileWrongCurrentPassword.spec.ts --headed
```

Forgot password:

```powershell
npx playwright test tests/forgotpassword.spec.ts --headed
```

Unlock locked account:

```powershell
npx playwright test tests/UnlockAccount.spec.ts --headed
```

Auth negative scenarios:

```powershell
npx playwright test tests/AuthNegative.spec.ts --headed
```

Signup negative scenarios:

```powershell
npx playwright test tests/SignupNegative.spec.ts --headed
```

Reset password negative scenarios:

```powershell
npx playwright test tests/ResetPasswordNegative.spec.ts --headed
```

Payment negative scenarios:

```powershell
npx playwright test tests/PaymentNegative.spec.ts --headed
```

Accessibility scenarios:

```powershell
npx playwright test tests/AccessibilityBrowser.spec.ts --headed
```

Session security scenarios:

```powershell
npx playwright test tests/SessionSecurity.spec.ts --headed
```

## Run Controlled Negative Suite

```powershell
npm run test:controlled
npm run report:execution
```

Controlled email flows:

```powershell
npm run test:controlled:email -- --headed
```

Controlled reset-password flows:

```powershell
npm run test:controlled:reset -- --headed
```

Controlled payment flows:

```powershell
npm run test:controlled:payment -- --headed
```

## Run MFA Tests

MFA tests are paused for known product issues unless explicitly enabled.

Set required MFA variables:

```powershell
$env:MFA_USER_FLOW_ENABLED="true"
$env:MFA_LOCAL_EMAIL="imhardikthanki+mfatest@gmail.com"
$env:MFA_LOCAL_PASSWORD="H@rdik9944"
$env:MFA_LOCAL_BACKUP_CODE="PASTE-NEW-CODE-HERE"
```

Run backup-code login test:

```powershell
npx playwright test tests/MfaUserFlow.spec.ts -g "Login using valid backup code" --headed
```

Run MFA user flow file:

```powershell
npx playwright test tests/MfaUserFlow.spec.ts --headed
```

Run configured MFA suite:

```powershell
npm run test:controlled:mfa -- --headed
```

TOTP-based tests need:

```powershell
$env:MFA_LOCAL_TOTP_SECRET="PASTE_SECRET_HERE"
```

If `MFA_LOCAL_TOTP_SECRET` is not configured, TOTP and remember-device tests should skip.

## Manual MFA Fallback

Use this when tester needs to enter OTP manually in browser:

```powershell
$env:MFA_USER_FLOW_ENABLED="true"
$env:MFA_LOCAL_EMAIL="imhardikthanki+mfatest@gmail.com"
$env:MFA_LOCAL_PASSWORD="H@rdik9944"
npx playwright test tests/MfaUserFlow.spec.ts -g "Manual" --headed
```

## Typecheck

```powershell
npm run typecheck
```

## Export PDF Report

Generate AIR HTML report and PDF:

```powershell
npm run report:execution:pdf
```

Generate PDF from the current AIR report:

```powershell
npm run report:pdf
```

## Common Full Validation Flow

Recommended before sharing a report:

```powershell
npm run test:stable -- --headed
npm run report:execution
npm run typecheck
start execution-report\index.html
```

## Useful Report Files

AIR execution report:

```text
execution-report\index.html
```

AIR normalized model:

```text
execution-report\air-results.json
```

Playwright HTML report:

```text
playwright-report\index.html
```

Test results and artifacts:

```text
test-results\
```

## Notes

- Use `--headed` when you want to watch the browser.
- Use headless mode when running faster local checks.
- Run `npm run report:execution` after tests to refresh AIR.
- Backup codes are single-use. Always paste a fresh backup code before running backup-code MFA tests.
- If an account is locked, run the unlock account flow before normal login tests.

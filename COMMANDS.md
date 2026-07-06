# OOLTool Playwright Command Reference

Use these commands from:

```powershell
C:\Users\BAPS\Documents\Oools_paywright
```

## Full Automation Suite

Smoke suite:

```powershell
npm run test:smoke -- --headed
```

Smoke suite with AIR report:

```powershell
npm run smoke:report
```

Sanity suite:

```powershell
npm run test:sanity -- --headed
```

Sanity suite with AIR report:

```powershell
npm run sanity:report
```

Regression suite:

```powershell
npm run test:regression -- --headed
```

Regression suite with AIR report:

```powershell
npm run regression:report
```

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

## Complete User Journey

Stable user journey:

```powershell
npm run test:user-journey:stable -- --headed
```

Stable user journey with AIR report:

```powershell
npm run user-journey:report
```

Controlled user journey for forgot-password and MFA:

```powershell
npm run test:user-journey:controlled -- --headed
```

Full user journey, including controlled/manual-gated tests:

```powershell
npm run test:user-journey:full -- --headed
```

Current user journey map:

```text
Register -> Email Verification -> Login -> Risk Profile -> Compliance ->
Plan Selection -> Stripe Payment -> Dashboard -> Profile -> Billing ->
Logout -> Forgot Password -> MFA / Trusted Device
```

## Generate AIR Report From Last Run

Use this after any test execution:

```powershell
npm run report:execution
```

For a smaller controlled run, such as Overlay Strategists or Stripe-only tests,
force AIR to use the latest Playwright result instead of restoring the larger
historical regression snapshot:

```powershell
$env:AIR_ALLOW_STALE_REPORT="true"
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

Billing edge validation:

```powershell
npx playwright test tests/BillingEdgeValidation.spec.ts --headed
```

Run through npm script:

```powershell
npm run test:controlled:billing-edge -- --headed
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

Profile mobile number validation:

```powershell
$env:PROFILE_MOBILE_VALIDATION_ENABLED="true"
npx playwright test tests/ProfileMobileValidation.spec.ts --headed
```

Profile mobile number validation with a prepared user:

```powershell
$env:PROFILE_MOBILE_VALIDATION_ENABLED="true"
$env:PROFILE_MOBILE_EMAIL="imhardikthanki+profile-mobile@gmail.com"
$env:PROFILE_MOBILE_PASSWORD="Test@123456"
npx playwright test tests/ProfileMobileValidation.spec.ts --headed
```

Profile mobile OTP request or update flow:

```powershell
$env:PROFILE_MOBILE_VALIDATION_ENABLED="true"
$env:PROFILE_MOBILE_CHANGE_ENABLED="true"
npx playwright test tests/ProfileMobileValidation.spec.ts -g "request OTP" --headed
```

Complete the mobile number change only when you intentionally want to update the
account mobile number:

```powershell
$env:PROFILE_MOBILE_VALIDATION_ENABLED="true"
$env:PROFILE_MOBILE_CHANGE_ENABLED="true"
$env:PROFILE_MOBILE_COMPLETE_ENABLED="true"
npx playwright test tests/ProfileMobileValidation.spec.ts -g "request OTP" --headed
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

Onboarding Risk Profile and Compliance fast field validation:

```powershell
$env:ONBOARDING_FIELD_VALIDATION_ENABLED="true"
npx playwright test tests/OnboardingFieldValidation.spec.ts --headed
```

Use a prepared onboarding user when fresh registration SMS OTP is rate-limited.
The user should already be verified and still be on the onboarding flow:

```powershell
$env:ONBOARDING_FIELD_VALIDATION_ENABLED="true"
$env:ONBOARDING_FIELD_VALIDATION_EXISTING_EMAIL="imhardikthanki+prepared-onboarding@gmail.com"
$env:ONBOARDING_FIELD_VALIDATION_EXISTING_PASSWORD="Test@123456"
$env:ONBOARDING_FIELD_VALIDATION_EXISTING_MOBILE="2015550123"
npx playwright test tests/OnboardingFieldValidation.spec.ts --headed
```

Onboarding Risk Profile and Compliance full field-level regression:

```powershell
$env:ONBOARDING_FIELD_VALIDATION_ENABLED="true"
$env:ONBOARDING_FIELD_VALIDATION_FULL_ENABLED="true"
npx playwright test tests/OnboardingFieldValidation.spec.ts --headed
```

Plan selection validation without Stripe:

```powershell
$env:PLAN_SELECTION_VALIDATION_ENABLED="true"
npx playwright test tests/PlanSelectionValidation.spec.ts --headed
```

Plan selection validation with a prepared user already on the plan-selection step:

```powershell
$env:PLAN_SELECTION_VALIDATION_ENABLED="true"
$env:PLAN_SELECTION_EXISTING_EMAIL="imhardikthanki+prepared-plan-selection@gmail.com"
$env:PLAN_SELECTION_EXISTING_PASSWORD="Test@123456"
$env:PLAN_SELECTION_EXISTING_MOBILE="2015550123"
npx playwright test tests/PlanSelectionValidation.spec.ts --headed
```

Reset password negative scenarios:

```powershell
npx playwright test tests/ResetPasswordNegative.spec.ts --headed
```

Payment negative scenarios:

```powershell
npx playwright test tests/PaymentNegative.spec.ts --headed
```

Overlay Strategists trial discovery:

```powershell
$env:OVERLAY_STRATEGISTS_FLOW_ENABLED="true"
npx playwright test tests/OverlayStrategistsTrial.spec.ts --headed
```

Overlay Strategists with-card trial checkout:

```powershell
$env:OVERLAY_STRATEGISTS_FLOW_ENABLED="true"
$env:OVERLAY_STRATEGISTS_WITH_CARD_ENABLED="true"
npx playwright test tests/OverlayStrategistsTrial.spec.ts -g "with card" --headed
```

Overlay Strategists without-card trial:

```powershell
$env:OVERLAY_STRATEGISTS_FLOW_ENABLED="true"
$env:OVERLAY_STRATEGISTS_WITHOUT_CARD_ENABLED="true"
npx playwright test tests/OverlayStrategistsTrial.spec.ts -g "without card" --headed
```

Overlay Strategists terms-required validation:

```powershell
$env:OVERLAY_STRATEGISTS_FLOW_ENABLED="true"
$env:OVERLAY_STRATEGISTS_TERMS_ENABLED="true"
npx playwright test tests/OverlayStrategistsTrial.spec.ts -g "terms acceptance" --headed
```

Overlay Strategists Stripe missing-card negative validation:

```powershell
$env:OVERLAY_STRATEGISTS_FLOW_ENABLED="true"
$env:OVERLAY_STRATEGISTS_STRIPE_NEGATIVE_ENABLED="true"
npx playwright test tests/OverlayStrategistsTrial.spec.ts -g "missing Stripe card" --headed
```

Run through npm script:

```powershell
$env:OVERLAY_STRATEGISTS_FLOW_ENABLED="true"
$env:OVERLAY_STRATEGISTS_WITH_CARD_ENABLED="true"
$env:OVERLAY_STRATEGISTS_WITHOUT_CARD_ENABLED="true"
$env:OVERLAY_STRATEGISTS_TERMS_ENABLED="true"
$env:OVERLAY_STRATEGISTS_STRIPE_NEGATIVE_ENABLED="true"
npm run test:controlled:stripe-overlay -- --headed
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

Controlled onboarding fast field validation:

```powershell
$env:ONBOARDING_FIELD_VALIDATION_ENABLED="true"
npm run test:controlled:onboarding-fields -- --headed
```

Controlled onboarding fast field validation with a prepared onboarding user:

```powershell
$env:ONBOARDING_FIELD_VALIDATION_ENABLED="true"
$env:ONBOARDING_FIELD_VALIDATION_EXISTING_EMAIL="imhardikthanki+prepared-onboarding@gmail.com"
$env:ONBOARDING_FIELD_VALIDATION_EXISTING_PASSWORD="Test@123456"
$env:ONBOARDING_FIELD_VALIDATION_EXISTING_MOBILE="2015550123"
npm run test:controlled:onboarding-fields -- --headed
```

Controlled onboarding full field-level regression:

```powershell
$env:ONBOARDING_FIELD_VALIDATION_ENABLED="true"
$env:ONBOARDING_FIELD_VALIDATION_FULL_ENABLED="true"
npm run test:controlled:onboarding-fields -- --headed
```

Controlled plan-selection validation without Stripe:

```powershell
$env:PLAN_SELECTION_VALIDATION_ENABLED="true"
npm run test:controlled:plan-selection -- --headed
```

Controlled plan-selection validation with a prepared user:

```powershell
$env:PLAN_SELECTION_VALIDATION_ENABLED="true"
$env:PLAN_SELECTION_EXISTING_EMAIL="imhardikthanki+prepared-plan-selection@gmail.com"
$env:PLAN_SELECTION_EXISTING_PASSWORD="Test@123456"
$env:PLAN_SELECTION_EXISTING_MOBILE="2015550123"
npm run test:controlled:plan-selection -- --headed
```

Controlled profile mobile validation:

```powershell
$env:PROFILE_MOBILE_VALIDATION_ENABLED="true"
npm run test:controlled:profile-mobile -- --headed
```

Controlled Overlay Strategists trial flow:

```powershell
$env:OVERLAY_STRATEGISTS_FLOW_ENABLED="true"
npm run test:controlled:stripe-overlay -- --headed
```

Controlled Overlay Strategists with-card checkout:

```powershell
$env:OVERLAY_STRATEGISTS_FLOW_ENABLED="true"
$env:OVERLAY_STRATEGISTS_WITH_CARD_ENABLED="true"
npm run test:controlled:stripe-overlay -- --headed -g "with card"
```

Controlled Overlay Strategists without-card trial:

```powershell
$env:OVERLAY_STRATEGISTS_FLOW_ENABLED="true"
$env:OVERLAY_STRATEGISTS_WITHOUT_CARD_ENABLED="true"
npm run test:controlled:stripe-overlay -- --headed -g "without card"
```

Controlled Overlay Strategists terms-required validation:

```powershell
$env:OVERLAY_STRATEGISTS_FLOW_ENABLED="true"
$env:OVERLAY_STRATEGISTS_TERMS_ENABLED="true"
npm run test:controlled:stripe-overlay -- --headed -g "terms acceptance"
```

Controlled Overlay Strategists Stripe missing-card negative validation:

```powershell
$env:OVERLAY_STRATEGISTS_FLOW_ENABLED="true"
$env:OVERLAY_STRATEGISTS_STRIPE_NEGATIVE_ENABLED="true"
npm run test:controlled:stripe-overlay -- --headed -g "missing Stripe card"
```

Overlay test users are generated with scenario-specific aliases, for example:

```text
imhardikthanki+overlay-without-card-<timestamp>@gmail.com
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

Run profile enable authenticator app flow:

```powershell
$env:MFA_USER_FLOW_ENABLED="true"
$env:MFA_LOCAL_EMAIL="imhardikthanki+mfatest@gmail.com"
$env:MFA_LOCAL_PASSWORD="H@rdik9944"
npx playwright test tests/MfaUserFlow.spec.ts -g "Local user enables MFA successfully" --headed
```

Run complete MFA lifecycle with one local user:

```powershell
$env:MFA_USER_FLOW_ENABLED="true"
$env:MFA_ALLOW_DESTRUCTIVE_USER_FLOW="true"
$env:MFA_MANUAL_OTP_FLOW_ENABLED="true"
$env:MFA_LOCAL_EMAIL="imhardikthanki+mfatest@gmail.com"
$env:MFA_LOCAL_PASSWORD="H@rdik9944"
npx playwright test tests/MfaUserFlow.spec.ts -g "Complete MFA lifecycle enable backup trusted revoke disable" --headed
```

Start this lifecycle with a user that has 2FA disabled. The test enables 2FA,
validates generated backup codes, logs in with a backup code, trusts the device,
revokes the trusted device, verifies MFA is required again, and disables 2FA at
the end.

Run regenerate backup codes and validate generated code format:

```powershell
$env:MFA_USER_FLOW_ENABLED="true"
$env:MFA_ALLOW_DESTRUCTIVE_USER_FLOW="true"
$env:MFA_LOCAL_EMAIL="imhardikthanki+mfatest@gmail.com"
$env:MFA_LOCAL_PASSWORD="H@rdik9944"
$env:MFA_LOCAL_TOTP_SECRET="PASTE_SECRET_HERE"
npx playwright test tests/MfaUserFlow.spec.ts -g "Regenerate backup codes for local user" --headed
```

Run disable 2FA from profile/security:

```powershell
$env:MFA_USER_FLOW_ENABLED="true"
$env:MFA_ALLOW_DESTRUCTIVE_USER_FLOW="true"
$env:MFA_LOCAL_EMAIL="imhardikthanki+mfatest@gmail.com"
$env:MFA_LOCAL_PASSWORD="H@rdik9944"
$env:MFA_LOCAL_TOTP_SECRET="PASTE_SECRET_HERE"
npx playwright test tests/MfaUserFlow.spec.ts -g "Disable MFA for local user" --headed
```

Run trusted-device validation:

```powershell
$env:MFA_USER_FLOW_ENABLED="true"
$env:MFA_LOCAL_EMAIL="imhardikthanki+mfatest@gmail.com"
$env:MFA_LOCAL_PASSWORD="H@rdik9944"
$env:MFA_LOCAL_TOTP_SECRET="PASTE_SECRET_HERE"
npx playwright test tests/MfaUserFlow.spec.ts -g "Remember this device skips OTP" --headed
```

Run trusted-device revoke/delete validation:

```powershell
$env:MFA_USER_FLOW_ENABLED="true"
$env:MFA_ALLOW_DESTRUCTIVE_USER_FLOW="true"
$env:MFA_LOCAL_EMAIL="imhardikthanki+mfatest@gmail.com"
$env:MFA_LOCAL_PASSWORD="H@rdik9944"
$env:MFA_LOCAL_TOTP_SECRET="PASTE_SECRET_HERE"
npx playwright test tests/MfaUserFlow.spec.ts -g "Revoking trusted device requires MFA again" --headed
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

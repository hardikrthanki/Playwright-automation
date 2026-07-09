# OOLTool Playwright Automation

## Daily Execution

Run a quick smoke check:

```powershell
npm run test:smoke -- --headed
```

Run a stable sanity suite:

```powershell
npm run test:sanity -- --headed
```

Run full regression:

```powershell
npm run test:regression -- --headed
```

Run the stable execution suite and generate the execution report:

```powershell
$env:RECORD_ALL_ARTIFACTS="true"
npm run execution
```

Stable execution includes the tests that should run without a fresh email link,
locked account, or one-time Stripe checkout URL:

```text
onboarding.spec.ts
AuthNegative.spec.ts
AuthUiValidation.spec.ts
SignupNegative.spec.ts
PasswordPolicy.spec.ts
SessionSecurity.spec.ts
AccessibilityBrowser.spec.ts
Profile.spec.ts
ProfileNegative.spec.ts
ProfilePasswordMismatch.spec.ts
ProfileWrongCurrentPassword.spec.ts
DashboardHealth.spec.ts
DashboardNavigation.spec.ts
BillingDeep.spec.ts
BillingEdgeValidation.spec.ts
Subscriber.spec.ts
```

## User Journey Execution

Run the stable user journey:

```powershell
npm run test:user-journey:stable -- --headed
```

Run the stable user journey and generate AIR:

```powershell
npm run user-journey:report
```

Run controlled user journey flows for forgot password and MFA:

```powershell
npm run test:user-journey:controlled -- --headed
```

Run onboarding Risk Profile and Compliance fast field validation:

```powershell
$env:ONBOARDING_FIELD_VALIDATION_ENABLED="true"
npm run test:controlled:onboarding-fields -- --headed
```

If PUAT registration SMS OTP is throttled, run the same validation with a
prepared verified user that is still in onboarding:

```powershell
$env:ONBOARDING_FIELD_VALIDATION_ENABLED="true"
$env:ONBOARDING_FIELD_VALIDATION_EXISTING_EMAIL="imhardikthanki+prepared-onboarding@gmail.com"
$env:ONBOARDING_FIELD_VALIDATION_EXISTING_PASSWORD="Test@123456"
$env:ONBOARDING_FIELD_VALIDATION_EXISTING_MOBILE="2015550123"
npm run test:controlled:onboarding-fields -- --headed
```

Run onboarding Risk Profile and Compliance full field-level regression:

```powershell
$env:ONBOARDING_FIELD_VALIDATION_ENABLED="true"
$env:ONBOARDING_FIELD_VALIDATION_FULL_ENABLED="true"
npm run test:controlled:onboarding-fields -- --headed
```

Run plan selection validation without Stripe checkout:

```powershell
$env:PLAN_SELECTION_VALIDATION_ENABLED="true"
npm run test:controlled:plan-selection -- --headed
```

Run billing edge validation without Stripe checkout or plan changes:

```powershell
npm run test:controlled:billing-edge -- --headed
```

Run dashboard navigation validation:

```powershell
npm run test:controlled:dashboard-navigation -- --headed
```

Run dashboard health/load-error validation:

```powershell
npm run test:controlled:dashboard-health -- --headed
```

Run auth UI validation:

```powershell
npm run test:controlled:auth-ui -- --headed
```

Run profile mobile number validation:

```powershell
$env:PROFILE_MOBILE_VALIDATION_ENABLED="true"
npm run test:controlled:profile-mobile -- --headed
```

The profile mobile file validates the mobile section and invalid-number guardrail
by default. Set `PROFILE_MOBILE_CHANGE_ENABLED=true` only when you intentionally
want to request a mobile OTP. Set `PROFILE_MOBILE_COMPLETE_ENABLED=true` only
when you intentionally want to update the account mobile number.

Run the full user journey bundle:

```powershell
npm run test:user-journey:full -- --headed
```

Journey map:

```text
Register -> Email Verification -> Login -> Risk Profile -> Compliance ->
Plan Selection -> Stripe Payment -> Dashboard -> Profile -> Billing ->
Logout -> Forgot Password -> MFA / Trusted Device
```

Detailed coverage is documented in:

```text
docs/USER_JOURNEY_COVERAGE.md
```

Smoke, sanity, regression, and controlled-suite strategy is documented in:

```text
docs/TEST_SUITE_STRATEGY.md
```

Open the execution report:

```text
C:\Users\BAPS\Documents\Oools_paywright\execution-report\index.html
```

For controlled runs with fewer tests than the stable regression suite, set
`AIR_ALLOW_STALE_REPORT=true` before generating AIR. This keeps the latest
controlled result visible instead of restoring the larger historical snapshot.

```powershell
$env:AIR_ALLOW_STALE_REPORT="true"
npm run report:execution
```

Open the detailed Playwright report with screenshots, videos, and traces:

```powershell
npx playwright show-report
```

## Controlled Tests

Controlled tests need fresh external URLs, so they are not part of the normal execution suite.

Run reset-password negative tests:

```powershell
$env:RESET_URL="https://puat.ooltool.com/reset-password/..."
npm run controlled
```

Run payment negative tests:

```powershell
$env:STRIPE_CHECKOUT_URL="https://checkout.stripe.com/c/pay/..."
npm run controlled
```

Run both controlled areas:

```powershell
$env:RESET_URL="https://puat.ooltool.com/reset-password/..."
$env:STRIPE_CHECKOUT_URL="https://checkout.stripe.com/c/pay/..."
npm run controlled
```

Run only reset-password controlled tests:

```powershell
$env:RESET_URL="https://puat.ooltool.com/reset-password/..."
npm run test:controlled:reset
```

Run only payment controlled tests:

```powershell
$env:STRIPE_CHECKOUT_URL="https://checkout.stripe.com/c/pay/..."
npm run test:controlled:payment
```

Run Overlay Strategists trial discovery:

```powershell
$env:OVERLAY_STRATEGISTS_FLOW_ENABLED="true"
npm run test:controlled:stripe-overlay -- --headed
```

Run Overlay Strategists with-card trial checkout:

```powershell
$env:OVERLAY_STRATEGISTS_FLOW_ENABLED="true"
$env:OVERLAY_STRATEGISTS_WITH_CARD_ENABLED="true"
npm run test:controlled:stripe-overlay -- --headed -g "with card"
```

Run Overlay Strategists without-card trial:

```powershell
$env:OVERLAY_STRATEGISTS_FLOW_ENABLED="true"
$env:OVERLAY_STRATEGISTS_WITHOUT_CARD_ENABLED="true"
npm run test:controlled:stripe-overlay -- --headed -g "without card"
```

Run Overlay Strategists terms-required validation:

```powershell
$env:OVERLAY_STRATEGISTS_FLOW_ENABLED="true"
$env:OVERLAY_STRATEGISTS_TERMS_ENABLED="true"
npm run test:controlled:stripe-overlay -- --headed -g "terms acceptance"
```

Run Overlay Strategists Stripe missing-card negative validation:

```powershell
$env:OVERLAY_STRATEGISTS_FLOW_ENABLED="true"
$env:OVERLAY_STRATEGISTS_STRIPE_NEGATIVE_ENABLED="true"
npm run test:controlled:stripe-overlay -- --headed -g "missing Stripe card"
```

The Overlay Strategists file starts Subscription Management Use Case 1. It is
gated because PUAT still needs manual email verification and trial eligibility
can be consumed by a created user.

Generated Overlay test users use scenario-specific Gmail aliases such as
`imhardikthanki+overlay-without-card-<timestamp>@gmail.com` so trial accounts
are easier to identify.

Run manual email-link flows:

```powershell
$env:FORGOT_PASSWORD_FLOW_ENABLED="true"
npm run test:controlled:email -- --headed
```

`forgotpassword.spec.ts` pauses while you open the reset email link in the same
Playwright browser. It is skipped unless `FORGOT_PASSWORD_FLOW_ENABLED=true`
so broad executions do not get stuck when the reset email is delayed.
`UnlockAccount.spec.ts` is opt-in and runs only when the account is already
locked and `RUN_UNLOCK_ACCOUNT_TEST=true`.

```powershell
$env:RUN_UNLOCK_ACCOUNT_TEST="true"
npm run test:controlled:email -- --headed
```

If an execution is already paused waiting for a reset email, press `Ctrl + C`
and rerun without `FORGOT_PASSWORD_FLOW_ENABLED`, or exclude reset flows:

```powershell
npx playwright test --headed --grep-invert "Forgot Password|Reset Password"
```

If these URLs are not set, controlled tests are skipped by design.

## Useful Commands

```powershell
npm run typecheck
npm run test:stable
npm run test:execution
npm run report:execution
npm run test:controlled
npm run test:controlled:email
npm run test:controlled:reset
npm run test:controlled:payment
npm run report
```

## Report Files

```text
execution-report/index.html
playwright-report/index.html
test-results/
```

`execution-report/index.html` is the summary execution report. `playwright-report/index.html` is the detailed evidence report.

## AIR Documentation

```text
docs/README.md
docs/PRODUCT_VISION.md
docs/ARCHITECTURE.md
docs/DATA_MODEL.md
docs/AIR_CORE.md
docs/ROADMAP.md
docs/air/air-product-specification.md
docs/air/air-design-system-wireframes.md
docs/air/air-decision-log.md
docs/air/air-report-vision-functional-summary.md
config/air.config.json
```

Start with `docs/README.md` for the AIR developer documentation set. The root `docs/*.md` files define AIR as an engineering product: product vision, architecture, data model, parser, AIR Core engines, roadmap, coding standards, and contribution workflow. The `docs/air/` files preserve the earlier product specification, design-system notes, decision log, and report vision.

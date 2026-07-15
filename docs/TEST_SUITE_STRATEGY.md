# Test Suite Strategy

The automation suite is separated into Smoke, Sanity, Regression, and
Controlled suites so execution time and risk are easier to manage.

## Smoke Suite

Purpose:

- Quick product health check
- Confirms login, dashboard, profile, billing, and session security are alive
- Should be used before deeper validation

Command:

```powershell
npm run test:smoke -- --headed
```

With AIR:

```powershell
npm run smoke:report
```

Included:

```text
Subscriber.spec.ts
DashboardHealth.spec.ts
DashboardNavigation.spec.ts
Profile.spec.ts
SessionSecurity.spec.ts
```

## Sanity Suite

Purpose:

- Stable feature validation after a build or deployment
- Covers onboarding happy path, authentication validation, signup validation,
  password policy, session security, profile, billing, and subscriber workflows
- Larger than smoke but avoids most manually gated/destructive flows

Command:

```powershell
npm run test:sanity -- --headed
```

With AIR:

```powershell
npm run sanity:report
```

Included:

```text
onboarding.spec.ts
AuthNegative.spec.ts
AuthUiValidation.spec.ts
SignupNegative.spec.ts
PasswordPolicy.spec.ts
SessionSecurity.spec.ts
DashboardHealth.spec.ts
DashboardNavigation.spec.ts
Profile.spec.ts
ProfileNegative.spec.ts
ProfileSecurityDisplay.spec.ts
ProfileMobileValidation.spec.ts
ProfilePasswordMismatch.spec.ts
ProfileWrongCurrentPassword.spec.ts
BillingDeep.spec.ts
BillingEdgeValidation.spec.ts
RiskComplianceUpdate.spec.ts
Subscriber.spec.ts
```

## Regression Suite

Purpose:

- Broad executable automation coverage
- Avoids manually gated, destructive, one-time, and environment-dependent flows
- Best for clean AIR/client reporting before a release review

Command:

```powershell
npm run test:regression -- --headed
```

With AIR:

```powershell
npm run regression:report
```

Included:

```text
onboarding.spec.ts
AuthNegative.spec.ts
AuthUiValidation.spec.ts
SignupNegative.spec.ts
PasswordPolicy.spec.ts
SessionSecurity.spec.ts
AccessibilityBrowser.spec.ts
DashboardHealth.spec.ts
DashboardNavigation.spec.ts
Profile.spec.ts
ProfileNegative.spec.ts
ProfileSecurityDisplay.spec.ts
ProfileMobileValidation.spec.ts
RiskComplianceUpdate.spec.ts
OnboardingFieldValidation.spec.ts
ProfilePasswordMismatch.spec.ts
ProfileWrongCurrentPassword.spec.ts
BillingDeep.spec.ts
BillingEdgeValidation.spec.ts
BillingSubscriptionManagement.spec.ts
Subscriber.spec.ts
```

Notes:

- `ProfileSecurityDisplay.spec.ts` runs read-only MFA/security display
  validation by default and does not mutate MFA state.
- `ProfileMobileValidation.spec.ts` runs read-only mobile validation by
  default. Mobile change/OTP validation remains opt-in.
- `RiskComplianceUpdate.spec.ts` runs saved Risk Profile and Compliance
  validation by default. Update/save flows remain opt-in.
- `OnboardingFieldValidation.spec.ts` runs fast Risk Profile and Compliance
  validation by default. Full fresh-user field regression remains opt-in.
- `BillingSubscriptionManagement.spec.ts` runs read-only Stripe portal and
  billing-management checks by default. Mutating portal checks remain opt-in.

## Extended Regression Inventory

Purpose:

- Includes stable regression plus controlled/manual/stateful flows
- Useful for checking total automation inventory
- May show skipped tests unless required environment variables and one-time data are configured

Command:

```powershell
npm run test:regression:all -- --headed
```

With AIR:

```powershell
npm run regression:all:report
```

Additional gated specs:

```text
ResetPasswordNegative.spec.ts
PaymentNegative.spec.ts
PlanSelectionValidation.spec.ts
OverlayStrategistsTrial.spec.ts
forgotpassword.spec.ts
UnlockAccount.spec.ts
MfaUserFlow.spec.ts
```

Notes:

- Extended regression tests are gated. Controlled-only specs do not register
  tests unless their required environment variables and one-time data are
  available.
- Forgot-password changes account state and requires email-link handling.
- MFA backup codes are single-use and require fresh data.
- Overlay Strategists and onboarding field validation create fresh users.

## Controlled Suites

Use controlled suites when a flow needs a fresh link, fresh user, MFA secret,
backup code, or manual interaction.

Before enabling controlled suites, use the readiness checklist:

```text
docs/CONTROLLED_TEST_READINESS.md
```

Onboarding field validation:

```powershell
$env:ONBOARDING_FIELD_VALIDATION_ENABLED="true"
npm run test:controlled:onboarding-fields -- --headed
```

Full onboarding field-level regression:

```powershell
$env:ONBOARDING_FIELD_VALIDATION_ENABLED="true"
$env:ONBOARDING_FIELD_VALIDATION_FULL_ENABLED="true"
npm run test:controlled:onboarding-fields -- --headed
```

Risk Profile and Compliance update-before-save validation:

```powershell
$env:ONBOARDING_FIELD_VALIDATION_ENABLED="true"
$env:ONBOARDING_FIELD_VALIDATION_FULL_ENABLED="true"
npm run test:controlled:onboarding-fields -- --headed -g "Risk Profile and Compliance selections can be updated before save"
```

Signup live validation with static OTP:

```powershell
$env:SIGNUP_DUPLICATE_EMAIL_VALIDATION_ENABLED="true"
$env:SIGNUP_OTP_LENGTH_VALIDATION_ENABLED="true"
$env:SIGNUP_OTP_RESEND_VALIDATION_ENABLED="true"
$env:AUTH_OTP_CODE="111111"
npm run test:controlled:signup -- --headed
```

The OTP length case is expected to fail until the application limits signup OTP
entry to six digits.

Authenticated dashboard Risk & Compliance validation:

```powershell
$env:RISK_COMPLIANCE_VALIDATION_ENABLED="true"
npm run test:controlled:risk-compliance -- --headed
```

Authenticated dashboard Risk & Compliance update validation:

```powershell
$env:RISK_COMPLIANCE_VALIDATION_ENABLED="true"
$env:RISK_COMPLIANCE_UPDATE_ENABLED="true"
npm run test:controlled:risk-compliance -- --headed
```

Plan selection read-only validation with prepared onboarding user:

```powershell
$env:PLAN_SELECTION_EXISTING_EMAIL="prepared-plan-user@example.com"
$env:PLAN_SELECTION_EXISTING_PASSWORD="current-password"
$env:PLAN_SELECTION_EXISTING_MOBILE="2015550123"
npm run test:controlled:plan-selection -- --headed
```

Plan selection fresh-user validation:

```powershell
$env:PLAN_SELECTION_VALIDATION_ENABLED="true"
npm run test:controlled:plan-selection -- --headed
```

Forgot password and unlock:

```powershell
$env:FORGOT_PASSWORD_FLOW_ENABLED="true"
npm run test:controlled:email -- --headed
```

The forgot-password reset-link flow is skipped unless
`FORGOT_PASSWORD_FLOW_ENABLED=true` because it requires a manual email link.
Leave the flag unset for unattended execution. If a run is already waiting for
the email link, stop it with `Ctrl + C` and rerun without the flag or use:

```powershell
npx playwright test --headed --grep-invert "Forgot Password|Reset Password"
```

MFA:

```powershell
$env:MFA_USER_FLOW_ENABLED="true"
npm run test:controlled:mfa -- --headed
```

Overlay Strategists:

```powershell
$env:OVERLAY_STRATEGISTS_FLOW_ENABLED="true"
npm run test:controlled:stripe-overlay -- --headed
```

Billing edge validation:

```powershell
npm run test:controlled:billing-edge -- --headed
```

Billing subscription management portal validation:

```powershell
$env:BILLING_SUBSCRIPTION_MANAGEMENT_ENABLED="true"
npm run test:controlled:billing-management -- --headed
```

Dashboard navigation validation:

```powershell
npm run test:controlled:dashboard-navigation -- --headed
```

Dashboard health validation:

```powershell
npm run test:controlled:dashboard-health -- --headed
```

Auth UI validation:

```powershell
npm run test:controlled:auth-ui -- --headed
```

Profile security display:

```powershell
npm run test:controlled:profile-security -- --headed
```

Profile mobile:

```powershell
npm run test:controlled:profile-mobile -- --headed
```

Payment negative:

```powershell
$env:STRIPE_CHECKOUT_URL="https://checkout.stripe.com/c/pay/..."
npm run test:controlled:payment -- --headed
```

## Recommended Daily Flow

1. Run Smoke.
2. If Smoke passes, run Sanity.
3. Generate AIR.
4. Run controlled suites only when their prerequisites are available.

```powershell
npm run test:smoke -- --headed
npm run test:sanity -- --headed
$env:AIR_ALLOW_STALE_REPORT="true"
npm run report:execution
```

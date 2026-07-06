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
SignupNegative.spec.ts
PasswordPolicy.spec.ts
SessionSecurity.spec.ts
Profile.spec.ts
ProfileNegative.spec.ts
ProfilePasswordMismatch.spec.ts
ProfileWrongCurrentPassword.spec.ts
BillingDeep.spec.ts
BillingEdgeValidation.spec.ts
Subscriber.spec.ts
```

## Regression Suite

Purpose:

- Broadest local automation coverage
- Includes stable, controlled, and gated flows
- Best for full validation before a major release

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
SignupNegative.spec.ts
PasswordPolicy.spec.ts
SessionSecurity.spec.ts
AccessibilityBrowser.spec.ts
Profile.spec.ts
ProfileNegative.spec.ts
ProfileMobileValidation.spec.ts
ProfilePasswordMismatch.spec.ts
ProfileWrongCurrentPassword.spec.ts
BillingDeep.spec.ts
BillingEdgeValidation.spec.ts
Subscriber.spec.ts
ResetPasswordNegative.spec.ts
PaymentNegative.spec.ts
OnboardingFieldValidation.spec.ts
PlanSelectionValidation.spec.ts
OverlayStrategistsTrial.spec.ts
forgotpassword.spec.ts
UnlockAccount.spec.ts
MfaUserFlow.spec.ts
```

Notes:

- Some regression tests are gated and will skip unless their environment
  variables are enabled.
- Forgot-password changes account state and requires email-link handling.
- MFA backup codes are single-use and require fresh data.
- Overlay Strategists and onboarding field validation create fresh users.

## Controlled Suites

Use controlled suites when a flow needs a fresh link, fresh user, MFA secret,
backup code, or manual interaction.

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

Forgot password and unlock:

```powershell
npm run test:controlled:email -- --headed
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

Profile mobile:

```powershell
$env:PROFILE_MOBILE_VALIDATION_ENABLED="true"
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

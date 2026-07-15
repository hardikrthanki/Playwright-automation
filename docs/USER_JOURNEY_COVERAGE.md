# User Journey Automation Coverage

This document maps the complete OOLTool user journey to Playwright automation.

## Journey Goal

Validate the user path from account creation through subscription, account
management, billing, security, password recovery, and logout.

## Current User Journey Map

| Step | User Journey Area | Current Automation | Test File | Status |
| --- | --- | --- | --- | --- |
| 1 | Register new user | New user registration with generated email and mobile | `onboarding.spec.ts` | Stable |
| 2 | Email verification | Manual email-link handoff in Playwright browser | `onboarding.spec.ts` | Controlled manual step |
| 3 | Login after verification | Login with created user plus public auth UI navigation, password visibility, registration controls, back-to-login, and whitespace/unsafe input checks | `onboarding.spec.ts`, `AuthUiValidation.spec.ts`, `AuthNegative.spec.ts` | Stable after email verification |
| 4 | Mobile verification | Completes if mobile verification screen appears | `onboarding.spec.ts`, `OverlayStrategistsTrial.spec.ts` | Stable |
| 5 | Risk profile | Completes required risk profile fields and validates missing required fields, investing experience, strategy, account type, editable controls, update-before-save, post-onboarding dashboard updates, additional field persistence, and refresh persistence | `onboarding.spec.ts`, `OnboardingFieldValidation.spec.ts`, `RiskComplianceUpdate.spec.ts` | Stable prerequisite + controlled validation |
| 6 | Compliance profile | Completes state/disclosures and validates state required, disclosures required, every disclosure required, cancel behavior, editable controls, update-before-save, post-onboarding dashboard updates, additional field persistence, and refresh persistence | `onboarding.spec.ts`, `OnboardingFieldValidation.spec.ts`, `RiskComplianceUpdate.spec.ts` | Stable prerequisite + controlled validation |
| 7 | Plan selection | Selects Income Builder plan and validates plan catalog, feature summaries, monthly/annual toggle, Complete Setup guardrail, and Overlay Strategists trial modals without starting checkout | `onboarding.spec.ts`, `PlanSelectionValidation.spec.ts` | Stable + controlled validation |
| 8 | Stripe payment | Completes Stripe checkout using test card | `onboarding.spec.ts` | Stable |
| 9 | Dashboard validation | Verifies dashboard loads after payment and does not show load-error screen | `onboarding.spec.ts`, `DashboardHealth.spec.ts` | Stable |
| 10 | Dashboard navigation | Authenticated dashboard, top navigation tabs, top navigation route health, destination content rendering, destination refresh resilience, key authenticated route refresh resilience, dashboard refresh utility, dashboard quick-action menu, notification panel behavior, notification/theme/fullscreen controls, profile-menu navigation, profile-menu dismissal, profile-menu sign out, profile, billing, Risk & Compliance, menu, and browser-back navigation | `DashboardNavigation.spec.ts` | Stable |
| 11 | Profile page | Validates profile data, personal-info controls, read-only email, and opt-in name update/restore persistence | `Profile.spec.ts` | Stable + controlled update |
| 12 | Profile negative validation | Email read-only, empty draft safety, refresh persistence | `ProfileNegative.spec.ts` | Stable |
| 13 | Profile mobile validation | Mobile section visibility, invalid mobile guardrail, optional OTP request/update | `ProfileMobileValidation.spec.ts` | Controlled by env flags |
| 14 | Password validation | Mismatch and wrong current password checks | `ProfilePasswordMismatch.spec.ts`, `ProfileWrongCurrentPassword.spec.ts` | Stable |
| 15 | Billing page | Billing overview, plans, transactions, invoice, PDF, tab stability, and billing evidence link targets inside OOLTool | `BillingDeep.spec.ts`, `BillingEdgeValidation.spec.ts`, `Subscriber.spec.ts` | Stable |
| 16 | Logout | User logout, login redirect, browser-back protection, refresh protection, and direct protected-route blocking after logout | `Subscriber.spec.ts`, `SessionSecurity.spec.ts` | Stable |
| 17 | Forgot password | Reset email, reset page, new password, login with new password, negative form validation, whitespace/unsafe input checks, password-reset email rate-limit validation, and accessible public controls | `forgotpassword.spec.ts`, `AuthNegative.spec.ts`, `AuthConfigurationLimits.spec.ts`, `AccessibilityBrowser.spec.ts` | Controlled manual email step + stable negative checks |
| 18 | Account unlock | Locked-account email unlock and login | `UnlockAccount.spec.ts` | Controlled, only when account is locked |
| 19 | MFA / 2FA | TOTP, backup code, trusted-device, manual OTP fallback | `MfaUserFlow.spec.ts` | Controlled by env flags |
| 20 | Trusted device | TOTP-based remember-device validation | `MfaUserFlow.spec.ts` | Requires `MFA_LOCAL_TOTP_SECRET` |
| 21 | Stripe / Subscription extension | Overlay Strategists with-card, without-card, terms, Stripe negative, customer portal, subscription management | `OverlayStrategistsTrial.spec.ts`, `BillingSubscriptionManagement.spec.ts`, `PaymentNegative.spec.ts` | Paused for Stripe phase |
| 22 | Permission access | Prepared allowed/restricted users validate route and action access by permission | `PermissionAccess.spec.ts` | Controlled by env flags |
| 23 | Auth configuration limits | Login lockout after configured failed attempts and password-reset email request limit | `AuthConfigurationLimits.spec.ts` | Controlled by env flags; use dedicated accounts |

## Stable Journey Command

Use this for the reliable user journey that should not require fresh email links,
MFA secrets, or one-time controlled state.

```powershell
npm run test:user-journey:stable -- --headed
$env:AIR_ALLOW_STALE_REPORT="true"
npm run report:execution
```

## Stable Journey With AIR Report

```powershell
npm run user-journey:report
```

## Controlled User Journey Command

Use this for core user-journey flows that require email links, unlock links,
auth configuration flags, MFA secrets, backup codes, or manual headed
interaction. Stripe customer portal and Stripe checkout tests are intentionally
excluded until the Stripe phase.

```powershell
npm run test:user-journey:controlled -- --headed
```

Run only Risk Profile and Compliance fast field validation:

```powershell
$env:ONBOARDING_FIELD_VALIDATION_ENABLED="true"
npm run test:controlled:onboarding-fields -- --headed
```

Run the full field-level regression when SMS/email capacity is available:

```powershell
$env:ONBOARDING_FIELD_VALIDATION_ENABLED="true"
$env:ONBOARDING_FIELD_VALIDATION_FULL_ENABLED="true"
npm run test:controlled:onboarding-fields -- --headed
```

Run only the Risk Profile and Compliance update-before-save scenario:

```powershell
$env:ONBOARDING_FIELD_VALIDATION_ENABLED="true"
$env:ONBOARDING_FIELD_VALIDATION_FULL_ENABLED="true"
npm run test:controlled:onboarding-fields -- --headed -g "Risk Profile and Compliance selections can be updated before save"
```

Run authenticated dashboard Risk & Compliance read-only validation:

```powershell
$env:RISK_COMPLIANCE_VALIDATION_ENABLED="true"
npm run test:controlled:risk-compliance -- --headed
```

Run authenticated dashboard Risk & Compliance update validation:

```powershell
$env:RISK_COMPLIANCE_VALIDATION_ENABLED="true"
$env:RISK_COMPLIANCE_UPDATE_ENABLED="true"
npm run test:controlled:risk-compliance -- --headed
```

Run plan-selection validation without activating a plan:

```powershell
$env:PLAN_SELECTION_EXISTING_EMAIL="PASTE_REAL_PREPARED_PLAN_USER_EMAIL"
$env:PLAN_SELECTION_EXISTING_PASSWORD="PASTE_REAL_PREPARED_PLAN_USER_PASSWORD"
$env:PLAN_SELECTION_EXISTING_MOBILE="PASTE_REAL_PREPARED_PLAN_USER_MOBILE"
npm run test:controlled:plan-selection -- --headed
```

Run plan-selection validation with a fresh onboarding user:

```powershell
$env:PLAN_SELECTION_VALIDATION_ENABLED="true"
npm run test:controlled:plan-selection -- --headed
```

Run opt-in free-plan activation validation with a fresh user:

```powershell
$env:PLAN_SELECTION_VALIDATION_ENABLED="true"
$env:PLAN_SELECTION_FREE_ACTIVATION_ENABLED="true"
npm run test:controlled:plan-selection -- --headed -g "Curious Explorer free plan"
```

When manual registration works but the automation does not see the OTP field,
enable the headed fallback:

```powershell
$env:PLAN_SELECTION_VALIDATION_ENABLED="true"
$env:PLAN_SELECTION_FREE_ACTIVATION_ENABLED="true"
$env:REGISTRATION_OTP_MANUAL_FALLBACK="true"
npm run test:controlled:plan-selection -- --headed -g "Curious Explorer free plan"
```

If registration SMS is throttled, provide a prepared user already waiting on the
plan-selection step:

```powershell
$env:PLAN_SELECTION_VALIDATION_ENABLED="true"
$env:PLAN_SELECTION_FREE_ACTIVATION_ENABLED="true"
$env:PLAN_SELECTION_EXISTING_EMAIL="PASTE_REAL_PREPARED_PLAN_USER_EMAIL"
$env:PLAN_SELECTION_EXISTING_PASSWORD="PASTE_REAL_PREPARED_PLAN_USER_PASSWORD"
$env:PLAN_SELECTION_EXISTING_MOBILE="PASTE_REAL_PREPARED_PLAN_USER_MOBILE"
npm run test:controlled:plan-selection -- --headed -g "Curious Explorer free plan"
```

Run profile mobile number validation:

```powershell
$env:PROFILE_MOBILE_VALIDATION_ENABLED="true"
npm run test:controlled:profile-mobile -- --headed
```

Run opt-in profile name update/restore validation:

```powershell
$env:PROFILE_UPDATE_VALIDATION_ENABLED="true"
npx playwright test tests/Profile.spec.ts -g "Profile name update" --headed
```

Run Stripe billing management portal validation without cancelling. This is
paused from the core user journey and should be run during the Stripe phase:

```powershell
$env:BILLING_SUBSCRIPTION_MANAGEMENT_ENABLED="true"
$env:BILLING_MANAGEMENT_EMAIL="imhardikthanki+completejourney@gmail.com"
$env:BILLING_MANAGEMENT_PASSWORD="H@rdik9944"
npm run test:controlled:billing-management -- --headed
```

## AIR Evidence Notes

AIR links the raw Playwright HTML/JSON report after every run. Screenshots,
videos, and traces are only available for all tests when Playwright is run with
full artifact capture:

```powershell
$env:RECORD_ALL_ARTIFACTS="true"
npm run test:user-journey:stable -- --headed
npm run report:execution
```

Without `RECORD_ALL_ARTIFACTS=true`, Playwright keeps rich artifacts mainly for
failures, so a fully passing run may show raw report evidence but no screenshots,
videos, or traces.

## Full User Journey Command

This includes stable plus controlled flows. Some MFA tests will skip when their
required environment variables are not configured.

```powershell
npm run test:user-journey:full -- --headed
```

## MFA Environment Variables

Backup-code login:

```powershell
$env:MFA_USER_FLOW_ENABLED="true"
$env:MFA_LOCAL_EMAIL="imhardikthanki+mfatest@gmail.com"
$env:MFA_LOCAL_PASSWORD="H@rdik9944"
$env:MFA_LOCAL_BACKUP_CODE="PASTE-FRESH-BACKUP-CODE"
```

TOTP and trusted-device validation:

```powershell
$env:MFA_USER_FLOW_ENABLED="true"
$env:MFA_LOCAL_EMAIL="imhardikthanki+mfatest@gmail.com"
$env:MFA_LOCAL_PASSWORD="H@rdik9944"
$env:MFA_LOCAL_TOTP_SECRET="PASTE_BASE32_SECRET"
```

Manual OTP fallback:

```powershell
$env:MFA_USER_FLOW_ENABLED="true"
$env:MFA_MANUAL_OTP_FLOW_ENABLED="true"
$env:MFA_LOCAL_EMAIL="imhardikthanki+mfatest@gmail.com"
$env:MFA_LOCAL_PASSWORD="H@rdik9944"
npm run test:controlled:mfa -- --headed -g "Manual headed MFA login fallback"
```

## Forgot Password Notes

The forgot-password flow changes the account password. Keep this flow controlled
and run it only when you are ready to use the newly configured password for
later login tests.

```powershell
npm run test:controlled:email -- --headed -g "Forgot Password Flow"
```

## Remaining Deep Validation Opportunities

Risk Profile:

- Basic required-field progress blocking is automated.
- Investing experience required validation is automated.
- Strategy selection required validation is automated.
- Account type required validation is automated.
- Updating selections before final save is automated.
- Authenticated dashboard Risk Profile display/update is automated as a controlled flow.
- Saved progress after refresh is automated.
- Remaining: deeper audit/admin-notification validation if product exposes evidence.

Compliance:

- Basic required-field and disclosure progress blocking is automated.
- State required validation is automated.
- All disclosures required validation is automated.
- Individual disclosure required validation is automated.
- Disclosure cancel behavior is automated.
- Updating state selection before final save is automated.
- Authenticated dashboard Compliance display/update is automated as a controlled flow.
- Saved progress after refresh is automated.
- Remaining: deeper audit/admin-notification validation if product exposes evidence.

Profile Mobile:

- Mobile section visibility is automated.
- Invalid mobile-number guardrail is automated.
- OTP request and mobile update are available as opt-in controlled flows.
- Remaining: duplicate mobile and resend/rate-limit validation when safe test
  accounts and SMS capacity are available.

MFA:

- Product defects are currently documented and should continue after fixes.
- Backup codes are single-use and must not be reused.
- Trusted-device automation requires `MFA_LOCAL_TOTP_SECRET`.

Stripe:

- Stripe testing now follows the Subscription Management testcase matrix in
  `docs/SUBSCRIPTION_STRIPE_COVERAGE_MATRIX.md`.
- Browser-safe coverage is automated first: trial presentation, with-card and
  without-card trial paths, terms guardrails, checkout validation, portal
  overview, plan controls, invoice history, payment-method and billing-info
  screens, and non-destructive cancellation-state validation.
- Declined-card checkout validation is available with a fresh Stripe Checkout
  URL through `PaymentNegative.spec.ts`.
- Lifecycle cases that require scheduler/time travel, Stripe ledger validation,
  admin/audit access, refund approval, or dunning webhooks remain documented
  until those controls are available.

Plan Selection:

- Plan catalog visibility is automated for Curious Explorer, Income Builder,
  Overlay Strategists, Portfolio Hedger, and Marketplace.
- Monthly/annual toggle behavior is automated.
- Complete Setup guardrail before selecting a plan is automated.
- Overlay Strategists with-card and without-card trial modal copy and cancel
  behavior are automated without completing checkout.
- Curious Explorer free-plan activation is available as an opt-in controlled
  flow and verifies dashboard redirect without Stripe.
- Remaining: destructive or subscription-changing plan activation should stay
  controlled with dedicated test accounts.

Signup:

- Invalid email formats, unsafe email inputs, whitespace trimming, password
  mismatch, mobile formatting, mobile max length, and pre-OTP submit blocking
  are automated.
- Duplicate email validation is available as an opt-in controlled flow because
  it requires requesting the signup OTP.
- OTP max-length, paste trimming, digits-only validation, and verify-button
  enablement are available as opt-in controlled flows because they require the
  OTP input to be displayed.
- OTP resend/cooldown presentation is available as an opt-in controlled flow.
  It observes the resend or cooldown state after the first code request without
  repeatedly requesting SMS codes.

Permission Access:

- Permission validation is available as an opt-in controlled suite.
- Requires one prepared user with the target permissions and one prepared user
  without the target permissions.
- Validates allowed access and restricted access for Billing, Risk &
  Compliance, and Profile routes/actions by default.

Auth Configuration Limits:

- Login lockout validation is available as an opt-in controlled flow.
- Password-reset email rate-limit validation is available as an opt-in
  controlled flow.
- These tests should use dedicated accounts because they intentionally trigger
  lockout or request-limit behavior.
- Included in the controlled/full user-journey scripts, but skipped unless
  `AUTH_CONFIGURATION_LIMITS_ENABLED` and the scenario-specific flags are set.

Billing Subscription Management:

- Stripe customer portal overview validation is automated.
- Plan action/status controls are automated.
- Stripe portal invoice history is automated.
- Add-payment-method and billing-information update screens are automated
  without saving changes.
- Cancel subscription form display, reason, feedback, or already-scheduled
  cancellation state are automated without submitting cancellation.
- Remaining: destructive final cancellation and upgrade/downgrade checkout
  should stay opt-in with dedicated test accounts.

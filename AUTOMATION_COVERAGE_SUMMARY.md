# OOLTool Automation Coverage Summary

## Purpose

This document summarizes the automated validation coverage implemented for the OOLTool UAT application using Playwright.

It is intended for QA, product, engineering, and client stakeholders. A reader should be able to understand what has been validated without reading the automation code.

## Application Under Test

- Product: OOLTool
- Environment: UAT
- Automation Framework: Playwright with TypeScript
- Primary Browser: Chromium
- Reporting: Playwright HTML Report and AIR Automation Intelligence Report
- Evidence: Screenshots, videos, traces, HTML report artifacts, and AIR execution data

## Executive Summary

The automation suite validates the main OOLTool user journey from registration through dashboard access, profile management, risk and compliance, plan selection, billing, subscription management, authentication, security, and negative validation scenarios.

The suite is structured into:

- Stable tests for regular smoke, sanity, and regression execution.
- Controlled tests that require prepared users, environment flags, email links, MFA secrets, Stripe state, or specific account configuration.
- Manual-handoff tests for flows that require external email links or authenticator OTP entry.

All completed executions can be converted into an AIR report, which presents execution status, module health, business journey health, failed tests, evidence, historical intelligence, and release recommendation.

## Core Business Journeys Covered

### 1. User Registration and Onboarding

Validated coverage:

- Open application and navigate to Create Account.
- Register with generated scenario-specific email.
- Enter first name, last name, email, password, confirm password, and US mobile number.
- Request SMS OTP.
- Enter configured/static OTP.
- Submit registration.
- Validate email verification handoff.
- Login after email verification.
- Redirect user to onboarding when profile is incomplete.
- Complete Risk Profile.
- Complete Compliance Profile and disclosures.
- Select plan.
- Redirect to Stripe checkout for paid plan.
- Complete Stripe payment with test card details.
- Validate dashboard loads after onboarding.
- Validate dashboard persists after refresh.

Primary specs:

- `tests/onboarding.spec.ts`
- `tests/OnboardingFieldValidation.spec.ts`

### 2. Signup and Registration Validation

Validated coverage:

- Required fields.
- Invalid email.
- Duplicate email.
- Password mismatch.
- Missing password.
- Password policy.
- First name and last name validation.
- Mobile number field validation.
- OTP field validation.
- OTP length validation.
- Invalid OTP handling.
- SQL injection input.
- XSS input.
- HTML/long input validation.
- Register page keyboard navigation.
- Register page mobile viewport usability.

Business rule:

- Duplicate mobile numbers are allowed because a user may use the same mobile number across multiple accounts.

Primary specs:

- `tests/SignupNegative.spec.ts`
- `tests/AuthUiValidation.spec.ts`
- `tests/AccessibilityBrowser.spec.ts`

### 3. Login and Authentication

Validated coverage:

- Valid subscriber login.
- Empty email and password.
- Empty email only.
- Empty password only.
- Invalid email format.
- Wrong credentials.
- Unregistered email behavior.
- Email with leading/trailing spaces.
- SQL injection input.
- XSS input.
- Very long email input.
- Enter key submission behavior.
- Password visibility control.
- Login direct URL remains usable after refresh.
- Login and registration pages remain usable with browser back/forward navigation.
- Protected route redirects.
- Logout.
- Logout prevents dashboard access.
- Browser back behavior after logout.

Primary specs:

- `tests/AuthNegative.spec.ts`
- `tests/AuthUiValidation.spec.ts`
- `tests/SessionSecurity.spec.ts`
- `tests/Subscriber.spec.ts`

### 4. Forgot Password and Reset Password

Validated coverage:

- Forgot password navigation from login.
- Back to login.
- Direct forgot password URL after refresh.
- Empty email validation.
- Invalid email validation.
- Email with surrounding spaces.
- SQL injection input.
- XSS input.
- Very long email input.
- Reset password empty-field validation.
- Password mismatch validation.
- Weak password behavior.
- Back to login from reset page.
- Full reset flow with manual reset-link handoff when enabled.
- Login with new password after reset.

Controlled behavior:

- Full forgot password flow is skipped by default because it requires an email reset link.
- Enable it only with `FORGOT_PASSWORD_FLOW_ENABLED=true`.

Primary specs:

- `tests/forgotpassword.spec.ts`
- `tests/ResetPassword.spec.ts`
- `tests/ResetPasswordNegative.spec.ts`

### 5. Account Unlock

Validated coverage:

- Locked account message.
- Unlock link request option.
- Unlock email handoff.
- Login after unlock.
- Dashboard validation after unlock.

Controlled behavior:

- Requires a locked/prepared account or lockout configuration.

Primary specs:

- `tests/UnlockAccount.spec.ts`
- `tests/AuthConfigurationLimits.spec.ts`

### 6. Risk Profile

Validated coverage:

- Risk Profile tab opens.
- Investment experience selection.
- Options trading experience selection.
- Multi-leg strategy answer.
- Risk tolerance.
- Portfolio loss tolerance.
- Preferred duration.
- Allowed strategies.
- Account type selection.
- Save Risk Profile.
- Saved Risk Profile loads on dashboard.
- Risk Profile can be updated.
- Updated values persist after refresh/reopen.

Primary specs:

- `tests/onboarding.spec.ts`
- `tests/OnboardingFieldValidation.spec.ts`
- `tests/RiskComplianceUpdate.spec.ts`

### 7. Compliance Profile

Validated coverage:

- Compliance tab opens.
- State of residence.
- Broker option approval.
- Accreditation.
- Disclosure sections.
- Disclosure acknowledgement.
- Save Compliance Profile.
- Saved compliance details load on dashboard.
- Compliance can be updated.
- Updates persist after refresh/reopen.

Primary specs:

- `tests/onboarding.spec.ts`
- `tests/OnboardingFieldValidation.spec.ts`
- `tests/RiskComplianceUpdate.spec.ts`

### 8. Plan Selection and Trial Options

Validated coverage:

- Plan selection page displays available plans.
- Monthly and annual toggle changes pricing display.
- Paid-plan monthly and annual pricing presentation is validated without
  activating checkout.
- Paid-plan entitlement limits are displayed before checkout for Income
  Builder, Overlay Strategists, Portfolio Hedger, and Marketplace.
- Users can switch between available plan selections without launching Stripe
  checkout until setup is submitted.
- Multi-plan Stripe checkout summaries are validated before payment across
  direct paid monthly and annual plan combinations.
- Curious Explorer free plan completes onboarding without Stripe where enabled.
- Paid plan redirects to Stripe checkout.
- Overlay Strategists 30-day trial options.
- Trial with card opens Stripe checkout.
- Trial without card redirects to dashboard and activates trial.
- Trial Terms checkbox behavior.
- Billing reflects selected plan/trial state where data is available.

Primary specs:

- `tests/PlanSelectionValidation.spec.ts`
- `tests/OverlayStrategistsTrial.spec.ts`
- `tests/DirectSubscriptionPurchase.spec.ts`

### 9. Stripe Checkout and Payment

Validated coverage:

- Stripe checkout loads.
- Card number field.
- Expiry field.
- CVC field.
- Billing name.
- Country/region.
- Payment submission.
- Redirect back to OOLTool dashboard.
- Checkout refresh preserves selected subscription context before payment.
- Browser back from Stripe checkout returns safely before payment.
- Currency, exchange-rate, and conversion-fee copy is validated before payment
  for non-USD checkout presentation.
- Incomplete card number validation.
- Expired card validation.
- Invalid CVC validation.
- Generic declined-card validation.
- Insufficient-funds card validation.
- Processing-error card validation.
- Stolen-card decline validation.
- Authentication-required checkout context validation.

Controlled behavior:

- Stripe-hosted flows are controlled and may be skipped when Stripe state is not prepared.

Primary specs:

- `tests/onboarding.spec.ts`
- `tests/PaymentNegative.spec.ts`
- `tests/OverlayStrategistsTrial.spec.ts`
- `tests/DirectSubscriptionPurchase.spec.ts`

### 10. Dashboard and Navigation

Validated coverage:

- Dashboard loads after login.
- Dashboard direct route does not show load-error screen.
- Dashboard refresh remains healthy.
- Profile menu opens.
- Profile menu exposes Profile, Billing, Risk & Compliance, and Sign Out.
- Profile menu navigation opens expected pages.
- Profile menu closes with Escape and outside click.
- Top navigation tabs are visible.
- Dashboard, Analytics, Portfolio, Accounts, and Academy routes open without load errors.
- Navigation destinations render usable content.
- Navigation destinations remain usable after refresh.
- Dashboard refresh utility reloads data without ending the session.
- Dashboard quick-action menu opens without changing the session.
- Notification panel opens and closes.
- Theme toggle.
- Fullscreen control.
- Browser back from Billing returns to Dashboard.

Primary specs:

- `tests/DashboardHealth.spec.ts`
- `tests/DashboardNavigation.spec.ts`

### 11. Profile Management

Validated coverage:

- Profile page opens.
- Profile data loads.
- Email field remains disabled/read-only.
- Personal information controls are visible and safe.
- Unsaved first-name and last-name drafts are not persisted after refresh.
- Profile route remains usable after browser back/forward navigation.
- Password mismatch validation.
- Wrong current password validation.
- Profile negative validations.
- Profile mobile validation.
- Mobile number format validation.
- Password form validation.
- Security section display.

Primary specs:

- `tests/Profile.spec.ts`
- `tests/ProfileNegative.spec.ts`
- `tests/ProfileMobileValidation.spec.ts`
- `tests/ProfilePasswordMismatch.spec.ts`
- `tests/ProfileWrongCurrentPassword.spec.ts`
- `tests/ProfileSecurityDisplay.spec.ts`

### 12. MFA and Trusted Device

Validated and prepared coverage:

- MFA security section visibility.
- Enable MFA flow.
- Invalid OTP rejection.
- Backup code login.
- Backup code single-use validation.
- Trusted device login behavior.
- Revoking trusted device requires MFA again.
- Regenerate backup codes.
- Disable 2FA.
- Manual headed fallback for OTP entry.

Controlled behavior:

- `MFA_LOCAL_TOTP_SECRET` is required for fully automated authenticator OTP generation.
- Backup codes are single-use and must not be reused.
- Some MFA scenarios are skipped unless explicitly enabled.

Known product behavior under review:

- Google-authenticated users may be asked for a password when regenerating backup codes or disabling 2FA, even though they may not have a password.

Primary spec:

- `tests/MfaUserFlow.spec.ts`

### 13. Billing Overview, Plans, Transactions, and Invoices

Validated coverage:

- Billing page opens from profile menu.
- Billing overview displays plan status and management controls.
- Billing page remains available after refresh.
- Plans tab opens.
- Expected plan is visible.
- Plan lifecycle action/status summary is validated without clicking upgrade,
  downgrade, or subscription-changing actions.
- Billing interval presentation is validated without switching plans or
  submitting billing changes.
- Plans and history tabs can be revisited safely without launching checkout.
- History tab opens.
- Transactions tab opens.
- Paid transaction status is visible.
- Invoice link opens invoice page.
- Invoice page shows paid status.
- PDF link is available and points to a non-empty URL.
- Billing history remains stable after refresh.
- Billing route remains usable after browser back/forward navigation.

Primary specs:

- `tests/BillingDeep.spec.ts`
- `tests/BillingEdgeValidation.spec.ts`
- `tests/Subscriber.spec.ts`

### 14. Subscription Management and Stripe Portal

Validated coverage:

- Manage subscription opens Stripe customer portal.
- Portal displays current subscription details.
- Portal shows paid invoice history.
- Portal return link opens application content.
- Add payment method screen opens without saving.
- Payment recovery entry points are visible without saving payment changes.
- Billing information update screen opens without saving.
- Cancellation lifecycle state is readable without cancelling.
- Cancel subscription form accepts reason and feedback without completing destructive cancellation.
- Already scheduled cancellation state is validated without changing it.
- End-to-end subscription lifecycle is mapped across trial, paid purchase,
  upgrade, downgrade, billing interval change, cancellation, refund, expiry,
  renewal, dunning, and audit/reporting expectations.
- Lifecycle rows clearly identify what is executable now, what is a known
  product issue, and what remains blocked by Stripe/admin/scheduler fixtures.

Controlled behavior:

- Destructive cancellation is not executed by default.
- Portal tests require a prepared paid/trial subscriber.
- Immediate cancellation, refunds, renewal, expiry, Stripe proration, and audit
  validation require dedicated controlled fixtures before execution.

Primary spec:

- `tests/BillingSubscriptionManagement.spec.ts`
- `tests/SubscriptionLifecycleExecution.spec.ts`
- `tests/SubscriptionLifecycleE2EMatrix.spec.ts`

### 15. Permission and Access Control

Prepared coverage:

- Permission-based page access.
- Restricted functionality hidden or blocked for users without permission.
- Allowed functionality available for users with correct permission.
- Role-driven MFA behavior identified for business-rule confirmation.

Controlled behavior:

- Requires prepared users with specific roles and permissions.

Primary spec:

- `tests/PermissionAccess.spec.ts`

### 16. Session Security

Validated coverage:

- Protected routes redirect unauthenticated users.
- Onboarding route redirects unauthenticated users.
- Logout prevents direct dashboard access.
- Browser back after logout does not restore authenticated session.
- Refresh without login redirects to login.
- Protected URL handling in a new tab.

Primary specs:

- `tests/AuthNegative.spec.ts`
- `tests/SessionSecurity.spec.ts`
- `tests/DashboardNavigation.spec.ts`

### 17. Accessibility and Browser Behavior

Validated coverage:

- Login page mobile usability.
- Register page mobile usability.
- Forgot password page mobile usability.
- Login keyboard tab order.
- Forgot password keyboard tab order.
- Register keyboard tab order.
- Browser refresh and back behavior.

Primary spec:

- `tests/AccessibilityBrowser.spec.ts`

### 18. Password Policy

Validated coverage:

- Minimum password length.
- Missing uppercase/lowercase/number/special character where policy requires.
- Password mismatch.
- Weak password rejection.
- Password policy validation on reset/change flows where applicable.

Primary specs:

- `tests/PasswordPolicy.spec.ts`
- `tests/ProfilePasswordMismatch.spec.ts`
- `tests/ProfileWrongCurrentPassword.spec.ts`
- `tests/ResetPasswordNegative.spec.ts`

### 19. Configuration, Rate Limit, and Cooldown

Validated/prepared coverage:

- Failed login attempt limit.
- Account lockout behavior.
- Password reset email request limit.
- Unlock link recovery from locked account.
- MFA lockout configuration as future/controlled coverage.

Controlled behavior:

- These tests can intentionally lock accounts or consume request limits, so they require explicit enablement.

Primary spec:

- `tests/AuthConfigurationLimits.spec.ts`

## AIR Reporting Coverage

AIR validates and presents:

- Total tests.
- Passed tests.
- Failed tests.
- Skipped tests.
- Execution duration.
- Release decision.
- Quality score.
- Module health.
- Business journey health.
- Failed test investigation summaries.
- Evidence status.
- Historical intelligence.
- Build comparison.
- Search index.
- AIR Core engine status.
- Product roadmap.

Recent AIR reporting improvements:

- Failed Tests section supports Load More for both investigation cards and detailed failure list.
- Long technical error messages are shortened into readable summaries.
- Evidence and Playwright report links remain available for deeper investigation.

Primary scripts:

- `scripts/generate-air-results.js`
- `scripts/generate-execution-report.js`

## Suite Commands

### Smoke Suite

```powershell
npm run test:smoke
```

### Sanity Suite

```powershell
npm run test:sanity
```

### Regression Suite

```powershell
$env:RECORD_ALL_ARTIFACTS="true"
npm run test:regression -- --headed
npm run report:execution
```

### Full Playwright Suite

```powershell
$env:RECORD_ALL_ARTIFACTS="true"
npx playwright test --headed
npm run report:execution
```

### Open Playwright Report

```powershell
npx playwright show-report
```

### Open AIR Report

```powershell
start execution-report\index.html
```

## Common Controlled Flags

| Flag | Purpose |
| --- | --- |
| `FORGOT_PASSWORD_FLOW_ENABLED=true` | Enables full forgot-password reset-link flow. |
| `MFA_USER_FLOW_ENABLED=true` | Enables MFA user flow tests. |
| `MFA_LOCAL_TOTP_SECRET=<secret>` | Enables automated authenticator OTP generation. |
| `MFA_LOCAL_BACKUP_CODE=<code>` | Enables backup-code login validation. |
| `BILLING_SUBSCRIPTION_MANAGEMENT_ENABLED=true` | Enables Stripe portal subscription tests. |
| `RISK_COMPLIANCE_VALIDATION_ENABLED=true` | Enables risk/compliance validation tests. |
| `RISK_COMPLIANCE_UPDATE_ENABLED=true` | Enables risk/compliance update tests. |
| `PLAN_SELECTION_VALIDATION_ENABLED=true` | Enables controlled plan selection tests. |
| `PLAN_SELECTION_FREE_ACTIVATION_ENABLED=true` | Enables free-plan activation test. |
| `OVERLAY_STRATEGISTS_FLOW_ENABLED=true` | Enables Overlay Strategists trial tests. |
| `PAYMENT_NEGATIVE_ENABLED=true` | Enables Stripe negative payment tests. |
| `AUTH_CONFIGURATION_LIMITS_ENABLED=true` | Enables auth rate-limit and lockout tests. |

## Coverage Summary by Module

| Module | Coverage Status | Summary |
| --- | --- | --- |
| Registration | Covered | Positive signup, field validation, OTP, duplicate email, security inputs. |
| Email Verification | Controlled | Manual email verification handoff is supported. |
| Login | Covered | Positive, negative, security input, protected routes, Enter key behavior. |
| Forgot Password | Controlled | Negative validations plus full reset flow when enabled. |
| Account Unlock | Controlled | Unlock email flow for locked accounts. |
| Onboarding | Covered | Registration through risk, compliance, plan, payment, dashboard. |
| Risk Profile | Covered | Initial completion, validation, update, persistence. |
| Compliance | Covered | Initial completion, disclosures, update, persistence. |
| Plan Selection | Covered | Monthly/annual, free plan, paid plan, trial options. |
| Stripe Checkout | Covered/Controlled | Positive checkout plus controlled negative payment validation for incomplete card data, declined cards, insufficient funds, processing errors, stolen-card decline, and authentication-required checkout context. |
| Dashboard | Covered | Load, refresh, navigation, menus, utilities. |
| Profile | Covered | Data loading, read-only email, safe personal-info controls, draft refresh behavior, password/mobile validations. |
| MFA | Controlled | Backup code, invalid OTP, trusted device, enable/disable flows prepared. |
| Billing | Covered | Overview, plans, history, transactions, invoice, PDF links, tab stability, browser back/forward behavior. |
| Subscription Portal | Controlled | Manage subscription, invoice history, add payment, update info, cancel form. |
| Permissions | Controlled | Role/permission access validation prepared. |
| Session Security | Covered | Protected route redirects, logout, back-button behavior. |
| Accessibility | Covered | Keyboard navigation and responsive usability checks. |
| AIR Report | Covered | Execution intelligence, evidence, history, release decision, search. |

## Current Automation Position

The automation suite covers the main business-critical OOLTool journey and key negative, security, billing, profile, dashboard, and reporting scenarios.

Strongest covered areas:

- Authentication and protected access.
- Signup and onboarding.
- Risk and compliance.
- Dashboard navigation.
- Profile validation.
- Billing and invoice visibility.
- Subscription management smoke coverage.
- AIR execution reporting.

Controlled areas:

- MFA full lifecycle with authenticator secret.
- Email-link dependent flows.
- Stripe-hosted destructive billing actions.
- Permission tests requiring prepared users.
- Admin-side configuration and rate-limit validation.

## Client-Ready Summary

The current Playwright automation suite validates OOLTool across authentication, onboarding, risk/compliance, plan selection, payment, dashboard, profile, billing, subscription management, session security, accessibility, and AIR reporting. Controlled tests are available for MFA, email-link flows, rate limits, Stripe checkout edge cases, and Stripe portal actions where execution depends on external systems or prepared account state.

# OOLTool Automation Coverage Summary

This document explains the automation coverage currently available for the OOLTool UAT test suite. It is written for QA, product, engineering, and client stakeholders so they can quickly understand what the automation validates.

## Executive Summary

The automation suite validates the major subscriber journeys across authentication, onboarding, dashboard access, profile management, risk and compliance, plan selection, billing, subscription management, security behavior, and AIR reporting.

The suite is organized into smoke, sanity, regression, controlled, and gated tests. Safe tests can run together. Tests that require one-time email links, MFA secrets, backup codes, locked accounts, Stripe checkout URLs, or role-specific users are gated so they do not accidentally consume data, lock accounts, cancel subscriptions, or create unwanted billing changes.

## Covered User Journeys

### 1. Authentication and Login

- Login with valid credentials.
- Login validation for empty fields.
- Invalid email format validation.
- Wrong password validation.
- Unregistered email validation.
- Leading and trailing whitespace validation where applicable.
- SQL injection and XSS style input validation.
- Password visibility toggle validation.
- Press Enter to submit login.
- Logout validation.
- Logout prevents access through browser back navigation.
- Protected dashboard routes redirect unauthenticated users to login.

### 2. Signup and Registration

- Create account with email, password, and US mobile number.
- Static OTP-based mobile verification for test environments.
- Email verification handoff before login.
- Required field validation.
- Invalid email validation.
- Duplicate email validation.
- Password mismatch validation.
- Password policy validation.
- OTP resend validation.
- OTP length validation.
- Signup form accessibility and keyboard behavior coverage where safe.

Note: duplicate mobile number is intentionally allowed because a user may use the same phone number across multiple accounts.

### 3. Onboarding

- Registration to verified login flow.
- Risk profile completion.
- Compliance profile completion.
- Field-level validation for risk profile sections.
- Field-level validation for compliance sections.
- Saved onboarding progress validation.
- Plan selection handoff after risk and compliance completion.

### 4. Risk Profile and Compliance

- Existing saved risk profile loads from the dashboard.
- Existing saved compliance details load from the dashboard.
- Risk profile values can be updated and persisted.
- Compliance values can be updated and persisted.
- Browser back and forward navigation keeps the Risk & Compliance route usable.
- Validation covers state, broker option approval, accreditation, and profile update behavior where available.

### 5. Plan Selection

- Monthly and annual plan UI validation.
- Plan card visibility and selected-plan behavior.
- Free plan onboarding path without Stripe.
- Overlay Strategists trial entry points.
- Trial with card and without card are gated because they can create real subscription states.
- Plan selection scenarios use scenario-specific generated emails starting with `imhardikthanki+`.

### 6. Stripe and Subscription Management

- Stripe checkout payment flow in onboarding.
- Stripe payment form validation for card number, expiry, CVC, cardholder name, country, and submit behavior.
- Billing overview page validation.
- Current plan/status validation.
- Billing Plans tab validation.
- Subscription history tab validation.
- Transaction history tab validation.
- Invoice page validation.
- Invoice PDF link validation.
- Stripe customer portal opens from Manage Subscription.
- Portal subscription overview validation.
- Cancel subscription form reason and feedback validation without destructive cancellation.
- Cancelled/scheduled-cancellation state validation where applicable.

Destructive Stripe actions are gated and should only run with dedicated disposable test subscriptions.

### 7. Dashboard Navigation and Health

- Dashboard loads after login.
- Dashboard persists after refresh.
- Profile, Billing, Risk & Compliance, Dashboard, Analytics, Portfolio, Accounts, and Academy navigation links open without load errors.
- Profile menu exposes Profile, Billing, Risk & Compliance, and Sign out.
- Header notification, theme, and fullscreen controls remain usable.
- Browser back from Billing to Dashboard keeps the session active.

### 8. Profile Management

- Profile page loads successfully.
- Email field remains disabled/read-only.
- Profile update validation.
- Password mismatch validation.
- Wrong current password validation.
- Profile negative validation.
- Mobile change validation is gated where OTP or fresh test data is required.

### 9. MFA and Trusted Device

- MFA UI and security display validation.
- Login using backup code is supported when a fresh one-time backup code is provided.
- Used backup code reuse validation is supported with gated data.
- Remember/trusted-device tests are supported when `MFA_LOCAL_TOTP_SECRET` is configured.
- Manual OTP fallback flow is documented for cases where authenticator OTP must be entered by a tester.
- MFA lifecycle tests are gated because enabling/disabling 2FA, regenerating backup codes, revoking trusted devices, and consuming backup codes change account security state.

### 10. Forgot Password and Unlock Account

- Forgot password page opens from login.
- Reset email request screen validation.
- Reset-password negative validation.
- Invalid reset link does not authenticate the user.
- Unlock account by email is supported when a locked account and email link are available.

Email-link flows are controlled because they require external mailbox interaction.

### 11. Authorization and Permissions

- Permission test scaffolding exists for allowed and restricted users.
- Permission coverage requires prepared role-specific users and is gated until those users are available.

### 12. AIR Reporting

- Playwright JSON results are parsed into `execution-report/air-results.json`.
- AIR report is generated at `execution-report/index.html`.
- AIR summarizes total, passed, failed, skipped, modules, journeys, evidence, quality, release decision, and recommendations.
- Evidence links include screenshots, videos, traces, logs, raw JSON, and Playwright HTML report where artifacts are available.
- Failed-test display is shortened and supports load-more behavior to avoid overwhelming the client report.
- Product Health filters support status-based views such as healthy, warning, and critical.

## Suite Types

### Smoke

Fast validation of the most important happy paths:

- Subscriber login.
- Dashboard health.
- Dashboard navigation.
- Profile page.
- Session security.

### Sanity

Broader day-to-day validation:

- Onboarding.
- Authentication negative checks.
- Signup negative checks.
- Password policy.
- Dashboard/profile/billing checks.
- Subscriber billing path.

### Regression

Full safe regression coverage:

- Authentication.
- Signup.
- Onboarding.
- Risk and compliance.
- Plan selection.
- Dashboard.
- Profile.
- Billing.
- Subscription management.
- Reset-password negative validation.
- Accessibility/browser behavior.

### Controlled / Gated

Run only when required data is available:

- Forgot password reset link.
- Unlock account link.
- Stripe checkout URL or destructive subscription scenarios.
- MFA TOTP secret, backup code, or manual OTP.
- Permission users.
- Auth lockout/rate-limit tests.

## Known Gated Data Requirements

Some tests intentionally skip unless these values are configured:

- `RESET_URL`
- `FORGOT_PASSWORD_FLOW_ENABLED`
- `RUN_UNLOCK_ACCOUNT_TEST`
- `STRIPE_CHECKOUT_URL`
- `MFA_LOCAL_TOTP_SECRET`
- `MFA_LOCAL_BACKUP_CODE`
- `PERMISSION_ALLOWED_EMAIL`
- `PERMISSION_ALLOWED_PASSWORD`
- `PERMISSION_RESTRICTED_EMAIL`
- `PERMISSION_RESTRICTED_PASSWORD`
- `AUTH_LOCKOUT_EMAIL`
- `AUTH_LOCKOUT_PASSWORD`

## Current Execution Recommendation

Use the safe executable runner for broad coverage:

```powershell
powershell -ExecutionPolicy Bypass -File scripts\run-all-executable-tests.ps1 -Headed -GenerateAir
```

For long executions, use the safer batched runner. It preserves completed batch
results even if a later batch fails or takes too long:

```powershell
powershell -ExecutionPolicy Bypass -File scripts\run-safe-batched-tests.ps1
```

If headed mode is not required:

```powershell
powershell -ExecutionPolicy Bypass -File scripts\run-all-executable-tests.ps1 -GenerateAir
```

Open AIR report:

```powershell
start execution-report\index.html
```

Open Playwright HTML report:

```powershell
.\node_modules\.bin\playwright.cmd show-report
```

## Notes for Clients

This automation validates business-critical flows and key negative scenarios. Some tests are intentionally gated because they require single-use tokens, security-sensitive MFA data, disposable Stripe subscriptions, or prepared permission users. Those flows are documented and can be executed when the required test data is available.

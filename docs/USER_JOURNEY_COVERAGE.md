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
| 3 | Login after verification | Login with created user | `onboarding.spec.ts` | Stable after email verification |
| 4 | Mobile verification | Completes if mobile verification screen appears | `onboarding.spec.ts`, `OverlayStrategistsTrial.spec.ts` | Stable |
| 5 | Risk profile | Completes required risk profile fields and validates missing required fields, investing experience, strategy, account type, and refresh persistence | `onboarding.spec.ts`, `OnboardingFieldValidation.spec.ts` | Stable prerequisite + controlled validation |
| 6 | Compliance profile | Completes state/disclosures and validates state required, disclosures required, every disclosure required, cancel behavior, and refresh persistence | `onboarding.spec.ts`, `OnboardingFieldValidation.spec.ts` | Stable prerequisite + controlled validation |
| 7 | Plan selection | Selects Income Builder plan | `onboarding.spec.ts` | Stable |
| 8 | Stripe payment | Completes Stripe checkout using test card | `onboarding.spec.ts` | Stable |
| 9 | Dashboard validation | Verifies dashboard loads after payment | `onboarding.spec.ts` | Stable |
| 10 | Profile page | Validates profile data and read-only email | `Profile.spec.ts` | Stable |
| 11 | Profile negative validation | Email read-only, empty draft safety, refresh persistence | `ProfileNegative.spec.ts` | Stable |
| 12 | Profile mobile validation | Mobile section visibility, invalid mobile guardrail, optional OTP request/update | `ProfileMobileValidation.spec.ts` | Controlled by env flags |
| 13 | Password validation | Mismatch and wrong current password checks | `ProfilePasswordMismatch.spec.ts`, `ProfileWrongCurrentPassword.spec.ts` | Stable |
| 14 | Billing page | Billing overview, plans, transactions, invoice, PDF, tab stability, billing evidence link targets | `BillingDeep.spec.ts`, `BillingEdgeValidation.spec.ts`, `Subscriber.spec.ts` | Stable |
| 15 | Logout | User logout and login redirect | `Subscriber.spec.ts` | Stable |
| 16 | Forgot password | Reset email, reset page, new password, login with new password | `forgotpassword.spec.ts` | Controlled manual email step |
| 17 | Account unlock | Locked-account email unlock and login | `UnlockAccount.spec.ts` | Controlled, only when account is locked |
| 18 | MFA / 2FA | TOTP, backup code, trusted-device, manual OTP fallback | `MfaUserFlow.spec.ts` | Controlled by env flags |
| 19 | Trusted device | TOTP-based remember-device validation | `MfaUserFlow.spec.ts` | Requires `MFA_LOCAL_TOTP_SECRET` |
| 20 | Overlay trial / Stripe extension | Overlay Strategists with-card, without-card, terms, Stripe negative | `OverlayStrategistsTrial.spec.ts` | Controlled |

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

Use this for flows that require email links, MFA secrets, backup codes, or manual
headed interaction.

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

Run profile mobile number validation:

```powershell
$env:PROFILE_MOBILE_VALIDATION_ENABLED="true"
npm run test:controlled:profile-mobile -- --headed
```

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
- Saved progress after refresh is automated.
- Remaining: edit/update profile values after onboarding is complete.

Compliance:

- Basic required-field and disclosure progress blocking is automated.
- State required validation is automated.
- All disclosures required validation is automated.
- Individual disclosure required validation is automated.
- Disclosure cancel behavior is automated.
- Saved progress after refresh is automated.
- Remaining: post-onboarding compliance edit flow if the product exposes one.

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

- Continue after current user journey pass.
- Overlay Strategists controlled coverage is documented in
  `docs/SUBSCRIPTION_STRIPE_COVERAGE_MATRIX.md`.

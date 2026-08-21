# Controlled Test Readiness Checklist

This checklist tracks the test groups that are intentionally not part of the
default stable regression suite. Each group needs external data, one-time links,
or account state before it can run safely.

## Current Default Suite

- Stable executable suite: `136 tests`
- Stable files: `21 files`
- Command:

```powershell
npm run test:regression -- --headed
```

## 1. Reset Password And Forgot Password

Purpose:

- Forgot password request
- Reset password form validation
- Successful reset password

Why controlled:

- Requires an email reset link.
- Successful reset changes the account password.

Required data:

```powershell
$env:RESET_URL="https://uat.ooltool.com/reset-password/..."
```

Forgot-password flow also needs:

```powershell
$env:FORGOT_PASSWORD_FLOW_ENABLED="true"
```

Commands:

```powershell
npm run test:controlled:reset -- --headed
npm run test:controlled:email -- --headed
```

When `RESET_URL` is set, reset-password negative tests are also included in the
stable regression and execution scripts.

Readiness:

- [ ] Test mailbox is accessible.
- [ ] Reset email is received reliably.
- [ ] `RESET_URL` is fresh and unused.
- [ ] Account password is restored to the shared configured password after the run.

## 2. Unlock Account

Purpose:

- Validate locked-account recovery by email unlock link.

Why controlled:

- Requires a purposely locked account.
- Requires an unlock email link.

Required data:

```powershell
$env:RUN_UNLOCK_ACCOUNT_TEST="true"
$env:UNLOCK_ACCOUNT_EMAIL="..."
$env:UNLOCK_ACCOUNT_PASSWORD="..."
```

Command:

```powershell
npm run test:controlled:email -- --headed -g "Unlock Account"
```

Readiness:

- [ ] Account is intentionally locked.
- [ ] Unlock email is accessible.
- [ ] Account can log in after unlock.

## 3. MFA User Flows

Purpose:

- MFA challenge
- Backup code login
- Backup code single-use validation
- Trusted-device validation
- Enable/disable MFA coverage when allowed

Why controlled:

- Backup codes are single-use.
- TOTP needs the authenticator setup secret.
- Enable/disable/regenerate flows mutate account security state.

Required data:

```powershell
$env:MFA_USER_FLOW_ENABLED="true"
$env:MFA_LOCAL_EMAIL="..."
$env:MFA_LOCAL_PASSWORD="..."
$env:MFA_LOCAL_TOTP_SECRET="BASE32SECRET"
$env:MFA_LOCAL_BACKUP_CODE="FRESH-BACKUP-CODE"
```

Command:

```powershell
npm run test:controlled:mfa -- --headed
```

Readiness:

- [ ] MFA test account exists.
- [ ] Current password is known.
- [ ] Base32 authenticator secret is available for automated TOTP tests.
- [ ] Fresh backup code is available for each backup-code run.
- [ ] Account is not temporarily MFA locked.

## 4. Plan Selection And Overlay Strategists Trial

Purpose:

- Plan catalog and billing toggle
- Trial modal content
- Terms acceptance validation
- Free plan activation
- Overlay Strategists trial with and without card

Why controlled:

- Some paths require fresh onboarding users.
- Some paths consume trial eligibility.
- With-card flow redirects to Stripe checkout.

Required data:

```powershell
$env:OVERLAY_STRATEGISTS_FLOW_ENABLED="true"
$env:OVERLAY_STRATEGISTS_WITH_CARD_ENABLED="true"
$env:OVERLAY_STRATEGISTS_WITHOUT_CARD_ENABLED="true"
$env:OVERLAY_STRATEGISTS_TERMS_ENABLED="true"
```

Safe prepared-user read-only mode:

```powershell
$env:PLAN_SELECTION_EXISTING_EMAIL="..."
$env:PLAN_SELECTION_EXISTING_PASSWORD="..."
$env:PLAN_SELECTION_EXISTING_MOBILE="..."
```

Fresh-user/full mode:

```powershell
$env:PLAN_SELECTION_VALIDATION_ENABLED="true"
$env:PLAN_SELECTION_FREE_ACTIVATION_ENABLED="true"
```

Commands:

```powershell
npm run test:controlled:plan-selection -- --headed
npm run test:controlled:stripe-overlay -- --headed
```

Readiness:

- [ ] Prepared plan-selection user exists for read-only catalog/modal checks.
- [ ] Registration SMS OTP is reliable for fresh-user activation checks.
- [ ] Trial accounts can be created without affecting shared accounts.
- [ ] Stripe sandbox card details are available for with-card flow.

## 5. Stripe Payment Negative

Purpose:

- Incomplete card
- Expired card
- Invalid CVC
- Declined card

Why controlled:

- Requires a fresh Stripe Checkout URL.

Required data:

```powershell
$env:STRIPE_CHECKOUT_URL="https://checkout.stripe.com/c/pay/..."
```

Command:

```powershell
npm run test:controlled:payment -- --headed
```

Readiness:

- [ ] Fresh checkout URL is available.
- [ ] URL opens Stripe sandbox checkout.
- [ ] URL is not expired before execution starts.

## 6. Permission / RBAC

Purpose:

- Allowed user can access permitted functionality.
- Restricted user cannot access protected functionality.

Why controlled:

- Requires two role-specific users prepared by admin.

Required data:

```powershell
$env:ADMIN_EMAIL="admin@ooltool.com"
$env:ADMIN_PASSWORD="Admin@1234!"
$env:PERMISSION_TEST_ENABLED="true"
$env:PERMISSION_ALLOWED_EMAIL="..."
$env:PERMISSION_ALLOWED_PASSWORD="..."
$env:PERMISSION_RESTRICTED_EMAIL="..."
$env:PERMISSION_RESTRICTED_PASSWORD="..."
```

Command:

```powershell
npm run test:controlled:permissions -- --headed
```

Readiness:

- [ ] Admin can prepare or verify the allowed/restricted user roles.
- [ ] Allowed user role is configured.
- [ ] Restricted user role is configured.
- [ ] Expected allowed/restricted routes are confirmed.

## 7. Auth Configuration Limits

Purpose:

- Login lockout after configured failed attempts
- Password-reset rate limit

Why controlled:

- Intentionally triggers lockout and rate limits.
- Can temporarily affect test accounts.

Required data:

```powershell
$env:AUTH_CONFIGURATION_LIMITS_ENABLED="true"
$env:AUTH_LOCKOUT_LIMIT_VALIDATION_ENABLED="true"
$env:AUTH_PASSWORD_RESET_RATE_LIMIT_VALIDATION_ENABLED="true"
$env:AUTH_LOCKOUT_EMAIL="..."
$env:AUTH_LOCKOUT_PASSWORD="..."
$env:AUTH_RATE_LIMIT_EMAIL="..."
```

Command:

```powershell
npm run test:controlled:auth-limits -- --headed
```

Readiness:

- [ ] Dedicated lockout account exists.
- [ ] Account can be unlocked after test.
- [ ] Rate-limit windows are acceptable for test execution.

## Recommended Order

1. Plan Selection read-only with prepared user
2. Reset Password negative with fresh `RESET_URL`
3. Forgot Password manual link flow
4. Unlock Account manual link flow
5. MFA backup code login
6. MFA trusted device with `MFA_LOCAL_TOTP_SECRET`
7. Permission/RBAC users
8. Stripe checkout negative
9. Auth lockout/rate-limit

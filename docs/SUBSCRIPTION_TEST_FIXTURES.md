# Subscription Test Fixture Users

## Purpose

This document defines the dedicated subscription users needed to safely expand
Stripe and subscription lifecycle automation.

The goal is to maximize coverage while avoiding accidental mutation of shared
accounts. Each fixture user should represent one known billing state and should
be used only for the scenarios assigned to that state.

## Naming Convention

Use scenario-specific Gmail aliases:

```text
imhardikthanki+sub-<scenario-name>@gmail.com
```

Examples:

```text
imhardikthanki+sub-plan-ready@gmail.com
imhardikthanki+sub-income-monthly@gmail.com
imhardikthanki+sub-overlay-trial-card@gmail.com
```

Do not hardcode passwords in test files. Store fixture credentials in local
environment variables only.

## Fixture Strategy

| Fixture Key | Suggested Email | Required State | Used For | Safe By Default |
| --- | --- | --- | --- | --- |
| `PLAN_SELECTION_READY` | `imhardikthanki+sub-plan-ready@gmail.com` | Email/mobile verified, Risk Profile complete, Compliance complete, waiting on Choose Your Plan | Plan catalog, pricing, trial CTA, complete-setup guardrails | Yes |
| `TRIAL_NO_CARD_ACTIVE` | `imhardikthanki+sub-trial-no-card@gmail.com` | Overlay Strategists trial active without card | No-card trial billing state, plan access, trial messaging | Yes |
| `TRIAL_WITH_CARD_ACTIVE` | `imhardikthanki+sub-trial-card@gmail.com` | Overlay Strategists trial active with saved Stripe test card | Card-backed trial, auto-renew messaging, payment-method display | Yes, read-only |
| `TRIAL_USED_EMAIL` | `imhardikthanki+sub-trial-used-email@gmail.com` | User has already consumed Overlay Strategists trial | Trial once-per-email validation | Yes |
| `TRIAL_USED_MOBILE` | `imhardikthanki+sub-trial-used-mobile@gmail.com` | User has already consumed trial with a known mobile number | Trial once-per-mobile validation | Yes |
| `INCOME_MONTHLY_ACTIVE` | `imhardikthanki+sub-income-monthly@gmail.com` | Income Builder monthly subscription active | Upgrade from lower tier, billing overview, invoice history | Yes, read-only |
| `INCOME_ANNUAL_ACTIVE` | `imhardikthanki+sub-income-annual@gmail.com` | Income Builder annual subscription active | Annual-to-monthly change, billing interval presentation | Yes, read-only |
| `OVERLAY_MONTHLY_ACTIVE` | `imhardikthanki+sub-overlay-monthly@gmail.com` | Overlay Strategists monthly subscription active | Upgrade/downgrade rules and billing portal validation | Yes, read-only |
| `OVERLAY_ANNUAL_ACTIVE` | `imhardikthanki+sub-overlay-annual@gmail.com` | Overlay Strategists annual subscription active | Annual interval behavior and downgrade scheduling | Yes, read-only |
| `PORTFOLIO_MONTHLY_ACTIVE` | `imhardikthanki+sub-portfolio-monthly@gmail.com` | Portfolio Hedger monthly subscription active | Downgrade to lower plan, upgrade to Marketplace | Yes, read-only |
| `PORTFOLIO_ANNUAL_ACTIVE` | `imhardikthanki+sub-portfolio-annual@gmail.com` | Portfolio Hedger annual subscription active | Annual downgrade and annual-to-monthly scenarios | Yes, read-only |
| `MARKETPLACE_MONTHLY_ACTIVE` | `imhardikthanki+sub-marketplace-monthly@gmail.com` | Marketplace monthly subscription active | Highest-tier downgrade validation | Yes, read-only |
| `MARKETPLACE_ANNUAL_ACTIVE` | `imhardikthanki+sub-marketplace-annual@gmail.com` | Marketplace annual subscription active | Highest-tier annual downgrade validation | Yes, read-only |
| `CANCEL_FORM_READY` | `imhardikthanki+sub-cancel-form@gmail.com` | Active paid subscription; cancellation form can be opened but not submitted | Cancellation reason and feedback validation | Yes |
| `CANCEL_SCHEDULED` | `imhardikthanki+sub-cancel-scheduled@gmail.com` | Subscription already scheduled to cancel at period end | Scheduled cancellation state and access-until-expiry validation | Yes, read-only |
| `IMMEDIATE_CANCEL_REFUND_READY` | `imhardikthanki+sub-refund-ready@gmail.com` | Disposable paid subscription approved for destructive cancellation/refund | Immediate cancel, refund amount, refund history | No |
| `PAST_DUE_DUNNING` | `imhardikthanki+sub-past-due@gmail.com` | Subscription in failed-payment or past-due state | Dunning, payment recovery, grace-period behavior | Yes, read-only |
| `RENEWAL_READY` | `imhardikthanki+sub-renewal-ready@gmail.com` | Subscription close to renewal or controlled by time-travel/scheduler | Auto-renewal, renewal invoice, renewal notifications | No without scheduler control |
| `EXPIRED_TRIAL_NO_CARD` | `imhardikthanki+sub-expired-no-card@gmail.com` | No-card trial expired and moved to Free plan | Expiry downgrade, paid-feature removal, upgrade prompt | Yes, read-only |
| `EXPIRED_TRIAL_WITH_CARD` | `imhardikthanki+sub-expired-card@gmail.com` | Card-backed trial expired and converted to paid subscription | Trial conversion, automatic billing, renewal evidence | Yes, read-only |

## Environment Variables

Use local PowerShell variables when running controlled tests.

```powershell
$env:SUBSCRIPTION_FIXTURE_PASSWORD="PASTE_TEST_PASSWORD"

$env:PLAN_SELECTION_EXISTING_EMAIL="imhardikthanki+sub-plan-ready@gmail.com"
$env:PLAN_SELECTION_EXISTING_PASSWORD=$env:SUBSCRIPTION_FIXTURE_PASSWORD

$env:BILLING_MANAGEMENT_EMAIL="imhardikthanki+sub-income-monthly@gmail.com"
$env:BILLING_MANAGEMENT_PASSWORD=$env:SUBSCRIPTION_FIXTURE_PASSWORD
```

Controlled lifecycle execution uses these flags:

```powershell
$env:SUBSCRIPTION_LIFECYCLE_EXECUTION_ENABLED="true"

# Turn on only the slice being validated.
$env:SUB_LIFECYCLE_TRIAL_WITHOUT_CARD_ENABLED="true"
$env:SUB_LIFECYCLE_TRIAL_WITH_CARD_ENABLED="true"
$env:SUB_LIFECYCLE_INCOME_MONTHLY_ENABLED="true"
$env:SUB_LIFECYCLE_PLAN_CONTROLS_ENABLED="true"
$env:SUB_LIFECYCLE_CANCEL_FORM_ENABLED="true"

# Prepared paid-user slices:
$env:SUB_LIFECYCLE_PAID_EMAIL="imhardikthanki+sub-income-monthly@gmail.com"
$env:SUB_LIFECYCLE_PAID_PASSWORD=$env:SUBSCRIPTION_FIXTURE_PASSWORD
```

## Use Case 1 Trial Execution Commands

Run the no-card Overlay Strategists trial first. This creates a disposable user,
starts the trial without Stripe Checkout, confirms the user reaches the
dashboard, and validates Billing shows Overlay Strategists trial context.

```powershell
$env:SUBSCRIPTION_LIFECYCLE_EXECUTION_ENABLED="true"
$env:SUB_LIFECYCLE_TRIAL_WITHOUT_CARD_ENABLED="true"
$env:SUB_LIFECYCLE_TRIAL_WITH_CARD_ENABLED="false"

npm run test:controlled:subscription-lifecycle-execution -- --headed -g "without card"
```

Run the with-card Overlay Strategists trial second. This creates a disposable
user, validates Stripe Checkout trial details, submits the Stripe test card, and
validates Billing shows Overlay Strategists trial plus saved payment method
evidence.

```powershell
$env:SUBSCRIPTION_LIFECYCLE_EXECUTION_ENABLED="true"
$env:SUB_LIFECYCLE_TRIAL_WITHOUT_CARD_ENABLED="false"
$env:SUB_LIFECYCLE_TRIAL_WITH_CARD_ENABLED="true"

npm run test:controlled:subscription-lifecycle-execution -- --headed -g "with card"
```

Generate AIR from the latest run:

```powershell
$env:AIR_REPORT_SCOPE="latest"
npm run report:execution
```

Future fixture-specific variables can follow this pattern:

```powershell
$env:SUB_FIXTURE_INCOME_MONTHLY_EMAIL="imhardikthanki+sub-income-monthly@gmail.com"
$env:SUB_FIXTURE_OVERLAY_TRIAL_CARD_EMAIL="imhardikthanki+sub-trial-card@gmail.com"
$env:SUB_FIXTURE_CANCEL_SCHEDULED_EMAIL="imhardikthanki+sub-cancel-scheduled@gmail.com"
```

## Fixture Creation Checklist

For every fixture user, record:

- Email address.
- Password stored locally, not committed.
- Mobile number used.
- Current plan.
- Billing interval: monthly or annual.
- Trial type: none, no-card, or with-card.
- Subscription status: active, trialing, scheduled cancellation, past due,
  expired, or cancelled.
- Stripe customer ID if available.
- Stripe subscription ID if available.
- Next billing date or trial end date.
- Whether the account is safe for destructive testing.
- Which automated test owns the account.

## Destructive Test Rules

The following scenarios must never run against shared accounts:

- Final cancellation.
- Immediate cancellation.
- Refund submission.
- Real upgrade payment.
- Real downgrade confirmation.
- Billing interval change confirmation.
- Renewal or expiry simulation without scheduler/time-control support.

Only run destructive lifecycle tests when:

1. The account is disposable.
2. The scenario is explicitly enabled by env flag.
3. Stripe/admin state can be validated.
4. The expected cleanup or final account state is documented.

## Current Known Product Issues

- With-card Overlay Strategists trial activation succeeds, but Billing may still
  show Free Plan and may not display saved card details. Expected behavior:
  Billing should show active Free Trial with associated payment method.
- No-card trial broker integration limit needs clarification because current
  product behavior counts manual entry as broker integration.
- FRD no-card trial linked-account limit needs business confirmation because the
  paid Overlay Strategists UI displays Account Linked (10), while the FRD notes
  a lower no-card trial limit.

## What These Fixtures Unlock

Dedicated users allow automation to safely validate:

- Trial once-per-user rules.
- With-card and without-card trial state.
- Paid plan billing overview.
- Upgrade and downgrade eligibility.
- Monthly-to-annual and annual-to-monthly behavior.
- Cancel-at-period-end state.
- Expiry behavior.
- Renewal and notification behavior.
- Dunning and payment recovery.
- Refund visibility and transaction history.

They also make AIR clearer because blocked/skipped lifecycle rows can reference
real missing fixture state instead of generic dependency notes.

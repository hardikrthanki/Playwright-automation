# Subscription And Stripe Coverage Matrix

This matrix maps the Subscription Management test cases to automation status.
The pasted Stripe matrix is the source of truth for subscription coverage.
Browser-safe validations are automated first; lifecycle validations that require
Stripe/admin state, billing time travel, scheduler jobs, broker fixtures, or
audit-log access remain documented until those controls are available.

## Current Inputs

- Source FRD: `OOLTool_Subscription_FRD_Detailed.docx`
- Source test plan: `Test Plan_stripe.docx`
- Source test matrix: pasted Subscription Management test cases
- Environment: PUAT Stripe test mode
- User strategy: create a new user for every safe trial/purchase run
- Email validation: manual or deferred until mailbox automation is confirmed
- Stripe/Admin dashboard access: not available

## Automation Status Legend

| Status | Meaning |
| --- | --- |
| Ready | Can be automated with current UI and test data |
| Started | Initial automation added, may need selector confirmation |
| Blocked | Needs admin, Stripe, database, scheduler, broker, or time-control access |
| Manual | Better handled as manual validation until access is available |
| Future | Valid scenario, but not part of the first automation slice |

## Full FRD Coverage By Use Case

| Use Case | Scenario Range | Current Automation | Status | Dependency For Full Coverage |
| --- | --- | --- | --- | --- |
| Overlay Strategists Trial Experience | SC 1-35 | Trial availability, with-card checkout, without-card trial, terms guardrail, missing-card validation | Started | Email handoff, Stripe/admin validation, scheduler/time travel, broker fixtures |
| New Subscription Purchase | SC 36-75 | Income Builder purchase through onboarding, Stripe successful checkout, selected plan checkout, invoice/PDF evidence, declined-card checkout validation | Started | Dedicated plan fixtures, Stripe ledger/API, duplicate checkout session visibility |
| Upgrade Subscription | SC 76-112 | Plan action/status controls are detected without changing subscription | Future | Dedicated lower-tier paid account, Stripe checkout/payment fixture, proration visibility |
| Downgrade Subscription | SC 113-164 | Plan action/status controls are detected without changing subscription | Future | Dedicated higher-tier paid account, downgrade confirmation UI, data-limit fixture |
| Monthly To Annual Billing Change | SC 165-200 | Monthly/annual plan toggle and billing frequency presentation are validated | Started | Dedicated monthly paid account, Stripe proration checkout, invoice validation |
| Annual To Monthly Billing Change | SC 201-240 | Annual/monthly plan presentation is validated | Future | Dedicated annual paid account, scheduled-change UI, renewal-date fixture |
| Subscription Cancellation | SC 241-300 | Stripe portal cancellation form, reason, feedback, and already-scheduled cancellation state are validated without final cancellation | Started | Dedicated cancellable account, destructive cancellation approval, refund/admin workflow |
| Failed Payment And Dunning Management | SC 301-352 | Declined-card checkout validation is automated from a fresh Stripe checkout URL | Started | Stripe dunning configuration, failed renewal fixture, scheduler/webhook/admin access |

## Automation Boundary

The current automation can safely validate browser behavior, page content,
checkout validation, portal access, invoices, and non-destructive forms. It
should not validate final cancellation, real upgrade/downgrade submission, trial
expiry, retry schedules, refunds, audit logs, or data deletion until dedicated
test accounts and backend controls are available.

## Use Case 1 - Overlay Strategists Trial Experience

| SC | Scenario | Priority | Automation Status | Blocker / Dependency | Notes |
| --- | --- | --- | --- | --- | --- |
| 1 | Start trial without payment details | Critical | Started | Manual email verification | Controlled without-card activation test validates dashboard redirect and Overlay Strategists in Billing |
| 2 | Trial is displayed as available | High | Started | Manual email verification | `OverlayStrategistsTrial.spec.ts` validates both with-card and without-card trial CTAs after onboarding prerequisites |
| 3 | Broker account limit is one | Critical | Blocked | Broker test integration/data | Requires broker connection automation |
| 4 | Linked account limit is five | Critical | Blocked | Broker linked account data | Requires connected broker fixture |
| 5 | Portfolio position limit is 100 | Critical | Blocked | Portfolio import fixture | Requires broker or portfolio seed data |
| 6 | Premium Overlay Strategists features available | High | Future | Need feature list and selectors | Can follow after trial activation automation |
| 7 | Start trial with valid card | Critical | Started | Manual email verification and Stripe test checkout | Controlled with-card checkout test added behind `OVERLAY_STRATEGISTS_WITH_CARD_ENABLED` |
| 8 | No subscription charge during trial | Critical | Blocked | Stripe/Admin access | Cannot verify payment ledger without Stripe/API access |
| 9 | Card information securely saved | High | Blocked | Stripe/customer payment method access | Need backend/admin/API validation |
| 10 | Existing paid subscriber cannot start trial | Critical | Future | Existing paid account fixture | Can use subscriber account if trial CTA is visible |
| 11 | Same email cannot receive another trial | Critical | Future | Repeat-trial fixture | Needs deterministic previously-used account |
| 12 | Same phone cannot receive another trial | Critical | Future | Repeat phone fixture | Need safe duplicate-phone data |
| 13 | Same payment method cannot receive another trial | Critical | Blocked | Stripe payment method reuse visibility | Need Stripe/API confirmation |
| 14 | Trial lasts exactly 30 days | Critical | Blocked | Time travel/scheduler/admin controls | Cannot wait 30 real days in automation |
| 15 | Day 25 reminder no-card | Medium | Blocked | Scheduler/time control and email access | Manual until scheduler hooks exist |
| 16 | Day 28 reminder no-card | Medium | Blocked | Scheduler/time control and email access | Manual until scheduler hooks exist |
| 17 | Day 29 final reminder no-card | Medium | Blocked | Scheduler/time control and email access | Manual until scheduler hooks exist |
| 18 | Day 29 reminder with card | Medium | Blocked | Scheduler/time control and email access | Manual until scheduler hooks exist |
| 19 | No-card trial downgrades to Free | Critical | Blocked | Trial expiry/time control | Needs admin or API time control |
| 20 | Broker integrations disconnected after expiry | Critical | Blocked | Trial expiry + broker data | Needs broker fixture and scheduler |
| 21 | Imported positions deleted after expiry | Critical | Blocked | Trial expiry + portfolio fixture | Needs data seed and DB/admin validation |
| 22 | Premium features unavailable after expiry | Critical | Blocked | Trial expiry/time control | Needs expired trial fixture |
| 23 | Subscribe prompt after expiry | Medium | Blocked | Trial expiry/time control | Needs expired trial fixture |
| 24 | With-card trial converts to paid | Critical | Blocked | Trial expiry + Stripe validation | Needs scheduler and Stripe/API access |
| 25 | Billing starts automatically | Critical | Blocked | Stripe/Admin access | Needs Stripe/API validation |
| 26 | Upgrade before trial ends | Critical | Future | Active trial fixture | Automate after basic trial activation |
| 27 | Billing cycle resets after upgrade | High | Blocked | Stripe/Admin access | Needs billing date validation source |
| 28 | Failed payment enters grace period | Critical | Blocked | Trial expiry + declined card at renewal | Needs scheduler and Stripe test control |
| 29 | Failed billing reminder | High | Blocked | Email/in-app notification access | Needs notification validation strategy |
| 30 | Cannot remove only payment method during trial | Medium | Future | Active card-trial fixture | Needs payment method management UI |
| 31 | Terms must be accepted | Critical | Started | Manual email verification | Controlled terms-required validation added behind `OVERLAY_STRATEGISTS_TERMS_ENABLED` |
| 32 | Communication preference selection | Low | Future | Confirm UI placement | Low priority |
| 33 | Trial activation audit log | Medium | Blocked | Admin/audit access | Needs admin/API/DB validation |
| 34 | Trial conversion audit log | Medium | Blocked | Admin/audit access | Needs admin/API/DB validation |
| 35 | Reminder analytics tracked | Low | Blocked | Analytics/admin access | Needs analytics validation source |

## Use Case 2 - New Subscription Purchase

| SC | Scenario Group | Automation Status | Current Coverage | Gap / Dependency |
| --- | --- | --- | --- | --- |
| 36-40 | New paid subscription purchase | Started | `onboarding.spec.ts` completes Income Builder Stripe checkout; Overlay with-card trial checkout is controlled | Other plans need dedicated fresh users and safe Stripe runs |
| 41-44 | Purchase entry points | Future | Onboarding plan-selection entry point covered | Pricing, expiry, upgrade prompt, and settings entry points need selectors/fixtures |
| 45-49 | Subscription summary before payment | Started | Stripe checkout loads selected plan/payment page and plan-selection toggle is validated | Exact renewal/auto-renew summary needs stable Stripe copy expectations |
| 50-51 | Terms acceptance | Started | Overlay trial terms guardrail is automated | Paid plan terms guardrail needs confirmation if separate modal exists |
| 52-56 | Successful payment activation and invoice | Started | Checkout success, dashboard redirect, billing invoice/PDF links, and portal invoice history are automated | Email receipt needs mailbox strategy |
| 57-62 | Payment failure and retry | Started | Declined-card checkout validation is automated with `PaymentNegative.spec.ts` | Retry from same/different method needs a fresh checkout recovery fixture |
| 63-66 | Auto-renew and reminders | Blocked | Portal can show current subscription details | Renewal reminders require scheduler/time travel/email validation |
| 67-72 | Cancellation/audit logging | Started | Non-destructive portal cancellation form/state is automated | Final cancellation and audit logging require controlled admin access |
| 73-75 | Duplicate/expired checkout protection | Future | Missing-card and declined-card checkout validation exist | Duplicate checkout/session expiry need backend/session observability |

## Use Cases 3-8 - Lifecycle Coverage Strategy

| Use Case | Browser-Safe Tests To Add Next | Blocked Until |
| --- | --- | --- |
| Upgrade Subscription | Verify eligible upgrade controls, current/new plan labels, checkout opens, failed checkout leaves current plan unchanged | Dedicated lower-tier accounts and Stripe proration visibility |
| Downgrade Subscription | Verify eligible downgrade controls, lost-feature warnings, acknowledgement guardrail, scheduled-change messaging | Dedicated higher-tier accounts and data-limit fixtures |
| Monthly To Annual | Verify annual option, current/new frequency labels, checkout opens, failed checkout leaves monthly plan unchanged | Dedicated monthly accounts and Stripe proration validation |
| Annual To Monthly | Verify monthly option, effective-date messaging, no-refund/no-credit copy, pending-change visibility | Dedicated annual accounts and renewal-date fixtures |
| Subscription Cancellation | Verify current plan details, impact copy, reason/feedback form, go-back safety, already-cancelled state | Dedicated destructive cancellation account and refund/admin workflow |
| Dunning Management | Verify failed-card error, update-payment-method screen, outstanding invoice page if exposed | Stripe dunning test fixture, webhook/scheduler/admin controls |

## First Automation Slice

1. Validate Overlay Strategists trial option is shown to a newly onboarded user.
2. Confirm the trial CTA and terms UI from a headed run.
3. Add no-card trial activation once the CTA selectors are confirmed.
4. Add terms-required negative validation.
5. Add with-card trial validation by reusing `StripePaymentPage`.
6. Add Stripe missing-card validation for Overlay Strategists with-card checkout.

## Current Command

```powershell
$env:OVERLAY_STRATEGISTS_FLOW_ENABLED="true"
npx playwright test tests/OverlayStrategistsTrial.spec.ts --headed
```

Run the with-card trial checkout:

```powershell
$env:OVERLAY_STRATEGISTS_FLOW_ENABLED="true"
$env:OVERLAY_STRATEGISTS_WITH_CARD_ENABLED="true"
npx playwright test tests/OverlayStrategistsTrial.spec.ts -g "with card" --headed
$env:AIR_ALLOW_STALE_REPORT="true"
npm run report:execution
```

Run the without-card trial:

```powershell
$env:OVERLAY_STRATEGISTS_FLOW_ENABLED="true"
$env:OVERLAY_STRATEGISTS_WITHOUT_CARD_ENABLED="true"
npx playwright test tests/OverlayStrategistsTrial.spec.ts -g "without card" --headed
$env:AIR_ALLOW_STALE_REPORT="true"
npm run report:execution
```

Run the with-card missing-card negative validation:

```powershell
$env:OVERLAY_STRATEGISTS_FLOW_ENABLED="true"
$env:OVERLAY_STRATEGISTS_STRIPE_NEGATIVE_ENABLED="true"
npx playwright test tests/OverlayStrategistsTrial.spec.ts -g "missing Stripe card" --headed
$env:AIR_ALLOW_STALE_REPORT="true"
npm run report:execution
```

Run generic Stripe Checkout negative validation with a fresh checkout URL:

```powershell
$env:STRIPE_CHECKOUT_URL="https://checkout.stripe.com/c/pay/PASTE_FRESH_SESSION"
npx playwright test tests/PaymentNegative.spec.ts --headed
$env:AIR_REPORT_SCOPE="latest"
npm run report:execution
```

Run subscription portal validations with a prepared paid account:

```powershell
$env:BILLING_SUBSCRIPTION_MANAGEMENT_ENABLED="true"
$env:BILLING_MANAGEMENT_EMAIL="imhardikthanki+completejourney@gmail.com"
$env:BILLING_MANAGEMENT_PASSWORD="H@rdik9944"
npm run test:controlled:billing-management -- --headed
$env:AIR_REPORT_SCOPE="latest"
npm run report:execution
```

Optional stricter portal expectations:

```powershell
$env:BILLING_EXPECTED_PLAN="3-Advanced"
$env:BILLING_EXPECTED_FREQUENCY="per year"
$env:BILLING_EXPECTED_CARD_LAST4="4242"
```

The test is intentionally skipped unless `OVERLAY_STRATEGISTS_FLOW_ENABLED` is
enabled, so the stable suite remains unchanged.

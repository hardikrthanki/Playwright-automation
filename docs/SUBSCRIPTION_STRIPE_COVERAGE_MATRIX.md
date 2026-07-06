# Subscription And Stripe Coverage Matrix

This matrix maps the Subscription Management test cases to automation status.
The first implementation focus is **Use Case 1: Overlay Strategists Trial
Experience**, as requested.

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
| 36 | With-card checkout blocks missing card details | High | Started | Manual email verification and Stripe test checkout | Controlled Stripe negative validation added behind `OVERLAY_STRATEGISTS_STRIPE_NEGATIVE_ENABLED` |

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

The test is intentionally skipped unless `OVERLAY_STRATEGISTS_FLOW_ENABLED` is
enabled, so the stable suite remains unchanged.

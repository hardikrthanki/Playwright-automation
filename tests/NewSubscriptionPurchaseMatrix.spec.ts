import {
  test
} from '@playwright/test';

test.use({
  screenshot: 'off',
  trace: 'off',
  video: 'off'
});

/* =============================================================================
TEST SUITE: New Subscription Purchase Matrix

PURPOSE
-------
Documents Subscription Management Use Case 2 scenarios in executable Playwright
form. Source of truth: OOLTool_Subscription_FRD_Detailed (1).docx. Rows are
intentionally skipped so AIR can report automated, blocked, and future coverage
with clear reasons while avoiding unsafe Stripe/customer changes.

RUN
---
npx playwright test tests/NewSubscriptionPurchaseMatrix.spec.ts
============================================================================= */

type SubscriptionScenario = {
  id: string;
  sourceIds: string[];
  title: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  status: 'automated' | 'blocked' | 'future' | 'controlled';
  automation?: string;
  dependency?: string;
};

const useCaseTwoScenarios: SubscriptionScenario[] = [
  {
    id: 'SC-36',
    sourceIds: ['SUB-NEW-001'],
    title: 'New user can purchase Income Builder monthly subscription during onboarding',
    priority: 'Critical',
    status: 'automated',
    automation: 'onboarding.spec.ts > Income Builder Stripe checkout payment completion'
  },
  {
    id: 'SC-37',
    sourceIds: ['SUB-NEW-002'],
    title: 'Income Builder monthly checkout shows selected plan before payment',
    priority: 'Critical',
    status: 'automated',
    automation: 'DirectSubscriptionPurchase.spec.ts > Income Builder monthly checkout shows subscription summary before payment'
  },
  {
    id: 'SC-38',
    sourceIds: ['SUB-NEW-003'],
    title: 'Portfolio Hedger annual checkout shows selected plan before payment',
    priority: 'Critical',
    status: 'automated',
    automation: 'DirectSubscriptionPurchase.spec.ts > Portfolio Hedger annual checkout shows subscription summary before payment'
  },
  {
    id: 'SC-39',
    sourceIds: ['SUB-NEW-004'],
    title: 'Marketplace monthly checkout shows selected plan before payment',
    priority: 'Critical',
    status: 'automated',
    automation: 'DirectSubscriptionPurchase.spec.ts > Marketplace monthly checkout shows subscription summary before payment'
  },
  {
    id: 'SC-40',
    sourceIds: ['SUB-NEW-005'],
    title: 'Annual paid checkout displays selected plan and billing interval before payment',
    priority: 'Critical',
    status: 'automated',
    automation: 'DirectSubscriptionPurchase.spec.ts > Income Builder annual and Portfolio Hedger annual checkout summaries before payment'
  },
  {
    id: 'SC-41',
    sourceIds: ['SUB-NEW-006'],
    title: 'Paid subscription can be started from onboarding plan selection',
    priority: 'Critical',
    status: 'automated',
    automation: 'PlanSelectionValidation.spec.ts > User can switch plan selections without launching Stripe checkout; onboarding.spec.ts and DirectSubscriptionPurchase.spec.ts'
  },
  {
    id: 'SC-42',
    sourceIds: ['SUB-NEW-007'],
    title: 'Paid subscription can be started from pricing entry point',
    priority: 'High',
    status: 'future',
    dependency: 'Requires confirmed pricing page route/selectors and reusable logged-in fixture.'
  },
  {
    id: 'SC-43',
    sourceIds: ['SUB-NEW-008'],
    title: 'Paid subscription can be started from expired trial upgrade prompt',
    priority: 'High',
    status: 'blocked',
    dependency: 'Requires expired-trial fixture or scheduler/API time control.'
  },
  {
    id: 'SC-44',
    sourceIds: ['SUB-NEW-009'],
    title: 'Paid subscription can be started from billing/settings plan action',
    priority: 'High',
    status: 'automated',
    automation: 'BillingSubscriptionManagement.spec.ts > Billing plans show plan action or status controls'
  },
  {
    id: 'SC-45',
    sourceIds: ['SUB-NEW-010'],
    title: 'Stripe checkout displays subscriber email',
    priority: 'High',
    status: 'automated',
    automation: 'DirectSubscriptionPurchase.spec.ts > validateSubscriptionCheckoutDetails'
  },
  {
    id: 'SC-46',
    sourceIds: ['SUB-NEW-011'],
    title: 'Stripe checkout displays selected plan name',
    priority: 'Critical',
    status: 'automated',
    automation: 'DirectSubscriptionPurchase.spec.ts > validateSubscriptionCheckoutDetails'
  },
  {
    id: 'SC-47',
    sourceIds: ['SUB-NEW-012'],
    title: 'Stripe checkout displays correct billing interval',
    priority: 'Critical',
    status: 'automated',
    automation: 'DirectSubscriptionPurchase.spec.ts > validateSubscriptionCheckoutDetails'
  },
  {
    id: 'SC-48',
    sourceIds: ['SUB-NEW-013'],
    title: 'Stripe checkout displays renewal or auto-renewal copy before payment',
    priority: 'High',
    status: 'controlled',
    automation: 'BlockedScenarioExecution.spec.ts > SC-48: Stripe checkout displays renewal or auto-renewal copy before payment',
    dependency: 'Requires BLOCKED_SCENARIO_EXECUTION_ENABLED=true and STRIPE_CHECKOUT_URL; copy expectation now asserted flexibly.'
  },
  {
    id: 'SC-49',
    sourceIds: ['SUB-NEW-014'],
    title: 'Stripe checkout exposes card number, expiry, CVC, country, and cardholder name fields',
    priority: 'High',
    status: 'automated',
    automation: 'DirectSubscriptionPurchase.spec.ts and PaymentNegative.spec.ts'
  },
  {
    id: 'SC-50',
    sourceIds: ['SUB-NEW-015'],
    title: 'Successful sandbox card payment activates subscription',
    priority: 'Critical',
    status: 'automated',
    automation: 'onboarding.spec.ts > Stripe checkout payment completion'
  },
  {
    id: 'SC-51',
    sourceIds: ['SUB-NEW-016'],
    title: 'Successful payment redirects user back to OOLTool dashboard',
    priority: 'Critical',
    status: 'automated',
    automation: 'onboarding.spec.ts and OverlayStrategistsTrial.spec.ts'
  },
  {
    id: 'SC-52',
    sourceIds: ['SUB-NEW-017'],
    title: 'Dashboard shows active subscription after successful purchase',
    priority: 'Critical',
    status: 'automated',
    automation: 'Subscriber.spec.ts and BillingDeep.spec.ts'
  },
  {
    id: 'SC-53',
    sourceIds: ['SUB-NEW-018'],
    title: 'Billing overview shows current paid plan and active status',
    priority: 'Critical',
    status: 'automated',
    automation: 'BillingDeep.spec.ts and BillingSubscriptionManagement.spec.ts'
  },
  {
    id: 'SC-54',
    sourceIds: ['SUB-NEW-019'],
    title: 'Transaction history records successful paid invoice',
    priority: 'High',
    status: 'automated',
    automation: 'Subscriber.spec.ts > Transactions tab paid status'
  },
  {
    id: 'SC-55',
    sourceIds: ['SUB-NEW-020'],
    title: 'Invoice details page opens after successful purchase',
    priority: 'High',
    status: 'automated',
    automation: 'Subscriber.spec.ts > Invoice page opens successfully'
  },
  {
    id: 'SC-56',
    sourceIds: ['SUB-NEW-021'],
    title: 'Invoice PDF link is available after successful purchase',
    priority: 'High',
    status: 'automated',
    automation: 'Subscriber.spec.ts > Invoice PDF link is available and opens'
  },
  {
    id: 'SC-57',
    sourceIds: ['SUB-NEW-022'],
    title: 'Incomplete card number is blocked in Stripe checkout',
    priority: 'Critical',
    status: 'automated',
    automation: 'PaymentNegative.spec.ts > Stripe Checkout blocks incomplete card number'
  },
  {
    id: 'SC-58',
    sourceIds: ['SUB-NEW-023'],
    title: 'Expired card date is blocked in Stripe checkout',
    priority: 'Critical',
    status: 'automated',
    automation: 'PaymentNegative.spec.ts > Stripe Checkout blocks expired card date'
  },
  {
    id: 'SC-59',
    sourceIds: ['SUB-NEW-024'],
    title: 'Invalid CVC is blocked in Stripe checkout',
    priority: 'Critical',
    status: 'automated',
    automation: 'PaymentNegative.spec.ts > Stripe Checkout blocks invalid CVC'
  },
  {
    id: 'SC-60',
    sourceIds: ['SUB-NEW-025'],
    title: 'Declined card does not activate subscription',
    priority: 'Critical',
    status: 'automated',
    automation: 'PaymentNegative.spec.ts and OverlayStrategistsTrial.spec.ts'
  },
  {
    id: 'SC-61',
    sourceIds: ['SUB-NEW-026'],
    title: 'Missing cardholder name is blocked before subscription activation',
    priority: 'Medium',
    status: 'controlled',
    automation: 'BlockedScenarioExecution.spec.ts > SC-61: Missing cardholder name is blocked before subscription activation',
    dependency: 'Requires BLOCKED_SCENARIO_EXECUTION_ENABLED=true and STRIPE_CHECKOUT_URL; validation asserted flexibly (blocked-state OR error copy).'
  },
  {
    id: 'SC-62',
    sourceIds: ['SUB-NEW-027'],
    title: 'Failed checkout keeps user without active paid subscription',
    priority: 'Critical',
    status: 'controlled',
    automation: 'BlockedScenarioExecution.spec.ts > SC-62: Failed checkout keeps user without active paid subscription',
    dependency: 'Requires BLOCKED_SCENARIO_EXECUTION_ENABLED=true and STRIPE_CHECKOUT_URL; UI-level validation (no success/activation copy after decline).'
  },
  {
    id: 'SC-63',
    sourceIds: ['SUB-NEW-028'],
    title: 'Closing Stripe checkout returns user safely without activating subscription',
    priority: 'High',
    status: 'controlled',
    automation: 'BlockedScenarioExecution.spec.ts > SC-63: Closing Stripe checkout returns user safely without activating subscription',
    dependency: 'Requires BLOCKED_SCENARIO_EXECUTION_ENABLED=true, STRIPE_CHECKOUT_URL, and a checkout link exposing a cancel/return control.'
  },
  {
    id: 'SC-64',
    sourceIds: ['SUB-NEW-029'],
    title: 'Payment currency and conversion details are displayed correctly',
    priority: 'Medium',
    status: 'automated',
    automation: 'DirectSubscriptionPurchase.spec.ts > Income Builder checkout shows currency and conversion details before payment'
  },
  {
    id: 'SC-65',
    sourceIds: ['SUB-NEW-030'],
    title: 'Successful subscription confirmation email is sent',
    priority: 'Medium',
    status: 'blocked',
    dependency: 'Requires email inbox/API access or notification capture.'
  },
  {
    id: 'SC-66',
    sourceIds: ['SUB-NEW-031'],
    title: 'Successful purchase creates Stripe customer and subscription records',
    priority: 'High',
    status: 'blocked',
    dependency: 'Requires Stripe sandbox API/admin access to validate customer/subscription objects.'
  },
  {
    id: 'SC-67',
    sourceIds: ['SUB-NEW-032'],
    title: 'Manage subscription portal opens for newly purchased subscription',
    priority: 'High',
    status: 'automated',
    automation: 'BillingSubscriptionManagement.spec.ts > Manage subscription opens Stripe portal with subscription details'
  },
  {
    id: 'SC-68',
    sourceIds: ['SUB-NEW-033'],
    title: 'Stripe portal shows current subscription and payment method',
    priority: 'High',
    status: 'automated',
    automation: 'BillingSubscriptionManagement.spec.ts > validateSubscriptionPortalOverview'
  },
  {
    id: 'SC-69',
    sourceIds: ['SUB-NEW-034'],
    title: 'Stripe portal invoice history is available',
    priority: 'High',
    status: 'automated',
    automation: 'BillingSubscriptionManagement.spec.ts > validateSubscriptionPortalInvoiceHistory'
  },
  {
    id: 'SC-70',
    sourceIds: ['SUB-NEW-035'],
    title: 'Stripe portal return link navigates back to OOLTool',
    priority: 'Medium',
    status: 'automated',
    automation: 'BillingSubscriptionManagement.spec.ts > validateSubscriptionPortalReturnToApplication'
  },
  {
    id: 'SC-71',
    sourceIds: ['SUB-NEW-036'],
    title: 'Cancel subscription form accepts reason and feedback without final cancellation',
    priority: 'High',
    status: 'automated',
    automation: 'BillingSubscriptionManagement.spec.ts > Cancel subscription form accepts reason and feedback without cancelling'
  },
  {
    id: 'SC-72',
    sourceIds: ['SUB-NEW-037'],
    title: 'Subscription purchase audit log is created',
    priority: 'Medium',
    status: 'blocked',
    dependency: 'Requires admin/API/DB access to audit log records.'
  },
  {
    id: 'SC-73',
    sourceIds: ['SUB-NEW-038'],
    title: 'Duplicate checkout session cannot create duplicate paid subscriptions',
    priority: 'Critical',
    status: 'blocked',
    dependency: 'Requires backend/API visibility into checkout session idempotency and subscription count.'
  },
  {
    id: 'SC-74',
    sourceIds: ['SUB-NEW-039'],
    title: 'Expired checkout session cannot activate subscription',
    priority: 'Critical',
    status: 'blocked',
    dependency: 'Requires expired checkout-session fixture or Stripe/API session control.'
  },
  {
    id: 'SC-75',
    sourceIds: ['SUB-NEW-040'],
    title: 'Retry after failed payment starts a clean checkout session',
    priority: 'High',
    status: 'future',
    dependency: 'Requires failed-payment fixture plus clean retry/session validation.'
  },
  {
    id: 'SC-75A',
    sourceIds: ['SUB-NEW-041'],
    title: 'Terms and subscription terms must be accepted before paid checkout starts',
    priority: 'Critical',
    status: 'automated',
    automation: 'PlanSelectionValidation.spec.ts and OverlayStrategistsTrial.spec.ts'
  },
  {
    id: 'SC-75B',
    sourceIds: ['SUB-NEW-042'],
    title: 'Double-clicking purchase does not create duplicate checkout sessions',
    priority: 'Critical',
    status: 'blocked',
    dependency: 'Requires backend/API visibility into checkout session creation and idempotency keys.'
  },
  {
    id: 'SC-75C',
    sourceIds: ['SUB-NEW-043'],
    title: 'Browser back from Stripe checkout returns without activating subscription',
    priority: 'High',
    status: 'automated',
    automation: 'DirectSubscriptionPurchase.spec.ts > Income Builder checkout preserves context on refresh and returns safely before payment'
  },
  {
    id: 'SC-75D',
    sourceIds: ['SUB-NEW-044'],
    title: 'Refreshing Stripe checkout keeps selected plan and customer context',
    priority: 'Medium',
    status: 'automated',
    automation: 'DirectSubscriptionPurchase.spec.ts > Income Builder checkout preserves context on refresh and returns safely before payment'
  },
  {
    id: 'SC-75E',
    sourceIds: ['SUB-NEW-045'],
    title: '3DS or authentication-required card flow is handled without losing subscription context',
    priority: 'High',
    status: 'blocked',
    dependency: 'Requires Stripe sandbox 3DS card fixture and confirmation handling rules.'
  },
  {
    id: 'SC-75F',
    sourceIds: ['SUB-NEW-046'],
    title: 'Delayed Stripe webhook keeps subscription pending until payment confirmation is received',
    priority: 'Critical',
    status: 'blocked',
    dependency: 'Requires webhook delay/retry control or backend subscription state API.'
  },
  {
    id: 'SC-75G',
    sourceIds: ['SUB-NEW-047'],
    title: 'User cannot access paid entitlements before successful payment confirmation',
    priority: 'Critical',
    status: 'future',
    dependency: 'Requires entitlement selectors and safe failed/pending checkout fixture.'
  },
  {
    id: 'SC-75H',
    sourceIds: ['SUB-NEW-048'],
    title: 'Payment receipt or subscription confirmation email is received after purchase',
    priority: 'Medium',
    status: 'blocked',
    dependency: 'Requires email inbox/API access or notification capture service.'
  },
  {
    id: 'SC-75I',
    sourceIds: ['SUB-NEW-049'],
    title: 'Invoice PDF amount, currency, and plan match the purchased subscription',
    priority: 'High',
    status: 'future',
    dependency: 'Requires deterministic plan amount fixture and PDF content parsing/validation.'
  },
  {
    id: 'SC-75J',
    sourceIds: ['SUB-NEW-050'],
    title: 'Saved payment method last four digits are shown correctly after purchase',
    priority: 'High',
    status: 'automated',
    automation: 'BillingSubscriptionManagement.spec.ts > Stripe portal shows current subscription and payment method'
  },
  {
    id: 'SC-75K',
    sourceIds: ['SUB-NEW-051'],
    title: 'Checkout network interruption shows recoverable error and allows retry',
    priority: 'Medium',
    status: 'future',
    dependency: 'Requires controlled network failure injection and retry expectation.'
  },
  {
    id: 'SC-75L',
    sourceIds: ['SUB-NEW-052'],
    title: 'Currency and conversion-fee copy remains visible for non-USD checkout',
    priority: 'Medium',
    status: 'automated',
    automation: 'DirectSubscriptionPurchase.spec.ts > Income Builder checkout shows currency and conversion details before payment'
  }
];

test.describe(
  'New Subscription Purchase Use Case 2 Matrix',
  () => {
    for (const scenario of useCaseTwoScenarios) {
      test(
        `${scenario.id} - ${scenario.title}`,
        async () => {
          test.info().annotations.push(
            {
              type: 'priority',
              description: scenario.priority
            },
            {
              type: 'automation-status',
              description: scenario.status
            },
            {
              type: 'source-test-id',
              description: scenario.sourceIds.join(', ')
            },
            {
              type: 'module',
              description: 'Billing'
            },
            {
              type: 'journey',
              description: 'New Subscription Purchase'
            }
          );

          if (scenario.status !== 'automated') {
            test.skip(
              true,
              scenario.dependency ?? 'Scenario requires additional subscription fixture or backend support.'
            );
          }

          test.skip(
            true,
            `Covered by ${scenario.automation}. Run the linked executable spec for full UI validation.`
          );
        }
      );
    }
  }
);

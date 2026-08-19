import {
  test
} from '@playwright/test';

test.use({
  screenshot: 'off',
  trace: 'off',
  video: 'off'
});

/* =============================================================================
TEST SUITE: Subscription Lifecycle E2E Matrix

PURPOSE
-------
Documents the full subscription lifecycle in executable Playwright form so AIR
can report exactly what is covered, blocked, known-bug, or future across:

- new-user trial activation
- without-card and with-card Overlay Strategists trial options
- all paid plan subscription paths
- upgrade, downgrade, billing interval changes
- cancellation at period end
- immediate cancellation and refunds
- renewal, expiry, dunning, and audit visibility

Most rows intentionally skip because they are traceability rows or require
Stripe/admin/scheduler fixtures. This file must not mutate real subscription
state unless a linked controlled executable spec is run with explicit env flags.

RUN
---
npx playwright test tests/SubscriptionLifecycleE2EMatrix.spec.ts
============================================================================= */

type LifecycleScenario = {
  id: string;
  sourceIds: string[];
  title: string;
  phase:
    | 'Onboarding'
    | 'Trial'
    | 'Paid Subscription'
    | 'Upgrade'
    | 'Downgrade'
    | 'Billing Interval'
    | 'Cancellation'
    | 'Refund'
    | 'Renewal And Dunning'
    | 'Audit And Reporting';
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  status: 'automated' | 'blocked' | 'future' | 'known-bug' | 'manual-verified';
  automation?: string;
  dependency?: string;
};

const lifecycleScenarios: LifecycleScenario[] = [
  {
    id: 'LC-001',
    sourceIds: ['UJ-001', 'SC-01'],
    title: 'New user can complete signup prerequisites and reach plan selection',
    phase: 'Onboarding',
    priority: 'Critical',
    status: 'automated',
    automation: 'onboarding.spec.ts and PlanSelectionValidation.spec.ts'
  },
  {
    id: 'LC-002',
    sourceIds: ['SC-02', 'SUB-TRIAL-002'],
    title: 'Overlay Strategists trial is displayed as available for eligible new user',
    phase: 'Trial',
    priority: 'Critical',
    status: 'automated',
    automation: 'OverlayStrategistsTrial.spec.ts and PlanSelectionValidation.spec.ts'
  },
  {
    id: 'LC-003',
    sourceIds: ['SC-01', 'SUB-TRIAL-001'],
    title: 'User can start Overlay Strategists trial without payment details',
    phase: 'Trial',
    priority: 'Critical',
    status: 'automated',
    automation: 'OverlayStrategistsTrial.spec.ts > without card'
  },
  {
    id: 'LC-004',
    sourceIds: ['SC-31', 'SUB-TRIAL-TERMS'],
    title: 'Without-card trial requires terms acceptance before activation',
    phase: 'Trial',
    priority: 'Critical',
    status: 'automated',
    automation: 'OverlayStrategistsTrial.spec.ts > terms validation'
  },
  {
    id: 'LC-005',
    sourceIds: ['SC-19', 'SUB-TRIAL-EXPIRY-NO-CARD'],
    title: 'Without-card trial moves user to Free plan when trial expires',
    phase: 'Trial',
    priority: 'Critical',
    status: 'blocked',
    dependency: 'Requires trial-expiry fixture, scheduler/time travel, or backend time-control API.'
  },
  {
    id: 'LC-006',
    sourceIds: ['SC-07', 'SUB-TRIAL-WITH-CARD'],
    title: 'User can choose Overlay Strategists trial with card and reach Stripe checkout',
    phase: 'Trial',
    priority: 'Critical',
    status: 'automated',
    automation: 'OverlayStrategistsTrial.spec.ts > with card checkout details'
  },
  {
    id: 'LC-007',
    sourceIds: ['SC-07', 'SC-09', 'BUG-BILLING-TRIAL-CARD'],
    title: 'With-card trial displays active trial and saved payment method in Billing',
    phase: 'Trial',
    priority: 'Critical',
    status: 'known-bug',
    dependency: 'Confirmed product issue: Billing shows Free Plan and does not show saved card after with-card trial activation.'
  },
  {
    id: 'LC-008',
    sourceIds: ['SC-24', 'SUB-TRIAL-CONVERT'],
    title: 'With-card trial auto-renews to paid Overlay Strategists monthly subscription at expiry',
    phase: 'Trial',
    priority: 'Critical',
    status: 'blocked',
    dependency: 'Requires trial-expiry fixture, Stripe webhook/scheduler control, and Stripe ledger/API visibility.'
  },
  {
    id: 'LC-009',
    sourceIds: ['SC-10', 'SUB-TRIAL-PAID-SUBSCRIBER'],
    title: 'Existing paid subscriber cannot start another Overlay Strategists trial',
    phase: 'Trial',
    priority: 'Critical',
    status: 'automated',
    automation: 'BillingSubscriptionManagement.spec.ts and OverlayStrategistsTrialMatrix.spec.ts'
  },
  {
    id: 'LC-010',
    sourceIds: ['SC-11', 'SC-12', 'SC-13'],
    title: 'Trial is allowed only once per verified email, verified mobile, or reused payment method',
    phase: 'Trial',
    priority: 'Critical',
    status: 'blocked',
    dependency: 'Requires deterministic repeat-trial user, repeat-phone fixture, and Stripe payment-method reuse observability.'
  },
  {
    id: 'LC-011',
    sourceIds: ['SC-03', 'SUB-TRIAL-BROKER-LIMIT'],
    title: 'No-card trial enforces broker integration limit without counting manual entry',
    phase: 'Trial',
    priority: 'Critical',
    status: 'known-bug',
    dependency: 'Confirmed product issue: manual entry is currently counted as broker integration.'
  },
  {
    id: 'LC-012',
    sourceIds: ['SC-04', 'SC-05'],
    title: 'No-card trial enforces linked account and portfolio position limits',
    phase: 'Trial',
    priority: 'Critical',
    status: 'blocked',
    dependency: 'Requires broker linked-account fixture and portfolio position seed/API support.'
  },
  {
    id: 'LC-013',
    sourceIds: ['SC-06', 'SUB-TRIAL-FEATURES'],
    title: 'Overlay Strategists features remain visible while trial is active',
    phase: 'Trial',
    priority: 'High',
    status: 'automated',
    automation: 'PlanSelectionValidation.spec.ts > Overlay Strategists feature summary'
  },
  {
    id: 'LC-014',
    sourceIds: ['SC-36', 'SC-41'],
    title: 'User can start paid subscription from onboarding plan selection',
    phase: 'Paid Subscription',
    priority: 'Critical',
    status: 'automated',
    automation: 'onboarding.spec.ts and DirectSubscriptionPurchase.spec.ts'
  },
  {
    id: 'LC-015',
    sourceIds: ['SC-37', 'SC-38', 'SC-39', 'SC-40'],
    title: 'Paid checkout summary opens for Income Builder, Portfolio Hedger, and Marketplace plans',
    phase: 'Paid Subscription',
    priority: 'Critical',
    status: 'automated',
    automation: 'DirectSubscriptionPurchase.spec.ts'
  },
  {
    id: 'LC-016',
    sourceIds: ['SC-49', 'SUB-PLAN-PRICING'],
    title: 'Monthly and annual plan prices are visible and switch correctly before checkout',
    phase: 'Paid Subscription',
    priority: 'High',
    status: 'automated',
    automation: 'PlanSelectionValidation.spec.ts and DirectSubscriptionPurchase.spec.ts'
  },
  {
    id: 'LC-017',
    sourceIds: ['SC-45', 'SC-46', 'SC-47', 'SC-48'],
    title: 'Stripe checkout shows subscriber email, selected plan, billing interval, and card fields',
    phase: 'Paid Subscription',
    priority: 'Critical',
    status: 'automated',
    automation: 'DirectSubscriptionPurchase.spec.ts and OverlayStrategistsTrial.spec.ts'
  },
  {
    id: 'LC-018',
    sourceIds: ['SC-52', 'SC-53', 'SC-54'],
    title: 'Successful paid checkout activates subscription and redirects back to dashboard',
    phase: 'Paid Subscription',
    priority: 'Critical',
    status: 'automated',
    automation: 'onboarding.spec.ts > Income Builder Stripe checkout payment completion'
  },
  {
    id: 'LC-019',
    sourceIds: ['SC-55', 'SC-56', 'SC-75L'],
    title: 'Billing shows current plan, invoice evidence, and Stripe currency details',
    phase: 'Paid Subscription',
    priority: 'High',
    status: 'automated',
    automation: 'BillingSubscriptionManagement.spec.ts, BillingDeep.spec.ts, and DirectSubscriptionPurchase.spec.ts'
  },
  {
    id: 'LC-020',
    sourceIds: ['SC-57', 'SC-58', 'SC-59', 'SC-60'],
    title: 'Checkout rejects invalid, declined, insufficient-funds, stolen, and processing-error cards',
    phase: 'Paid Subscription',
    priority: 'Critical',
    status: 'automated',
    automation: 'PaymentNegative.spec.ts and OverlayStrategistsTrial.spec.ts'
  },
  {
    id: 'LC-021',
    sourceIds: ['SC-61', 'SUB-CHECKOUT-3DS'],
    title: 'Authentication-required card keeps user in Stripe checkout context',
    phase: 'Paid Subscription',
    priority: 'High',
    status: 'automated',
    automation: 'PaymentNegative.spec.ts > authentication-required card'
  },
  {
    id: 'LC-022',
    sourceIds: ['SC-73', 'SC-74', 'SC-75'],
    title: 'Checkout refresh and browser-back behavior do not accidentally activate subscription',
    phase: 'Paid Subscription',
    priority: 'High',
    status: 'automated',
    automation: 'DirectSubscriptionPurchase.spec.ts > checkout refresh/back safety'
  },
  {
    id: 'LC-023',
    sourceIds: ['SC-76', 'SUB-UPGRADE-001'],
    title: 'Subscribed user can see upgrade action or current plan status controls',
    phase: 'Upgrade',
    priority: 'High',
    status: 'automated',
    automation: 'BillingSubscriptionManagement.spec.ts > Billing plans show plan action or status controls'
  },
  {
    id: 'LC-024',
    sourceIds: ['SC-77', 'SC-78', 'SC-79'],
    title: 'Upgrade to higher plan starts immediate Stripe proration checkout',
    phase: 'Upgrade',
    priority: 'Critical',
    status: 'blocked',
    dependency: 'Requires dedicated lower-tier active subscription, Stripe proration visibility, and safe payment fixture.'
  },
  {
    id: 'LC-025',
    sourceIds: ['SC-80', 'SC-81'],
    title: 'Upgrade payment starts a new billing cycle immediately',
    phase: 'Upgrade',
    priority: 'Critical',
    status: 'blocked',
    dependency: 'Requires Stripe/API validation for invoice, billing-cycle anchor, and entitlement change.'
  },
  {
    id: 'LC-026',
    sourceIds: ['SC-113', 'SUB-DOWNGRADE-001'],
    title: 'Subscribed user can see downgrade action or current plan status controls',
    phase: 'Downgrade',
    priority: 'High',
    status: 'automated',
    automation: 'BillingSubscriptionManagement.spec.ts > Billing plans show plan action or status controls'
  },
  {
    id: 'LC-027',
    sourceIds: ['SC-114', 'SC-115', 'SC-116'],
    title: 'Downgrade schedules lower plan for next renewal instead of immediate entitlement loss',
    phase: 'Downgrade',
    priority: 'Critical',
    status: 'blocked',
    dependency: 'Requires dedicated higher-tier account, downgrade confirmation UI, and renewal-date fixture.'
  },
  {
    id: 'LC-028',
    sourceIds: ['SC-160', 'SC-161'],
    title: 'Downgrade warns about feature and data-limit impact before confirmation',
    phase: 'Downgrade',
    priority: 'Critical',
    status: 'blocked',
    dependency: 'Requires higher-tier data fixtures for broker integrations, linked accounts, and positions.'
  },
  {
    id: 'LC-029',
    sourceIds: ['SC-165', 'SC-166', 'SC-167'],
    title: 'Monthly-to-annual billing change is immediate and uses prorated amount',
    phase: 'Billing Interval',
    priority: 'Critical',
    status: 'blocked',
    dependency: 'Requires dedicated monthly paid account and Stripe proration/billing-cycle visibility.'
  },
  {
    id: 'LC-030',
    sourceIds: ['SC-201', 'SC-202', 'SC-203'],
    title: 'Annual-to-monthly billing change is scheduled for next renewal date',
    phase: 'Billing Interval',
    priority: 'Critical',
    status: 'blocked',
    dependency: 'Requires dedicated annual paid account and pending-change/renewal-date fixture.'
  },
  {
    id: 'LC-031',
    sourceIds: ['SC-168', 'SC-204'],
    title: 'Billing interval toggles and interval-specific prices remain visible before change',
    phase: 'Billing Interval',
    priority: 'High',
    status: 'automated',
    automation: 'PlanSelectionValidation.spec.ts, BillingSubscriptionManagement.spec.ts, and DirectSubscriptionPurchase.spec.ts'
  },
  {
    id: 'LC-032',
    sourceIds: ['SC-241', 'SC-242', 'SC-243', 'SC-244'],
    title: 'Subscription management portal opens with current subscription details',
    phase: 'Cancellation',
    priority: 'Critical',
    status: 'automated',
    automation: 'BillingSubscriptionManagement.spec.ts'
  },
  {
    id: 'LC-033',
    sourceIds: ['SC-245', 'SC-246', 'SC-248'],
    title: 'Cancel-at-period-end form accepts reason and feedback without immediate cancellation',
    phase: 'Cancellation',
    priority: 'Critical',
    status: 'automated',
    automation: 'BillingSubscriptionManagement.spec.ts > cancel form without cancelling'
  },
  {
    id: 'LC-034',
    sourceIds: ['SC-249', 'SC-250', 'SC-251'],
    title: 'Cancel-at-period-end schedules cancellation and keeps access until expiry',
    phase: 'Cancellation',
    priority: 'Critical',
    status: 'blocked',
    dependency: 'Requires dedicated destructive cancellation account and permission to submit final cancellation.'
  },
  {
    id: 'LC-035',
    sourceIds: ['SC-252', 'SC-253'],
    title: 'Cancelled subscription shows scheduled cancellation state and renewal/end date',
    phase: 'Cancellation',
    priority: 'High',
    status: 'automated',
    automation: 'BillingSubscriptionManagement.spec.ts > already scheduled cancellation state'
  },
  {
    id: 'LC-036',
    sourceIds: ['SUB-CAN-IMMEDIATE'],
    title: 'Immediate cancellation is restricted to controlled admin or explicit destructive flow',
    phase: 'Cancellation',
    priority: 'Critical',
    status: 'blocked',
    dependency: 'Requires admin/business approval, dedicated throwaway subscription, and rollback/refund policy.'
  },
  {
    id: 'LC-037',
    sourceIds: ['SC-260', 'SC-261'],
    title: 'User loses paid access after cancellation expiry and can select a new plan',
    phase: 'Cancellation',
    priority: 'Critical',
    status: 'blocked',
    dependency: 'Requires cancellation-expiry fixture or scheduler/time-control API.'
  },
  {
    id: 'LC-038',
    sourceIds: ['SUB-REFUND-001'],
    title: 'Eligible immediate cancellation displays refund amount before refund confirmation',
    phase: 'Refund',
    priority: 'Critical',
    status: 'blocked',
    dependency: 'Requires refund policy confirmation, Stripe/admin refund fixture, and safe destructive test account.'
  },
  {
    id: 'LC-039',
    sourceIds: ['SUB-REFUND-002'],
    title: 'Refund processing updates Stripe ledger, billing status, and transaction history',
    phase: 'Refund',
    priority: 'Critical',
    status: 'blocked',
    dependency: 'Requires Stripe API/admin access, refund webhook observability, and transaction-history fixture.'
  },
  {
    id: 'LC-040',
    sourceIds: ['SUB-REFUND-003'],
    title: 'Refund failure or partial refund shows clear user/admin state',
    phase: 'Refund',
    priority: 'High',
    status: 'future',
    dependency: 'Requires business-approved refund edge-case matrix and Stripe refund failure fixture.'
  },
  {
    id: 'LC-041',
    sourceIds: ['SC-63', 'SC-64', 'SC-65', 'SC-66'],
    title: 'Paid subscription renewal, reminders, and invoice history are validated across billing cycles',
    phase: 'Renewal And Dunning',
    priority: 'Critical',
    status: 'blocked',
    dependency: 'Requires renewal scheduler/time travel, email/notification access, and Stripe ledger visibility.'
  },
  {
    id: 'LC-042',
    sourceIds: ['SC-301', 'SC-302', 'SC-303'],
    title: 'Failed renewal payment enters dunning/grace state and prompts payment recovery',
    phase: 'Renewal And Dunning',
    priority: 'Critical',
    status: 'blocked',
    dependency: 'Requires Stripe dunning configuration, failed-renewal fixture, webhook controls, and scheduler access.'
  },
  {
    id: 'LC-043',
    sourceIds: ['SC-331', 'SC-332'],
    title: 'Payment recovery portal allows updating payment method without losing subscription context',
    phase: 'Renewal And Dunning',
    priority: 'High',
    status: 'automated',
    automation: 'BillingSubscriptionManagement.spec.ts and FailedPaymentDunningMatrix.spec.ts'
  },
  {
    id: 'LC-044',
    sourceIds: ['SC-33', 'SC-34', 'SC-67', 'SC-68'],
    title: 'Trial, conversion, purchase, upgrade, downgrade, cancellation, and refund events are auditable',
    phase: 'Audit And Reporting',
    priority: 'High',
    status: 'blocked',
    dependency: 'Requires admin audit-log, API, or database event validation source.'
  },
  {
    id: 'LC-045',
    sourceIds: ['AIR-SUB-LIFECYCLE-001'],
    title: 'AIR shows subscription lifecycle coverage, blocked gaps, known bugs, and executable coverage status',
    phase: 'Audit And Reporting',
    priority: 'High',
    status: 'automated',
    automation: 'CoverageGapEngine > skipped matrix ingestion and AIR blocked/skipped coverage'
  }
];

test.describe(
  'Subscription Lifecycle E2E Matrix',
  () => {
    for (const scenario of lifecycleScenarios) {
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
              description: 'Subscription Lifecycle E2E'
            },
            {
              type: 'lifecycle-phase',
              description: scenario.phase
            }
          );

          if (scenario.status !== 'automated') {
            test.skip(
              true,
              scenario.dependency ??
                'Scenario requires a controlled subscription lifecycle fixture.'
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

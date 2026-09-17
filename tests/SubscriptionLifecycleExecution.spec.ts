import {
  expect,
  Page,
  test
} from '@playwright/test';

import {
  AUTH_SETTINGS,
  TEST_USERS
} from './config/testData';
import {
  generateEmail,
  generateMobileNumber
} from './utils/emailGenerator';
import { BillingPage }
  from './pages/BillingPage';
import { CompliancePage }
  from './pages/CompliancePage';
import { DashboardPage }
  from './pages/DashboardPage';
import { LoginPage }
  from './pages/LoginPage';
import { MobileVerificationPage }
  from './pages/MobileVerificationPage';
import { PlanSelectionPage }
  from './pages/PlanSelectionPage';
import { RegistrationPage }
  from './pages/RegistrationPage';
import { RiskProfilePage }
  from './pages/RiskProfilePage';
import { StripePaymentPage }
  from './pages/StripePaymentPage';

/* =============================================================================
TEST SUITE: Subscription Lifecycle Execution

PURPOSE
-------
Runs controlled end-to-end subscription lifecycle slices with disposable users.
These tests are separate from the matrix specs because they can create users,
start trials, submit Stripe test payments, or inspect subscription controls.

Default behavior is safe: every mutating flow is skipped until explicitly
enabled with env flags. Four disposable tracks stay separate because retention
is once per lifetime and yearly refund ends paid access.

RUN
---
Included in the executable suite (inspect Users A/B/D; extra submit flags stay off):

npm run executable:headed

Or only this slice:

$env:SUBSCRIPTION_LIFECYCLE_EXECUTION_ENABLED="true"
$env:SUB_LIFECYCLE_PLAN_LADDER_ENABLED="true"
npx playwright test tests/SubscriptionLifecycleExecution.spec.ts -g "plan ladder|retention offer" --headed

Destructive submits stay off unless extra flags are set:
SUB_LIFECYCLE_MONTHLY_CANCEL_SUBMIT_ENABLED
SUB_LIFECYCLE_YEARLY_CANCEL_EXPIRY_SUBMIT_ENABLED
SUB_LIFECYCLE_YEARLY_REFUND_SUBMIT_ENABLED
SUB_LIFECYCLE_RETENTION_ACCEPT_ENABLED
SUB_LIFECYCLE_DOWNGRADE_SUBMIT_ENABLED
============================================================================= */

type PlanName =
  | 'Income Builder'
  | 'Overlay Strategists'
  | 'Portfolio Hedger'
  | 'Marketplace';

type BillingInterval =
  | 'monthly'
  | 'annual';

type PlanPrice = {
  monthly: number;
  annual: number;
};

const PLAN_PRICES: Record<PlanName, PlanPrice> = {
  'Income Builder': {
    monthly: 29,
    annual: 290
  },
  'Overlay Strategists': {
    monthly: 79,
    annual: 790
  },
  'Portfolio Hedger': {
    monthly: 149,
    annual: 1490
  },
  Marketplace: {
    monthly: 249,
    annual: 2490
  }
};

function envEnabled(
  name: string
) {
  return [
    '1',
    'true',
    'yes',
    'on'
  ].includes(
    (
      process.env[name] ??
      ''
    ).toLowerCase()
  );
}

function flowEnabled(
  flagName: string
) {
  return envEnabled(
    'SUBSCRIPTION_LIFECYCLE_EXECUTION_ENABLED'
  ) &&
    envEnabled(
      flagName
    );
}

function controlledLifecycleTest(
  title: string,
  flagName: string,
  reason: string,
  body: (args: {
    page: Page;
  }) => Promise<void>
) {
  if (
    flowEnabled(
      flagName
    )
  ) {
    test(
      title,
      body
    );

    return;
  }

  test.skip(
    title,
    async () => {
      test.info().annotations.push({
        type: 'automation-status',
        description: 'controlled'
      });

      test.info().annotations.push({
        type: 'dependency',
        description:
          `${reason} Enable SUBSCRIPTION_LIFECYCLE_EXECUTION_ENABLED=true and ${flagName}=true.`
      });
    }
  );
}

function proratedDelta(
  fromPlan: PlanName,
  toPlan: PlanName,
  interval: BillingInterval,
  usedDays: number,
  totalDays: number
) {
  const remainingDays =
    Math.max(
      totalDays - usedDays,
      0
    );

  const fromPrice =
    PLAN_PRICES[fromPlan][interval];

  const toPrice =
    PLAN_PRICES[toPlan][interval];

  const unusedCredit =
    fromPrice *
      remainingDays /
      totalDays;

  const remainingCharge =
    toPrice *
      remainingDays /
      totalDays;

  return Number(
    Math.max(
      remainingCharge - unusedCredit,
      0
    ).toFixed(
      2
    )
  );
}

function refundEstimate(
  plan: PlanName,
  interval: BillingInterval,
  usedDays: number,
  totalDays: number
) {
  const remainingDays =
    Math.max(
      totalDays - usedDays,
      0
    );

  return Number(
    (
      PLAN_PRICES[plan][interval] *
      remainingDays /
      totalDays
    ).toFixed(
      2
    )
  );
}

function upgradeTargetPlan() {
  const configuredPlan =
    process.env.SUB_LIFECYCLE_UPGRADE_TARGET_PLAN as PlanName | undefined;

  return configuredPlan ??
    'Portfolio Hedger';
}

function submitUpgradeTargetPlan() {
  const configuredPlan =
    process.env.SUB_LIFECYCLE_SUBMIT_UPGRADE_TARGET_PLAN as PlanName | undefined;

  return configuredPlan ??
    'Overlay Strategists';
}

function submitUpgradeInterval() {
  const configuredInterval =
    (
      process.env.SUB_LIFECYCLE_SUBMIT_UPGRADE_INTERVAL ??
      'monthly'
    )
      .trim()
      .toLowerCase();

  return configuredInterval === 'annual'
    ? 'annual'
    : 'monthly';
}

function upgradeIntervals() {
  const configuredIntervals =
    process.env.SUB_LIFECYCLE_UPGRADE_INTERVALS;

  if (!configuredIntervals) {
    return [
      'monthly',
      'annual'
    ] as BillingInterval[];
  }

  return configuredIntervals
    .split(
      ','
    )
    .map(
      interval =>
        interval.trim()
          .toLowerCase()
    )
    .filter(
      (
        interval
      ): interval is BillingInterval =>
        interval === 'monthly' ||
        interval === 'annual'
    );
}

function upgradeBillingCopy(
  interval: BillingInterval
) {
  return interval === 'monthly'
    ? /per month|monthly|\/mo|month|subscription|total|due|pay/i
    : /per year|annual|\/yr|\/year|year|subscription|total|due|pay/i;
}

const PAID_PLAN_LADDER: PlanName[] = [
  'Income Builder',
  'Overlay Strategists',
  'Portfolio Hedger',
  'Marketplace'
];

function higherPlansThan(
  plan: PlanName
) {
  const start =
    PAID_PLAN_LADDER.indexOf(
      plan
    );

  return PAID_PLAN_LADDER.slice(
    start + 1
  );
}

function lowerMonthlyPlan(
  plan: PlanName
): PlanName {
  if (plan === 'Portfolio Hedger') {
    return 'Overlay Strategists';
  }

  return 'Income Builder';
}

async function openPlanSelectionForDisposableUser(
  page: Page,
  scenario: string
) {
  const email =
    generateEmail(
      scenario
    );

  const mobileNumber =
    generateMobileNumber();

  console.log(
    `${scenario} Email:`,
    email
  );

  console.log(
    `${scenario} Mobile:`,
    mobileNumber
  );

  await new RegistrationPage(
    page
  ).open();

  await new RegistrationPage(
    page
  ).register(
    email,
    mobileNumber
  );

  if (
    AUTH_SETTINGS.emailVerificationRequired
  ) {
    console.log(
      '\nMANUAL EMAIL VERIFICATION REQUIRED'
    );
    console.log(
      `Verify email sent to: ${email}`
    );
    console.log(
      'Open Gmail and click the verification link.'
    );
    console.log(
      'After verification, resume Playwright.'
    );

    await page.pause();
  }

  await new LoginPage(
    page
  ).login(
    email,
    TEST_USERS.onboarding.password
  );

  await new MobileVerificationPage(
    page
  ).completeIfVisible(
    mobileNumber
  );

  await new RiskProfilePage(
    page
  ).fill();

  await new CompliancePage(
    page
  ).fill();

  await expect(
    page.getByText(
      /choose your plan|select a plan|get started/i
    ).first()
  ).toBeVisible({
    timeout: 30000
  });

  return {
    email,
    mobileNumber
  };
}

async function loginPreparedPaidUser(
  page: Page
) {
  const email =
    process.env.SUB_LIFECYCLE_PAID_EMAIL ??
    process.env.BILLING_MANAGEMENT_EMAIL;

  const password =
    process.env.SUB_LIFECYCLE_PAID_PASSWORD ??
    process.env.BILLING_MANAGEMENT_PASSWORD;

  if (
    !email ||
    !password
  ) {
    test.skip(
      true,
      'Prepared paid subscription user is not configured. Set SUB_LIFECYCLE_PAID_EMAIL and SUB_LIFECYCLE_PAID_PASSWORD.'
    );

    throw new Error(
      'Prepared paid subscription user is not configured.'
    );
  }

  await new LoginPage(
    page
  ).login(
    email,
    password
  );
}

async function purchasePaidPlanForDisposableUser(
  page: Page,
  scenario: string,
  plan: PlanName,
  interval: BillingInterval
) {
  const user =
    await openPlanSelectionForDisposableUser(
      page,
      scenario
    );

  const planPage =
    new PlanSelectionPage(
      page
    );

  if (interval === 'annual') {
    await planPage.selectAnnualBilling();
  } else {
    await planPage.selectMonthlyBilling();
  }

  await planPage.selectPlan(
    plan
  );

  await new StripePaymentPage(
    page
  ).validateSubscriptionCheckoutDetails({
    expectedEmail:
      user.email,
    expectedPlan:
      plan,
    expectedBillingCopy:
      upgradeBillingCopy(
        interval
      )
  });

  await new StripePaymentPage(
    page
  ).completePayment();

  await validateDashboardAndBilling(
    page
  );

  return user;
}

async function submitUpgradeWithDueAndRenewal(
  billing: BillingPage,
  targetPlan: PlanName,
  interval: BillingInterval,
  preferredAction: 'upgrade' | 'interval' = 'upgrade'
) {
  const actions: Array<'upgrade' | 'interval'> =
    preferredAction === 'interval'
      ? [
          'interval',
          'upgrade'
        ]
      : [
          'upgrade',
          'interval'
        ];

  let openedAction:
    | 'upgrade'
    | 'interval'
    | undefined;

  for (const action of actions) {
    const available =
      await billing.planChangeActionAvailable(
        targetPlan,
        action,
        interval
      );

    if (!available) {
      continue;
    }

    await billing.openPlanChangeCalculationPreview({
      targetPlan,
      action,
      interval
    });

    openedAction =
      action;

    break;
  }

  if (!openedAction) {
    return false;
  }

  await billing.validatePlanChangeDueAmountAndRenewal({
    targetPlan,
    action:
      openedAction,
    interval,
    expectedBillingCopy:
      upgradeBillingCopy(
        interval
      ),
    expectedPlanCharge:
      PLAN_PRICES[targetPlan][interval],
    expectedRecurringAmount:
      PLAN_PRICES[targetPlan][interval]
  });

  await billing.submitPlanChangeCalculationPreview({
    targetPlan,
    action:
      openedAction
  });

  await billing.validateActivePlan(
    targetPlan
  );

  return true;
}

async function climbPaidPlanLadder(
  billing: BillingPage,
  fromPlan: PlanName,
  interval: BillingInterval,
  preferredAction: 'upgrade' | 'interval' = 'upgrade'
) {
  let currentPlan =
    fromPlan;

  for (const targetPlan of higherPlansThan(fromPlan)) {
    const upgraded =
      await submitUpgradeWithDueAndRenewal(
        billing,
        targetPlan,
        interval,
        preferredAction
      );

    if (!upgraded) {
      if (targetPlan === 'Marketplace') {
        console.log(
          `Skipping Marketplace ${interval} upgrade; control was not offered in UAT.`
        );

        continue;
      }

      throw new Error(
        `Expected ${interval} upgrade control for ${targetPlan} after ${currentPlan}.`
      );
    }

    currentPlan =
      targetPlan;
    preferredAction =
      'upgrade';
  }

  return currentPlan;
}

async function validateDashboardAndBilling(
  page: Page,
  expectedTrialMode?: 'with-card' | 'without-card'
) {
  await new DashboardPage(
    page
  ).validateLoaded();

  const billing =
    new BillingPage(
    page
  );

  if (
    expectedTrialMode
  ) {
    await billing.validateOverlayStrategistsTrialBillingState(
      expectedTrialMode
    );

    return;
  }

  await billing.validateOverviewContract();
}

test.describe(
  'Subscription Lifecycle Execution',
  () => {
    test.describe.configure({
      timeout: 45 * 60 * 1000
    });

    controlledLifecycleTest(
      'Disposable user can start Overlay Strategists trial without card',
      'SUB_LIFECYCLE_TRIAL_WITHOUT_CARD_ENABLED',
      'Without-card trial creates a new disposable user and consumes trial eligibility.',
      async ({ page }) => {
        await openPlanSelectionForDisposableUser(
          page,
          'sub-lifecycle-trial-no-card'
        );

        const planPage =
          new PlanSelectionPage(
            page
          );

        await planPage.selectOverlayStrategistsTrialWithoutCard();
        await planPage.validateNotRedirectedToStripeCheckout();
        await validateDashboardAndBilling(
          page,
          'without-card'
        );
      }
    );

    controlledLifecycleTest(
      'Disposable user can start Overlay Strategists trial with card',
      'SUB_LIFECYCLE_TRIAL_WITH_CARD_ENABLED',
      'With-card trial creates a new disposable user and starts a Stripe test-mode trial.',
      async ({ page }) => {
        const user =
          await openPlanSelectionForDisposableUser(
            page,
            'sub-lifecycle-trial-card'
          );

        await new PlanSelectionPage(
          page
        ).selectOverlayStrategistsTrialWithCard();

        await new StripePaymentPage(
          page
        ).validateTrialCheckoutDetails(
          user.email
        );

        await new StripePaymentPage(
          page
        ).completePayment();

        await validateDashboardAndBilling(
          page,
          'with-card'
        );
      }
    );

    controlledLifecycleTest(
      'Disposable user can purchase Income Builder monthly and reach Billing',
      'SUB_LIFECYCLE_INCOME_MONTHLY_ENABLED',
      'Paid purchase creates a new disposable user and submits Stripe test payment.',
      async ({ page }) => {
        const user =
          await openPlanSelectionForDisposableUser(
            page,
            'sub-lifecycle-income-monthly'
          );

        await new PlanSelectionPage(
          page
        ).selectPlan(
          'Income Builder'
        );

        await new StripePaymentPage(
          page
        ).validateSubscriptionCheckoutDetails({
          expectedEmail:
            user.email,
          expectedPlan:
            'Income Builder',
          expectedBillingCopy:
            /29|per month|monthly|subscription|total/i
        });

        await new StripePaymentPage(
          page
        ).completePayment();

        await validateDashboardAndBilling(
          page
        );
      }
    );

    controlledLifecycleTest(
      'Prepared paid user exposes upgrade downgrade and interval controls',
      'SUB_LIFECYCLE_PLAN_CONTROLS_ENABLED',
      'Plan controls are read-only, but they require a prepared paid subscription user.',
      async ({ page }) => {
        await loginPreparedPaidUser(
          page
        );

        const billing =
          new BillingPage(
            page
          );

        await billing.validatePlanLifecycleActionSummary();
        await billing.validateBillingIntervalPresentationSummary();
        await billing.validatePaidSubscriberTrialCtaIsNotOffered();
      }
    );

    controlledLifecycleTest(
      'Prepared paid user can preview monthly and annual upgrade calculations',
      'SUB_LIFECYCLE_UPGRADE_PREVIEW_ENABLED',
      'Upgrade preview validates the billing calculation context without submitting payment.',
      async ({ page }) => {
        const targetPlan =
          upgradeTargetPlan();

        const intervals =
          upgradeIntervals();

        await loginPreparedPaidUser(
          page
        );

        const billing =
          new BillingPage(
            page
          );

        for (const interval of intervals) {
          await billing.openPlanChangeCalculationPreview({
            targetPlan,
            action: 'upgrade',
            interval
          });

          await billing.validatePlanChangeCalculationPreview({
            targetPlan:
              targetPlan,
            action:
              'upgrade',
            interval:
              interval,
            expectedBillingCopy:
              upgradeBillingCopy(
                interval
              ),
            expectedPlanCharge:
              PLAN_PRICES[targetPlan][interval],
            expectedRecurringAmount:
              PLAN_PRICES[targetPlan][interval]
          });

          await billing.closePlanChangeCalculationPreview({
            targetPlan,
            action: 'upgrade'
          });
        }
      }
    );

    controlledLifecycleTest(
      'Prepared paid user can accept terms and submit upgrade payment',
      'SUB_LIFECYCLE_UPGRADE_SUBMIT_ENABLED',
      'This test changes the prepared paid user subscription and requires a card on file.',
      async ({ page }) => {
        const targetPlan =
          submitUpgradeTargetPlan();

        const interval =
          submitUpgradeInterval();

        await loginPreparedPaidUser(
          page
        );

        const billing =
          new BillingPage(
            page
          );

        await billing.openPlanChangeCalculationPreview({
          targetPlan,
          action: 'upgrade',
          interval
        });

        await billing.validatePlanChangeCalculationPreview({
          targetPlan,
          action: 'upgrade',
          interval,
          expectedBillingCopy:
            upgradeBillingCopy(
              interval
            ),
          expectedPlanCharge:
            PLAN_PRICES[targetPlan][interval],
          expectedRecurringAmount:
            PLAN_PRICES[targetPlan][interval]
        });

        await billing.submitPlanChangeCalculationPreview({
          targetPlan,
          action: 'upgrade'
        });

        await billing.validateActivePlan(
          targetPlan
        );
      }
    );

    controlledLifecycleTest(
      'Prepared paid user exposes non-destructive cancellation form',
      'SUB_LIFECYCLE_CANCEL_FORM_ENABLED',
      'Cancellation form validation is non-destructive but needs a paid subscription user.',
      async ({ page }) => {
        await loginPreparedPaidUser(
          page
        );

        await new BillingPage(
          page
        ).validateCancelSubscriptionFormWithoutCancelling();
      }
    );

    controlledLifecycleTest(
      'User A monthly plan ladder then period-end cancel',
      'SUB_LIFECYCLE_PLAN_LADDER_ENABLED',
      'Creates a disposable monthly user, upgrades the paid ladder, and inspects period-end cancel. Enable SUB_LIFECYCLE_MONTHLY_CANCEL_SUBMIT_ENABLED to submit.',
      async ({ page }) => {
        await purchasePaidPlanForDisposableUser(
          page,
          'sub-lifecycle-user-a-monthly',
          'Income Builder',
          'monthly'
        );

        const billing =
          new BillingPage(
            page
          );

        await climbPaidPlanLadder(
          billing,
          'Income Builder',
          'monthly'
        );

        await billing.validateMonthlyCancellationOptions();

        if (
          envEnabled(
            'SUB_LIFECYCLE_MONTHLY_CANCEL_SUBMIT_ENABLED'
          )
        ) {
          await billing.submitMonthlyCancelAtPeriodEnd();
        }
      }
    );

    controlledLifecycleTest(
      'User B yearly plan ladder then cancel at expiry',
      'SUB_LIFECYCLE_PLAN_LADDER_ENABLED',
      'Creates a disposable user, switches monthly to annual, upgrades remaining yearly plans, and inspects yearly cancel options. Enable SUB_LIFECYCLE_YEARLY_CANCEL_EXPIRY_SUBMIT_ENABLED to submit expiry only.',
      async ({ page }) => {
        await purchasePaidPlanForDisposableUser(
          page,
          'sub-lifecycle-user-b-yearly',
          'Income Builder',
          'monthly'
        );

        const billing =
          new BillingPage(
            page
          );

        const switchedToAnnual =
          await submitUpgradeWithDueAndRenewal(
            billing,
            'Income Builder',
            'annual',
            'interval'
          );

        if (!switchedToAnnual) {
          throw new Error(
            'Expected monthly-to-annual upgrade controls for Income Builder.'
          );
        }

        await climbPaidPlanLadder(
          billing,
          'Income Builder',
          'annual'
        );

        await billing.validateYearlyCancellationOptions();

        if (
          envEnabled(
            'SUB_LIFECYCLE_YEARLY_CANCEL_EXPIRY_SUBMIT_ENABLED'
          )
        ) {
          await billing.submitYearlyCancelAtExpiry();
        }
      }
    );

    controlledLifecycleTest(
      'User C yearly cancel and refund',
      'SUB_LIFECYCLE_YEARLY_REFUND_SUBMIT_ENABLED',
      'Destructive one-shot: buys Overlay annual, submits cancel-and-refund, and expects Free plan. Keep off for executable:headless.',
      async ({ page }) => {
        await purchasePaidPlanForDisposableUser(
          page,
          'sub-lifecycle-user-c-refund',
          'Overlay Strategists',
          'annual'
        );

        const billing =
          new BillingPage(
            page
          );

        await billing.submitYearlyCancelAndRefund();
        await billing.validateFreePlanAfterRefund();
      }
    );

    controlledLifecycleTest(
      'User D monthly retention offer inspect and decline without scheduling',
      'SUB_LIFECYCLE_PLAN_LADDER_ENABLED',
      'Creates a disposable Overlay monthly user, asserts the 3-month retention offer, declines it, and closes without scheduling a downgrade.',
      async ({ page }) => {
        await purchasePaidPlanForDisposableUser(
          page,
          'sub-lifecycle-user-d-retention-inspect',
          'Overlay Strategists',
          'monthly'
        );

        await new BillingPage(
          page
        ).declineRetentionAndPreviewOrScheduleDowngrade({
          currentPlan:
            'Overlay Strategists',
          targetPlan:
            lowerMonthlyPlan(
              'Overlay Strategists'
            ),
          schedule:
            false
        });
      }
    );

    controlledLifecycleTest(
      'User D monthly retention offer accept',
      'SUB_LIFECYCLE_RETENTION_ACCEPT_ENABLED',
      'Destructive to retention eligibility: accepts the once-per-lifetime offer, then asserts a second downgrade does not show it again.',
      async ({ page }) => {
        await purchasePaidPlanForDisposableUser(
          page,
          'sub-lifecycle-user-d-retention-accept',
          'Portfolio Hedger',
          'monthly'
        );

        const billing =
          new BillingPage(
            page
          );

        const targetPlan =
          lowerMonthlyPlan(
            'Portfolio Hedger'
          );

        await billing.acceptMonthlyDowngradeRetentionOffer({
          currentPlan:
            'Portfolio Hedger',
          targetPlan
        });

        await billing.assertRetentionOfferNotShown({
          currentPlan:
            'Portfolio Hedger',
          targetPlan
        });
      }
    );

    controlledLifecycleTest(
      'User D monthly retention offer decline then schedule downgrade',
      'SUB_LIFECYCLE_DOWNGRADE_SUBMIT_ENABLED',
      'Declines retention and schedules the monthly downgrade at next renewal. Keep off for executable:headless.',
      async ({ page }) => {
        await purchasePaidPlanForDisposableUser(
          page,
          'sub-lifecycle-user-d-downgrade-submit',
          'Overlay Strategists',
          'monthly'
        );

        await new BillingPage(
          page
        ).declineRetentionAndPreviewOrScheduleDowngrade({
          currentPlan:
            'Overlay Strategists',
          targetPlan:
            lowerMonthlyPlan(
              'Overlay Strategists'
            ),
          schedule:
            true
        });
      }
    );

    test(
      'Subscription lifecycle calculation rules are deterministic',
      async () => {
        const monthlyUpgrade =
          proratedDelta(
            'Income Builder',
            'Overlay Strategists',
            'monthly',
            15,
            30
          );

        expect(
          monthlyUpgrade
        ).toBe(
          25
        );

        const annualUpgrade =
          proratedDelta(
            'Overlay Strategists',
            'Portfolio Hedger',
            'annual',
            180,
            365
          );

        expect(
          annualUpgrade
        ).toBe(
          354.79
        );

        const immediateRefund =
          refundEstimate(
            'Marketplace',
            'monthly',
            10,
            30
          );

        expect(
          immediateRefund
        ).toBe(
          166
        );
      }
    );
  }
);

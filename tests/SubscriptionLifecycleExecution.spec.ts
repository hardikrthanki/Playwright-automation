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
enabled with env flags.

RUN
---
$env:SUBSCRIPTION_LIFECYCLE_EXECUTION_ENABLED="true"
npx playwright test tests/SubscriptionLifecycleExecution.spec.ts --headed
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
      timeout: 30 * 60 * 1000
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

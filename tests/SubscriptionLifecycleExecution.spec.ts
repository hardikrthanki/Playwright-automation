import fs from 'fs';
import path from 'path';

import {
  expect,
  Page,
  test
} from '@playwright/test';

import {
  TEST_USERS
} from './config/testData';
import {
  generateEmail,
  generateMobileNumber
} from './utils/emailGenerator';
import {
  waitForManualEmailVerification
} from './helpers/emailVerification';
import {
  continueAfterWithCardTrialCheckout
} from './helpers/withCardTrial';
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

Declaration order follows the product flow: trial, paid purchases, then
manage (controls, upgrade, downgrade, interval, cancel), then calc rules.

Default behavior is safe: every mutating flow is skipped until explicitly
enabled with env flags.

Paid preview/cancel slices reuse TEST_USERS.subscriber unless
SUB_LIFECYCLE_CREATE_DISPOSABLE_USER=true. Upgrade submit and first
purchases still create disposable users. Created emails are written to
test-results/created-stripe-users.json.

Plan ladder (new user, every monthly then yearly upgrade, yearly cancel
options, monthly retention offer):

$env:SUBSCRIPTION_LIFECYCLE_EXECUTION_ENABLED="true"
$env:SUB_LIFECYCLE_PLAN_LADDER_ENABLED="true"
npx playwright test tests/SubscriptionLifecycleExecution.spec.ts -g "plan ladder|retention offer" --headed

RUN
---
$env:SUBSCRIPTION_LIFECYCLE_EXECUTION_ENABLED="true"
$env:AUTH_EMAIL_VERIFICATION_REQUIRED="false"
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
  return configuredIntervals(
    'SUB_LIFECYCLE_UPGRADE_INTERVALS',
    [
      'monthly',
      'annual'
    ]
  );
}

function upgradeBillingCopy(
  interval: BillingInterval
) {
  return interval === 'monthly'
    ? /per month|monthly|\/mo|month|subscription|total|due|pay/i
    : /per year|annual|\/yr|\/year|year|subscription|total|due|pay/i;
}

function parsePlanName(
  value: string | undefined,
  fallback: PlanName
) {
  const normalized =
    (
      value ??
      ''
    ).trim();

  const plans: PlanName[] = [
    'Income Builder',
    'Overlay Strategists',
    'Portfolio Hedger',
    'Marketplace'
  ];

  return plans.find(
    plan =>
      plan.toLowerCase() ===
      normalized.toLowerCase()
  ) ??
    fallback;
}

function configuredIntervals(
  envName: string,
  fallback: BillingInterval[]
) {
  const configuredIntervals =
    process.env[envName];

  if (!configuredIntervals) {
    return fallback;
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

function downgradeTargetPlan() {
  return parsePlanName(
    process.env.SUB_LIFECYCLE_DOWNGRADE_TARGET_PLAN,
    'Income Builder'
  );
}

function downgradeIntervals() {
  return configuredIntervals(
    'SUB_LIFECYCLE_DOWNGRADE_INTERVALS',
    [
      'monthly'
    ]
  );
}

function intervalPreviewTargetPlan() {
  return parsePlanName(
    process.env.SUB_LIFECYCLE_INTERVAL_TARGET_PLAN,
    'Overlay Strategists'
  );
}

function intervalPreviewTarget() {
  return (
    process.env.SUB_LIFECYCLE_INTERVAL_TO ??
    'annual'
  )
    .trim()
    .toLowerCase() === 'monthly'
    ? 'monthly'
    : 'annual';
}

function paidAnnualPlan() {
  return parsePlanName(
    process.env.SUB_LIFECYCLE_PAID_ANNUAL_PLAN,
    'Overlay Strategists'
  );
}

const PLAN_ORDER: PlanName[] = [
  'Income Builder',
  'Overlay Strategists',
  'Portfolio Hedger',
  'Marketplace'
];

function higherPaidPlan(
  plan: PlanName
) {
  const planIndex =
    PLAN_ORDER.indexOf(
      plan
    );

  if (
    planIndex < 0 ||
    planIndex >= PLAN_ORDER.length - 1
  ) {
    return 'Marketplace';
  }

  return PLAN_ORDER[
    planIndex + 1
  ];
}

function oppositeInterval(
  interval: BillingInterval
): BillingInterval {
  return interval === 'annual'
    ? 'monthly'
    : 'annual';
}

function createdUsersFilePath() {
  return path.join(
    process.cwd(),
    'test-results',
    'created-stripe-users.json'
  );
}

function recordCreatedUser(
  entry: {
    scenario: string;
    email: string;
    mobileNumber: string;
    plan?: PlanName;
    interval?: BillingInterval;
    usedFor: string;
  }
) {
  const filePath =
    createdUsersFilePath();

  fs.mkdirSync(
    path.dirname(
      filePath
    ),
    {
      recursive: true
    }
  );

  let existing: unknown[] =
    [];

  if (
    fs.existsSync(
      filePath
    )
  ) {
    try {
      const parsed =
        JSON.parse(
          fs.readFileSync(
            filePath,
            'utf8'
          )
        );

      if (
        Array.isArray(
          parsed
        )
      ) {
        existing =
          parsed;
      }
    } catch {
      existing =
        [];
    }
  }

  existing.push({
    ...entry,
    password:
      TEST_USERS.onboarding.password,
    createdAt:
      new Date().toISOString()
  });

  fs.writeFileSync(
    filePath,
    `${JSON.stringify(existing, null, 2)}\n`
  );
}

function paidPlanBillingCopy(
  plan: PlanName,
  interval: BillingInterval
) {
  const price =
    String(
      PLAN_PRICES[plan][interval]
    ).replace(
      /\B(?=(\d{3})+(?!\d))/g,
      ',?'
    );

  return interval === 'monthly'
    ? new RegExp(
        `${price}|per month|monthly|subscription|total`,
        'i'
      )
    : new RegExp(
        `${price}|per year|annual|subscription|total|due`,
        'i'
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

  await waitForManualEmailVerification(
    page,
    email
  );

  await new LoginPage(
    page
  ).login(
    email,
    TEST_USERS.onboarding.password
  );

  await new RegistrationPage(
    page
  ).dismissMarketingOverlays();

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

  recordCreatedUser({
    scenario,
    email,
    mobileNumber,
    usedFor:
      'onboarding-to-plan-selection'
  });

  return {
    email,
    mobileNumber
  };
}

async function loginPreparedPaidUser(
  page: Page,
  options: {
    scenario: string;
    plan: PlanName;
    interval?: BillingInterval;
    usedFor: string;
  }
) {
  const forceDisposableUser =
    envEnabled(
      'SUB_LIFECYCLE_CREATE_DISPOSABLE_USER'
    );

  const reusePreparedUser =
    envEnabled(
      'SUB_LIFECYCLE_USE_PREPARED_USER'
    );

  const mutatingUsedFor =
    options.usedFor ===
      'upgrade-submit' ||
    options.usedFor ===
      'paid-purchase';

  const email =
    process.env.SUB_LIFECYCLE_PAID_EMAIL ??
    process.env.BILLING_MANAGEMENT_EMAIL ??
    TEST_USERS.subscriber.email;

  const password =
    process.env.SUB_LIFECYCLE_PAID_PASSWORD ??
    process.env.BILLING_MANAGEMENT_PASSWORD ??
    TEST_USERS.subscriber.password;

  if (
    !forceDisposableUser &&
    email &&
    password &&
    (
      reusePreparedUser ||
      !mutatingUsedFor
    )
  ) {
    await new LoginPage(
      page
    ).login(
      email,
      password
    );

    return;
  }

  await purchasePaidPlanForDisposableUser(
    page,
    options.scenario,
    options.plan,
    options.interval ??
      'monthly',
    options.usedFor
  );
}

async function validateDashboardAndBilling(
  page: Page,
  expectedTrialMode?: 'with-card' | 'without-card'
) {
  await new DashboardPage(
    page
  ).validateLoaded({
    acceptTrialSuccessMobileGate:
      expectedTrialMode ===
      'with-card'
  });

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

  await billing.validateOverview();
  await billing.validateOverviewContract();
}

const PAID_PLAN_LADDER: PlanName[] = [
  'Income Builder',
  'Overlay Strategists',
  'Portfolio Hedger',
  'Marketplace'
];

async function openPlanChangePreview(
  billing: BillingPage,
  targetPlan: PlanName,
  interval: BillingInterval,
  preferredAction: 'upgrade' | 'interval'
) {
  const actions: Array<'upgrade' | 'interval'> =
    preferredAction ===
      'interval'
      ? [
          'interval',
          'upgrade'
        ]
      : [
          'upgrade',
          'interval'
        ];

  let lastError: unknown;

  for (const action of actions) {
    try {
      await billing.openPlanChangeCalculationPreview({
        targetPlan,
        action,
        interval
      });

      return action;
    } catch (error) {
      lastError =
        error;
    }
  }

  throw lastError ??
    new Error(
      `No ${interval} upgrade or interval action for ${targetPlan}`
    );
}

async function submitUpgradeWithDueAndRenewal(
  page: Page,
  targetPlan: PlanName,
  interval: BillingInterval,
  preferredAction: 'upgrade' | 'interval' = 'upgrade'
) {
  const billing =
    new BillingPage(
      page
    );

  let action: 'upgrade' | 'interval';

  try {
    action =
      await openPlanChangePreview(
        billing,
        targetPlan,
        interval,
        preferredAction
      );
  } catch {
    return false;
  }

  await billing.validatePlanChangeDueAmountAndRenewal({
    targetPlan,
    action,
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
    action
  });

  if (
    /checkout\.stripe\.com/i.test(
      page.url()
    )
  ) {
    await new StripePaymentPage(
      page
    ).completePayment();

    await validateDashboardAndBilling(
      page
    );
  }

  await billing.validateActivePlan(
    targetPlan
  );

  return true;
}

async function purchasePaidPlanForDisposableUser(
  page: Page,
  scenario: string,
  plan: PlanName,
  interval: BillingInterval,
  usedFor = 'paid-purchase'
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
      paidPlanBillingCopy(
        plan,
        interval
      )
  });

  await new StripePaymentPage(
    page
  ).completePayment();

  await validateDashboardAndBilling(
    page
  );

  await new BillingPage(
    page
  ).validateActivePlan(
    plan
  );

  recordCreatedUser({
    scenario,
    email:
      user.email,
    mobileNumber:
      user.mobileNumber,
    plan,
    interval,
    usedFor
  });
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
      'With-card trial creates a new disposable user and starts a Stripe test-mode trial. QA-CL-005: use a unique test card so the once-per-lifetime gate does not refuse the offer.',
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
        ).completeTrialPayment();

        await continueAfterWithCardTrialCheckout(
          page,
          user.mobileNumber
        ).then(
          (reachedDashboard) => {
            if (!reachedDashboard) {
              throw new Error(
                'QA-CL-005: with-card trial bounced to Plan Selection. Use a unique Stripe test card per fresh user.'
              );
            }
          }
        );

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
      'Disposable user can purchase Overlay Strategists monthly and reach Billing',
      'SUB_LIFECYCLE_OVERLAY_MONTHLY_ENABLED',
      'Paid Overlay Strategists purchase creates a new disposable user and submits Stripe test payment.',
      async ({ page }) => {
        await purchasePaidPlanForDisposableUser(
          page,
          'sub-lifecycle-overlay-monthly',
          'Overlay Strategists',
          'monthly'
        );
      }
    );

    controlledLifecycleTest(
      'Disposable user can purchase Portfolio Hedger monthly and reach Billing',
      'SUB_LIFECYCLE_PORTFOLIO_MONTHLY_ENABLED',
      'Paid Portfolio Hedger purchase creates a new disposable user and submits Stripe test payment.',
      async ({ page }) => {
        await purchasePaidPlanForDisposableUser(
          page,
          'sub-lifecycle-portfolio-monthly',
          'Portfolio Hedger',
          'monthly'
        );
      }
    );

    controlledLifecycleTest(
      'Disposable user can purchase Marketplace monthly and reach Billing',
      'SUB_LIFECYCLE_MARKETPLACE_MONTHLY_ENABLED',
      'Paid Marketplace purchase creates a new disposable user and submits Stripe test payment.',
      async ({ page }) => {
        await purchasePaidPlanForDisposableUser(
          page,
          'sub-lifecycle-marketplace-monthly',
          'Marketplace',
          'monthly'
        );
      }
    );

    controlledLifecycleTest(
      'Disposable user can purchase configured paid annual plan and reach Billing',
      'SUB_LIFECYCLE_PAID_ANNUAL_ENABLED',
      'Annual paid purchase creates a new disposable user and submits Stripe test payment. Set SUB_LIFECYCLE_PAID_ANNUAL_PLAN to choose the plan.',
      async ({ page }) => {
        const plan =
          paidAnnualPlan();

        await purchasePaidPlanForDisposableUser(
          page,
          `sub-lifecycle-${plan.toLowerCase().replace(/\s+/g, '-')}-annual`,
          plan,
          'annual'
        );
      }
    );

    controlledLifecycleTest(
      'Prepared paid user exposes upgrade downgrade and interval controls',
      'SUB_LIFECYCLE_PLAN_CONTROLS_ENABLED',
      'Plan controls reuse the existing paid subscriber unless SUB_LIFECYCLE_CREATE_DISPOSABLE_USER=true.',
      async ({ page }) => {
        await loginPreparedPaidUser(
          page,
          {
            scenario:
              'sub-lifecycle-plan-controls',
            plan:
              'Income Builder',
            interval:
              'monthly',
            usedFor:
              'plan-controls'
          }
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
      'Upgrade preview reuses the existing paid subscriber unless SUB_LIFECYCLE_CREATE_DISPOSABLE_USER=true.',
      async ({ page }) => {
        const targetPlan =
          upgradeTargetPlan();

        const intervals =
          upgradeIntervals();

        await loginPreparedPaidUser(
          page,
          {
            scenario:
              'sub-lifecycle-upgrade-preview',
            plan:
              'Income Builder',
            interval:
              'monthly',
            usedFor:
              'upgrade-preview'
          }
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
      'Creates a disposable Income Builder user, accepts terms, and submits the upgrade. Use a fixture email only if you want to mutate an existing account.',
      async ({ page }) => {
        const targetPlan =
          submitUpgradeTargetPlan();

        const interval =
          submitUpgradeInterval();

        await loginPreparedPaidUser(
          page,
          {
            scenario:
              'sub-lifecycle-upgrade-submit',
            plan:
              'Income Builder',
            interval:
              interval,
            usedFor:
              'upgrade-submit'
          }
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
      'Prepared paid user can preview downgrade calculations without submitting',
      'SUB_LIFECYCLE_DOWNGRADE_PREVIEW_ENABLED',
      'Downgrade preview creates a higher-tier disposable paid user when no fixture is set and does not submit the plan change.',
      async ({ page }) => {
        const targetPlan =
          downgradeTargetPlan();

        const intervals =
          downgradeIntervals();

        await loginPreparedPaidUser(
          page,
          {
            scenario:
              'sub-lifecycle-downgrade-preview',
            plan:
              higherPaidPlan(
                targetPlan
              ),
            interval:
              intervals[0] ??
              'monthly',
            usedFor:
              'downgrade-preview'
          }
        );

        const billing =
          new BillingPage(
            page
          );

        for (const interval of intervals) {
          await billing.openPlanChangeCalculationPreview({
            targetPlan,
            action: 'downgrade',
            interval
          });

          await billing.validatePlanChangeCalculationPreview({
            targetPlan,
            action: 'downgrade',
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

          await billing.validatePlanChangeTermsRequired({
            targetPlan,
            action: 'downgrade'
          });

          await billing.validateDowngradeImpactCopyIfPresent({
            targetPlan,
            action: 'downgrade'
          });

          await billing.closePlanChangeCalculationPreview({
            targetPlan,
            action: 'downgrade'
          });
        }
      }
    );

    controlledLifecycleTest(
      'Prepared paid user can preview billing interval change without submitting',
      'SUB_LIFECYCLE_INTERVAL_PREVIEW_ENABLED',
      'Interval preview reuses the existing paid subscriber unless SUB_LIFECYCLE_CREATE_DISPOSABLE_USER=true and does not submit the change.',
      async ({ page }) => {
        const targetPlan =
          intervalPreviewTargetPlan();

        const interval =
          intervalPreviewTarget();

        await loginPreparedPaidUser(
          page,
          {
            scenario:
              'sub-lifecycle-interval-preview',
            plan:
              targetPlan,
            interval:
              oppositeInterval(
                interval
              ),
            usedFor:
              'interval-preview'
          }
        );

        const billing =
          new BillingPage(
            page
          );

        await billing.openPlanChangeCalculationPreview({
          targetPlan,
          action: 'interval',
          interval
        });

        await billing.validatePlanChangeCalculationPreview({
          targetPlan,
          action: 'interval',
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

        await billing.validatePlanChangeTermsRequired({
          targetPlan,
          action: 'interval'
        });

        await billing.closePlanChangeCalculationPreview({
          targetPlan,
          action: 'interval'
        });
      }
    );

    controlledLifecycleTest(
      'Prepared paid user exposes non-destructive cancellation form',
      'SUB_LIFECYCLE_CANCEL_FORM_ENABLED',
      'Cancellation form validation is non-destructive. Creates a disposable paid user when no fixture is set.',
      async ({ page }) => {
        await loginPreparedPaidUser(
          page,
          {
            scenario:
              'sub-lifecycle-cancel-form',
            plan:
              'Income Builder',
            interval:
              'monthly',
            usedFor:
              'cancel-form'
          }
        );

        await new BillingPage(
          page
        ).validateCancelSubscriptionFormWithoutCancelling();
      }
    );

    controlledLifecycleTest(
      'Disposable user climbs every monthly then yearly plan and sees yearly cancel options',
      'SUB_LIFECYCLE_PLAN_LADDER_ENABLED',
      'Creates one disposable Income Builder monthly user, submits an upgrade to each higher monthly plan, switches to annual, upgrades remaining yearly plans, and inspects yearly cancel-at-expiry vs refund options without submitting cancel. Enable SUB_LIFECYCLE_PLAN_LADDER_ENABLED=true.',
      async ({ page }) => {
        test.setTimeout(
          45 * 60 * 1000
        );

        await purchasePaidPlanForDisposableUser(
          page,
          'sub-lifecycle-plan-ladder',
          'Income Builder',
          'monthly',
          'plan-ladder'
        );

        let currentPlan: PlanName =
          'Income Builder';

        for (const targetPlan of PAID_PLAN_LADDER.slice(1)) {
          await test.step(
            `Upgrade to ${targetPlan} monthly and validate due amount and renewal`,
            async () => {
              const upgraded =
                await submitUpgradeWithDueAndRenewal(
                  page,
                  targetPlan,
                  'monthly',
                  'upgrade'
                );

              if (upgraded) {
                currentPlan =
                  targetPlan;
                return;
              }

              console.log(
                `${targetPlan} monthly is not offered or has no upgrade action; skipping.`
              );
            }
          );
        }

        await test.step(
          `Switch ${currentPlan} to yearly and validate due amount and renewal`,
          async () => {
            const switched =
              await submitUpgradeWithDueAndRenewal(
                page,
                currentPlan,
                'annual',
                'interval'
              );

            expect(
              switched,
              `Should be able to switch ${currentPlan} from monthly to yearly.`
            ).toBeTruthy();
          }
        );

        const annualStart =
          PAID_PLAN_LADDER.indexOf(
            currentPlan
          );

        for (const targetPlan of PAID_PLAN_LADDER.slice(annualStart + 1)) {
          await test.step(
            `Upgrade to ${targetPlan} yearly and validate due amount and renewal`,
            async () => {
              const upgraded =
                await submitUpgradeWithDueAndRenewal(
                  page,
                  targetPlan,
                  'annual',
                  'upgrade'
                );

              if (upgraded) {
                currentPlan =
                  targetPlan;
                return;
              }

              console.log(
                `${targetPlan} yearly is not offered or has no upgrade action; skipping.`
              );
            }
          );
        }

        await test.step(
          'Yearly cancel offers cancel at expiry or cancel immediately with refund',
          async () => {
            await new BillingPage(
              page
            ).validateYearlyCancellationOptions();
          }
        );
      }
    );

    controlledLifecycleTest(
      'Disposable monthly user sees downgrade retention offer',
      'SUB_LIFECYCLE_PLAN_LADDER_ENABLED',
      'Creates a disposable Overlay Strategists monthly user and opens a downgrade to Income Builder to validate the one-time 3-month retention offer without scheduling the downgrade.',
      async ({ page }) => {
        await purchasePaidPlanForDisposableUser(
          page,
          'sub-lifecycle-retention-offer',
          'Overlay Strategists',
          'monthly',
          'retention-offer'
        );

        await new BillingPage(
          page
        ).validateMonthlyDowngradeRetentionOffer(
          'Income Builder'
        );
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

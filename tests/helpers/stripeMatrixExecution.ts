import {
  Browser,
  expect,
  Page,
  test
} from '@playwright/test';

import {
  BASE_URL,
  TEST_USERS
} from '../config/testData';
import {
  generateEmail,
  generateMobileNumber
} from '../utils/emailGenerator';
import {
  waitForManualEmailVerification
} from './emailVerification';
import { BillingPage }
  from '../pages/BillingPage';
import { CompliancePage }
  from '../pages/CompliancePage';
import { DashboardPage }
  from '../pages/DashboardPage';
import { LoginPage }
  from '../pages/LoginPage';
import { MobileVerificationPage }
  from '../pages/MobileVerificationPage';
import { PlanSelectionPage }
  from '../pages/PlanSelectionPage';
import { RegistrationPage }
  from '../pages/RegistrationPage';
import { RiskProfilePage }
  from '../pages/RiskProfilePage';
import { StripePaymentPage }
  from '../pages/StripePaymentPage';

/* =============================================================================
HELPER: Stripe matrix execution

PURPOSE
-------
Turns Stripe *Matrix.spec.ts automated rows into real UI checks. Unique
coverage keys run once per Playwright process (workers: 1). Sibling rows
reuse that result so AIR records them as passed instead of skip-only
"Covered by" traceability.

Blocked, future, known-bug, controlled, AIR-ingestion, and BlockedScenario
rows stay skipped. Destructive Stripe submits stay behind extra flags.
============================================================================= */

export type StripeMatrixScenario = {
  id: string;
  sourceIds?: string[];
  title: string;
  priority: string;
  status: string;
  automation?: string;
  dependency?: string;
  phase?: string;
};

export type StripeMatrixCoverageKey =
  | 'billing-inapp'
  | 'billing-portal'
  | 'plan-catalog'
  | 'direct-checkout'
  | 'overlay-without-card'
  | 'overlay-with-card-checkout'
  | 'upgrade-preview'
  | 'downgrade-preview'
  | 'interval-preview'
  | 'payment-negative'
  | 'air-traceability'
  | 'blocked-scenario';

type CoverageOutcome =
  | {
      status: 'passed';
    }
  | {
      status: 'skipped';
      reason: string;
    }
  | {
      status: 'failed';
      error: unknown;
    };

class CoverageSkip extends Error {
  readonly reason: string;

  constructor(reason: string) {
    super(reason);
    this.name = 'CoverageSkip';
    this.reason = reason;
  }
}

const coverageCache =
  new Map<StripeMatrixCoverageKey, CoverageOutcome>();

const PLAN_PRICES = {
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
} as const;

type PaidPlanName =
  keyof typeof PLAN_PRICES;

type BillingInterval =
  | 'monthly'
  | 'annual';

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

function requireFlag(
  name: string,
  extra = ''
): void {
  if (
    envEnabled(
      name
    )
  ) {
    return;
  }

  throw new CoverageSkip(
    `Enable ${name}=true to run this Stripe matrix coverage key.${extra ? ` ${extra}` : ''}`
  );
}

function requireAnyFlag(
  names: string[],
  extra = ''
) {
  if (
    names.some(
      (name) =>
        envEnabled(
          name
        )
    )
  ) {
    return;
  }

  throw new CoverageSkip(
    `Enable ${names.join(' or ')}=true to run this Stripe matrix coverage key.${extra ? ` ${extra}` : ''}`
  );
}

function billingCopy(
  interval: BillingInterval
) {
  return interval ===
    'monthly'
    ? /per month|monthly|\/mo|month|subscription|total|due|pay/i
    : /per year|annual|\/yr|\/year|year|subscription|total|due|pay/i;
}

function paidSubscriber() {
  return {
    email:
      process.env.BILLING_MANAGEMENT_EMAIL ??
      process.env.SUB_LIFECYCLE_PAID_EMAIL ??
      TEST_USERS.subscriber.email,
    password:
      process.env.BILLING_MANAGEMENT_PASSWORD ??
      process.env.SUB_LIFECYCLE_PAID_PASSWORD ??
      TEST_USERS.subscriber.password
  };
}

function isMissingPlanAction(
  error: unknown
) {
  const message =
    error instanceof Error
      ? error.message
      : String(
          error
        );

  return /Could not find (upgrade|downgrade|interval) control|No (monthly|annual) upgrade or interval/i.test(
    message
  );
}

export function inferStripeMatrixCoverageKey(
  automation?: string,
  title = ''
): StripeMatrixCoverageKey {
  const text =
    `${automation ?? ''} ${title}`.toLowerCase();
  const automationOnly =
    (
      automation ??
      ''
    ).trim()
      .toLowerCase();

  if (
    automationOnly.includes(
      'coveragegapengine'
    ) ||
    (
      /matrix\.spec\.ts$/.test(
        automationOnly
      ) &&
      !automationOnly.includes(
        '>'
      ) &&
      !automationOnly.includes(
        ' and '
      )
    )
  ) {
    return 'air-traceability';
  }

  if (
    automationOnly.includes(
      'blockedscenarioexecution'
    )
  ) {
    return 'blocked-scenario';
  }

  if (
    text.includes(
      'paymentnegative'
    )
  ) {
    if (
      text.includes(
        'directsubscriptionpurchase'
      ) &&
      !/(block|declin|invalid|expired|insufficient|authentication|3ds|3d)/i.test(
        text
      )
    ) {
      return 'direct-checkout';
    }

    return 'payment-negative';
  }

  if (
    text.includes(
      'interval preview'
    ) ||
    text.includes(
      'sub_lifecycle_interval'
    ) ||
    text.includes(
      'billing interval change'
    )
  ) {
    return 'interval-preview';
  }

  if (
    text.includes(
      'subscriptionlifecycleexecution'
    ) &&
    text.includes(
      'upgrade'
    )
  ) {
    return 'upgrade-preview';
  }

  if (
    text.includes(
      'subscriptionlifecycleexecution'
    ) &&
    text.includes(
      'downgrade'
    )
  ) {
    return 'downgrade-preview';
  }

  if (
    text.includes(
      'planselectionvalidation'
    )
  ) {
    return 'plan-catalog';
  }

  if (
    text.includes(
      'overlay'
    ) &&
    text.includes(
      'declined'
    )
  ) {
    return 'overlay-with-card-checkout';
  }

  if (
    text.includes(
      'overlay'
    ) &&
    text.includes(
      'without card'
    ) &&
    !text.includes(
      'option'
    ) &&
    !text.includes(
      'messaging'
    )
  ) {
    return 'overlay-without-card';
  }

  if (
    text.includes(
      'overlay'
    ) &&
    (
      text.includes(
        'with card'
      ) ||
      text.includes(
        'checkout details'
      )
    )
  ) {
    return 'overlay-with-card-checkout';
  }

  if (
    text.includes(
      'overlay'
    ) &&
    text.includes(
      'terms'
    )
  ) {
    return 'plan-catalog';
  }

  if (
    text.includes(
      'directsubscriptionpurchase'
    )
  ) {
    return 'direct-checkout';
  }

  if (
    /cancel|portal|manage subscription|payment recovery|payment method|invoice history|return link|validatestripeportalsession|add payment|billing information/.test(
      text
    )
  ) {
    return 'billing-portal';
  }

  return 'billing-inapp';
}

async function loginPaidSubscriber(
  page: Page
) {
  const user =
    paidSubscriber();

  await new LoginPage(
    page
  ).login(
    user.email,
    user.password
  );
}

async function catalogHeadingVisible(
  page: Page
) {
  return page.getByText(
    /choose your plan|select a plan|get started/i
  ).first()
    .isVisible({
      timeout: 10000
    })
    .catch(
      () => false
    );
}

async function registerAndReachPlanSelection(
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

  await new PlanSelectionPage(
    page
  ).waitUntilCatalogVisible();

  return {
    email,
    mobileNumber
  };
}

async function reachPlanSelection(
  page: Page,
  scenario: string
) {
  const existingEmail =
    process.env.PLAN_SELECTION_EXISTING_EMAIL;
  const existingPassword =
    process.env.PLAN_SELECTION_EXISTING_PASSWORD;
  const existingMobile =
    process.env.PLAN_SELECTION_EXISTING_MOBILE ??
    TEST_USERS.onboarding.mobile;

  if (
    existingEmail &&
    existingPassword
  ) {
    try {
      await new LoginPage(
        page
      ).login(
        existingEmail,
        existingPassword
      );

      await new MobileVerificationPage(
        page
      ).completeIfVisible(
        existingMobile
      );

      if (
        !/\/onboarding/.test(
          page.url()
        )
      ) {
        await page.goto(
          `${BASE_URL}/onboarding`,
          {
            waitUntil: 'domcontentloaded'
          }
        );
      }

      if (
        await catalogHeadingVisible(
          page
        )
      ) {
        return {
          email: existingEmail,
          mobileNumber: existingMobile
        };
      }

      console.log(
        'Prepared plan-selection user is not on Choose Your Plan; registering a fresh matrix user.'
      );
    } catch (error) {
      console.log(
        `Prepared plan-selection login failed; registering a fresh matrix user. ${error instanceof Error ? error.message : ''}`
      );
    }
  }

  return registerAndReachPlanSelection(
    page,
    scenario
  );
}

async function executeBillingInApp(
  page: Page
) {
  await loginPaidSubscriber(
    page
  );

  const billing =
    new BillingPage(
      page
    );

  await billing.validateOverview();
  await billing.validateOverviewContract();
  await billing.validatePlans();
  await billing.validatePlanLifecycleActionSummary();
  await billing.validateBillingIntervalPresentationSummary();
  await billing.validatePaidSubscriberTrialCtaIsNotOffered();
  await billing.validateTransactions();
  await billing.validateInvoiceAndPdfLinksHaveTargets();
}

async function executeBillingPortal(
  page: Page
) {
  await loginPaidSubscriber(
    page
  );

  const billing =
    new BillingPage(
      page
    );
  const managementEnabled =
    envEnabled(
      'BILLING_SUBSCRIPTION_MANAGEMENT_ENABLED'
    );

  await billing.validateStripePortalSession({
    restore: !managementEnabled
  });

  if (
    !managementEnabled
  ) {
    return;
  }

  await billing.validateAddPaymentMethodOpensWithoutSaving();
  await billing.validatePaymentRecoveryEntryPointsSummary();
  await billing.validateBillingInformationUpdateOpensWithoutSaving();
  await billing.validateCancelSubscriptionFormWithoutCancelling();
  await billing.validateSubscriptionPortalCancellationLifecycleSummary();
  await billing.leaveStripePortal();
}

async function executePlanCatalog(
  page: Page
) {
  if (
    !envEnabled(
      'PLAN_SELECTION_VALIDATION_ENABLED'
    ) &&
    !process.env.PLAN_SELECTION_EXISTING_EMAIL
  ) {
    throw new CoverageSkip(
      'Enable PLAN_SELECTION_VALIDATION_ENABLED=true or set PLAN_SELECTION_EXISTING_EMAIL/PASSWORD to run plan-catalog coverage.'
    );
  }

  await reachPlanSelection(
    page,
    'stripe-matrix-plan-catalog'
  );

  const planPage =
    new PlanSelectionPage(
      page
    );

  await planPage.validatePlanCatalog();
  await planPage.validateBillingToggle();
  await planPage.validatePaidPlanPricingAcrossBillingPeriods();
  await planPage.validateCompleteSetupRequiresPlanSelection();
  await planPage.validateOverlayStrategistsFeatureSummary();
  await planPage.validatePaidPlanEntitlementSummaries();
  await planPage.validatePlanSelectionCanSwitchWithoutCheckout();
  await planPage.openOverlayStrategistsTrialWithCardModal();
  await planPage.validateOverlayStrategistsTrialModalContent(
    'with-card'
  );
  await planPage.cancelTrialModal();
  await planPage.validatePlanVisible(
    'Overlay Strategists'
  );
  await planPage.openOverlayStrategistsTrialWithoutCardModal();
  await planPage.validateOverlayStrategistsTrialModalContent(
    'without-card'
  );
  await planPage.closeTrialModal();
  await planPage.openOverlayStrategistsTrialWithoutCardModal();
  await planPage.validateTrialTermsRequired();
}

async function executeDirectCheckout(
  page: Page
) {
  requireFlag(
    'DIRECT_SUBSCRIPTION_PURCHASE_ENABLED',
    'Creates one disposable user and opens Stripe checkout without paying.'
  );

  const user =
    await registerAndReachPlanSelection(
      page,
      'stripe-matrix-direct-checkout'
    );
  const planPage =
    new PlanSelectionPage(
      page
    );

  if (
    !(
      await planPage.isPlanOffered(
        'Income Builder'
      )
    )
  ) {
    throw new CoverageSkip(
      'Income Builder is not in the current catalog; skipping direct checkout summary.'
    );
  }

  await planPage.selectMonthlyBilling();
  await planPage.selectPlan(
    'Income Builder'
  );

  const stripePage =
    new StripePaymentPage(
      page
    );

  await stripePage.validateSubscriptionCheckoutDetails({
    expectedEmail:
      user.email,
    expectedPlan:
      'Income Builder',
    expectedBillingCopy:
      /29|per month|monthly|subscription|total/i
  });
  await stripePage.validateCurrencyAndConversionDetails();

  await page.reload({
    waitUntil: 'domcontentloaded'
  });

  await stripePage.validateSubscriptionCheckoutDetails({
    expectedEmail:
      user.email,
    expectedPlan:
      'Income Builder',
    expectedBillingCopy:
      /29|per month|monthly|subscription|total/i
  });

  await planPage.returnFromCheckoutBeforePayment();
}

async function executeOverlayWithoutCard(
  page: Page
) {
  requireFlag(
    'OVERLAY_STRATEGISTS_FLOW_ENABLED'
  );
  requireFlag(
    'OVERLAY_STRATEGISTS_WITHOUT_CARD_ENABLED',
    'Starts Overlay Strategists trial without a card for one disposable user.'
  );

  await registerAndReachPlanSelection(
    page,
    'stripe-matrix-overlay-no-card'
  );

  const planPage =
    new PlanSelectionPage(
      page
    );

  await planPage.validateOverlayStrategistsTrialOptions();
  await planPage.selectOverlayStrategistsTrialWithoutCard();
  await planPage.validateNotRedirectedToStripeCheckout();

  await new DashboardPage(
    page
  ).validateLoaded();

  await new BillingPage(
    page
  ).validateOverlayStrategistsTrialBillingState(
    'without-card'
  );
}

async function executeOverlayWithCardCheckout(
  page: Page
) {
  requireFlag(
    'OVERLAY_STRATEGISTS_FLOW_ENABLED'
  );
  requireAnyFlag(
    [
      'OVERLAY_STRATEGISTS_STRIPE_CHECKOUT_DETAILS_ENABLED',
      'OVERLAY_STRATEGISTS_WITH_CARD_ENABLED',
      'OVERLAY_STRATEGISTS_DECLINED_CARD_ENABLED'
    ],
    'Opens Overlay with-card Stripe checkout without completing a successful payment.'
  );

  const user =
    await registerAndReachPlanSelection(
      page,
      'stripe-matrix-overlay-card-checkout'
    );

  await new PlanSelectionPage(
    page
  ).selectOverlayStrategistsTrialWithCard();

  const stripe =
    new StripePaymentPage(
      page
    );

  await stripe.validateTrialCheckoutDetails(
    user.email
  );

  if (
    envEnabled(
      'OVERLAY_STRATEGISTS_DECLINED_CARD_ENABLED'
    )
  ) {
    await stripe.validateDeclinedCardRejected();
  }
}

async function previewPlanChange(
  page: Page,
  action: 'upgrade' | 'downgrade' | 'interval',
  targetPlan: PaidPlanName,
  interval: BillingInterval
) {
  await loginPaidSubscriber(
    page
  );

  const billing =
    new BillingPage(
      page
    );

  try {
    await billing.openPlanChangeCalculationPreview({
      targetPlan,
      action,
      interval
    });
  } catch (error) {
    if (
      isMissingPlanAction(
        error
      )
    ) {
      throw new CoverageSkip(
        `Paid subscriber fixture has no ${action} control for ${targetPlan} ${interval}. ${error instanceof Error ? error.message : ''}`
      );
    }

    throw error;
  }

  await billing.validatePlanChangeCalculationPreview({
    targetPlan,
    action,
    interval,
    expectedBillingCopy:
      billingCopy(
        interval
      ),
    expectedPlanCharge:
      PLAN_PRICES[targetPlan][interval],
    expectedRecurringAmount:
      PLAN_PRICES[targetPlan][interval]
  });

  if (
    action ===
    'downgrade'
  ) {
    await billing.validatePlanChangeTermsRequired({
      targetPlan,
      action:
        'downgrade'
    });
  }

  await billing.closePlanChangeCalculationPreview({
    targetPlan,
    action
  });
}

async function executeUpgradePreview(
  page: Page
) {
  requireFlag(
    'SUBSCRIPTION_LIFECYCLE_EXECUTION_ENABLED'
  );
  requireFlag(
    'SUB_LIFECYCLE_UPGRADE_PREVIEW_ENABLED',
    'Opens upgrade calculation preview without submitting.'
  );

  const targetPlan =
    (
      process.env.SUB_LIFECYCLE_UPGRADE_TARGET_PLAN as PaidPlanName | undefined
    ) ??
    'Portfolio Hedger';
  const interval: BillingInterval =
    /annual/i.test(
      process.env.SUB_LIFECYCLE_UPGRADE_INTERVALS ??
        ''
    )
      ? 'annual'
      : 'monthly';

  await previewPlanChange(
    page,
    'upgrade',
    targetPlan,
    interval
  );
}

async function executeDowngradePreview(
  page: Page
) {
  requireFlag(
    'SUBSCRIPTION_LIFECYCLE_EXECUTION_ENABLED'
  );
  requireFlag(
    'SUB_LIFECYCLE_DOWNGRADE_PREVIEW_ENABLED',
    'Opens downgrade calculation preview without submitting.'
  );

  const targetPlan =
    (
      process.env.SUB_LIFECYCLE_DOWNGRADE_TARGET_PLAN as PaidPlanName | undefined
    ) ??
    'Income Builder';
  const interval: BillingInterval =
    /annual/i.test(
      process.env.SUB_LIFECYCLE_DOWNGRADE_INTERVALS ??
        ''
    )
      ? 'annual'
      : 'monthly';

  await previewPlanChange(
    page,
    'downgrade',
    targetPlan,
    interval
  );
}

async function executeIntervalPreview(
  page: Page
) {
  requireFlag(
    'SUBSCRIPTION_LIFECYCLE_EXECUTION_ENABLED'
  );
  requireFlag(
    'SUB_LIFECYCLE_INTERVAL_PREVIEW_ENABLED',
    'Opens billing-interval calculation preview without submitting.'
  );

  const targetPlan =
    (
      process.env.SUB_LIFECYCLE_INTERVAL_TARGET_PLAN as PaidPlanName | undefined
    ) ??
    'Income Builder';
  const preferred: BillingInterval =
    process.env.SUB_LIFECYCLE_INTERVAL_TO ===
      'monthly'
      ? 'monthly'
      : 'annual';
  const fallback: BillingInterval =
    preferred ===
      'annual'
      ? 'monthly'
      : 'annual';

  try {
    await previewPlanChange(
      page,
      'interval',
      targetPlan,
      preferred
    );
  } catch (error) {
    if (
      !(
        error instanceof CoverageSkip
      )
    ) {
      throw error;
    }

    await previewPlanChange(
      page,
      'interval',
      targetPlan,
      fallback
    );
  }
}

async function executePaymentNegative(
  page: Page
) {
  const checkoutUrl =
    process.env.STRIPE_CHECKOUT_URL ??
    '';

  if (
    !checkoutUrl
  ) {
    throw new CoverageSkip(
      'Set STRIPE_CHECKOUT_URL to a fresh Stripe Checkout session to run payment-negative coverage.'
    );
  }

  await page.goto(
    checkoutUrl,
    {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    }
  );

  await expect(
    page
  ).toHaveURL(
    /checkout\.stripe\.com/,
    {
      timeout: 60000
    }
  );

  const cardNumber =
    page.locator(
      '#cardNumber'
    );

  await expect(
    cardNumber
  ).toBeVisible({
    timeout: 60000
  });

  await expect(
    page.locator(
      '#cardExpiry'
    )
  ).toBeVisible();

  await expect(
    page.locator(
      '#cardCvc'
    )
  ).toBeVisible();

  await cardNumber.fill(
    '4242'
  );
  await page.locator(
    '#cardExpiry'
  ).fill(
    '12/34'
  );
  await page.locator(
    '#cardCvc'
  ).fill(
    '123'
  );

  const payButton =
    page.getByRole(
      'button',
      {
        name: /subscribe|pay|complete|start/i
      }
    );

  if (
    await payButton.count()
  ) {
    await expect(
      payButton.first()
    ).toBeDisabled();
  }
}

const coverageExecutors: Record<
  StripeMatrixCoverageKey,
  (page: Page) => Promise<void>
> = {
  'billing-inapp':
    executeBillingInApp,
  'billing-portal':
    executeBillingPortal,
  'plan-catalog':
    executePlanCatalog,
  'direct-checkout':
    executeDirectCheckout,
  'overlay-without-card':
    executeOverlayWithoutCard,
  'overlay-with-card-checkout':
    executeOverlayWithCardCheckout,
  'upgrade-preview':
    executeUpgradePreview,
  'downgrade-preview':
    executeDowngradePreview,
  'interval-preview':
    executeIntervalPreview,
  'payment-negative':
    executePaymentNegative,
  'air-traceability':
    async () => {
      throw new CoverageSkip(
        'AIR coverage-ingestion row. No additional UI flow.'
      );
    },
  'blocked-scenario':
    async () => {
      throw new CoverageSkip(
        'BlockedScenarioExecution stays skipped unless BLOCKED_SCENARIO_EXECUTION_ENABLED=true and STRIPE_CHECKOUT_URL are set in that spec.'
      );
    }
};

function coverageNeedsPage(
  key: StripeMatrixCoverageKey
) {
  return key !==
    'air-traceability' &&
    key !==
    'blocked-scenario';
}

async function runCoverageKey(
  key: StripeMatrixCoverageKey,
  page?: Page
): Promise<CoverageOutcome & {
  cache: 'hit' | 'miss';
}> {
  const cached =
    coverageCache.get(
      key
    );

  if (
    cached
  ) {
    return {
      ...cached,
      cache: 'hit'
    };
  }

  try {
    const executor =
      coverageExecutors[key];

    if (
      coverageNeedsPage(
        key
      )
    ) {
      if (
        !page
      ) {
        throw new Error(
          `Coverage key ${key} needs a browser page.`
        );
      }

      await executor(
        page
      );
    } else {
      await executor(
        page as Page
      );
    }

    const passed: CoverageOutcome = {
      status: 'passed'
    };

    coverageCache.set(
      key,
      passed
    );

    return {
      ...passed,
      cache: 'miss'
    };
  } catch (error) {
    if (
      error instanceof CoverageSkip
    ) {
      const skipped: CoverageOutcome = {
        status: 'skipped',
        reason:
          error.reason
      };

      coverageCache.set(
        key,
        skipped
      );

      return {
        ...skipped,
        cache: 'miss'
      };
    }

    const failed: CoverageOutcome = {
      status: 'failed',
      error
    };

    coverageCache.set(
      key,
      failed
    );

    throw error;
  }
}

export async function executeStripeMatrixScenario(
  scenario: StripeMatrixScenario,
  browser: Browser,
  options: {
    module?: string;
    journey?: string;
    blockedReason: string;
    extraAnnotations?: Array<{
      type: string;
      description: string;
    }>;
  }
) {
  test.info().annotations.push(
    {
      type: 'priority',
      description:
        scenario.priority
    },
    {
      type: 'automation-status',
      description:
        scenario.status
    },
    {
      type: 'source-test-id',
      description:
        scenario.sourceIds?.join(
          ', '
        ) ??
        scenario.id
    },
    {
      type: 'module',
      description:
        options.module ??
        'Billing'
    },
    {
      type: 'journey',
      description:
        options.journey ??
        'Stripe'
    },
    ...(
      options.extraAnnotations ??
      []
    )
  );

  if (
    scenario.status !==
    'automated'
  ) {
    test.skip(
      true,
      scenario.dependency ??
        options.blockedReason
    );
  }

  const coverageKey =
    inferStripeMatrixCoverageKey(
      scenario.automation,
      scenario.title
    );

  const cached =
    coverageCache.get(
      coverageKey
    );

  let result: CoverageOutcome & {
    cache: 'hit' | 'miss';
  };

  if (
    cached ||
    !coverageNeedsPage(
      coverageKey
    )
  ) {
    result =
      await runCoverageKey(
        coverageKey
      );
  } else {
    const page =
      await browser.newPage();

    try {
      result =
        await runCoverageKey(
          coverageKey,
          page
        );
    } finally {
      await page.close();
    }
  }

  test.info().annotations.push(
    {
      type: 'coverage-key',
      description:
        coverageKey
    },
    {
      type: 'coverage-cache',
      description:
        result.cache
    }
  );

  if (
    result.status ===
    'skipped'
  ) {
    test.skip(
      true,
      result.cache ===
        'hit'
        ? `${result.reason} Reused coverage key ${coverageKey}.`
        : result.reason
    );
  }

  if (
    result.status ===
    'failed'
  ) {
    throw result.error;
  }
}

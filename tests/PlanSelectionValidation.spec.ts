import {
  Page,
  expect,
  test
} from '@playwright/test';

import {
  AUTH_SETTINGS,
  BASE_URL,
  TEST_USERS
} from './config/testData';
import {
  generateEmail,
  generateMobileNumber
} from './utils/emailGenerator';
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

/* =============================================================================
TEST SUITE: Plan Selection Validation

PURPOSE
-------
Validates onboarding plan-selection UI behavior without starting Stripe checkout
or consuming a trial. Stripe payment/lifecycle scenarios remain separate.

RUN
---
$env:PLAN_SELECTION_VALIDATION_ENABLED="true"
npx playwright test tests/PlanSelectionValidation.spec.ts --headed

Use PLAN_SELECTION_EXISTING_EMAIL/PASSWORD for a prepared user already on the
onboarding plan-selection step when registration SMS is throttled.
============================================================================= */

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

function getExistingPlanSelectionUser() {
  const email =
    process.env.PLAN_SELECTION_EXISTING_EMAIL;

  const password =
    process.env.PLAN_SELECTION_EXISTING_PASSWORD;

  const mobile =
    process.env.PLAN_SELECTION_EXISTING_MOBILE;

  if (
    !email ||
    !password
  ) {
    return undefined;
  }

  return {
    email,
    password,
    mobile:
      mobile ??
      TEST_USERS.onboarding.mobile
  };
}

const planSelectionValidationEnabled =
  envEnabled(
    'PLAN_SELECTION_VALIDATION_ENABLED'
  );

const planSelectionHasPreparedUser =
  Boolean(
    getExistingPlanSelectionUser()
  );

const planSelectionReadOnlyEnabled =
  planSelectionValidationEnabled ||
  planSelectionHasPreparedUser;

const planSelectionFreeActivationEnabled =
  envEnabled(
    'PLAN_SELECTION_FREE_ACTIVATION_ENABLED'
  );

async function openPlanSelection(
  page: Page,
  scenario: string,
  options: {
    useExistingUser?: boolean;
  } = {}
) {
  const existingUser =
    options.useExistingUser === false
      ? undefined
      : getExistingPlanSelectionUser();

  if (existingUser) {
    console.log(
      `${scenario} Existing plan-selection email:`,
      existingUser.email
    );

    const login =
      new LoginPage(
        page
      );

    try {
      await login.login(
        existingUser.email,
        existingUser.password
      );
    } catch (error) {
      test.skip(
        true,
        `Prepared plan-selection user could not log in. Refresh PLAN_SELECTION_EXISTING_EMAIL/PASSWORD before executing this fixture. ${error instanceof Error ? error.message : ''}`.trim()
      );
    }

    await new MobileVerificationPage(
      page
    ).completeIfVisible(
      existingUser.mobile
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

    const planSelectionHeading =
      page.getByText(
        /choose your plan|select a plan|get started/i
      ).first();

    const planSelectionVisible =
      await planSelectionHeading.isVisible({
        timeout: 10000
      }).catch(
        () => false
      );

    if (!planSelectionVisible) {
      test.skip(
        true,
        `Prepared plan-selection user is not currently on the Choose Your Plan step. Current URL: ${page.url()}. Refresh PLAN_SELECTION_EXISTING_EMAIL/PASSWORD with a user paused at plan selection or run the fresh-user plan flow.`
      );
    }

    return;
  }

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

  const registration =
    new RegistrationPage(
      page
    );

  await registration.open();

  await registration.register(
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

  const login =
    new LoginPage(
      page
    );

  await login.login(
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
}

if (
  planSelectionReadOnlyEnabled ||
  planSelectionFreeActivationEnabled
) {
  test.describe(
    'Plan Selection Validation',
    () => {

    test.describe.configure({
      timeout: 20 * 60 * 1000
    });

    if (planSelectionReadOnlyEnabled) {
      test(
        'Plan catalog, feature summary, and billing toggle are visible',
        async ({ page }) => {
        await openPlanSelection(
          page,
          'plan-toggle-validation'
        );

        const planPage =
          new PlanSelectionPage(
          page
        );

        await planPage.validatePlanCatalog();

        await planPage.validateBillingToggle();
        }
      );

      test(
        'Paid plan prices and actions remain available across billing periods',
        async ({ page }) => {
        await openPlanSelection(
          page,
          'plan-paid-pricing-periods'
        );

        await new PlanSelectionPage(
          page
        ).validatePaidPlanPricingAcrossBillingPeriods();
        }
      );

      test(
        'Complete Setup initial state is safe before checkout',
        async ({ page }) => {
        await openPlanSelection(
          page,
          'plan-complete-setup-guard'
        );

        const planPage =
          new PlanSelectionPage(
            page
          );

        await planPage.validateCompleteSetupRequiresPlanSelection();
        }
      );

      test(
        'Overlay Strategists feature limits and premium benefits are displayed',
        async ({ page }) => {
        await openPlanSelection(
          page,
          'plan-overlay-feature-summary'
        );

        const planPage =
          new PlanSelectionPage(
            page
          );

        await planPage.validateOverlayStrategistsFeatureSummary();
        }
      );

      test(
        'Paid plan entitlement limits are displayed before checkout',
        async ({ page }) => {
        await openPlanSelection(
          page,
          'plan-paid-entitlement-limits'
        );

        const planPage =
          new PlanSelectionPage(
            page
          );

        await planPage.validatePaidPlanEntitlementSummaries();
        }
      );

      test(
        'User can switch plan selections without launching Stripe checkout',
        async ({ page }) => {
        await openPlanSelection(
          page,
          'plan-selection-switching'
        );

        const planPage =
          new PlanSelectionPage(
            page
          );

        await planPage.validatePlanSelectionCanSwitchWithoutCheckout();
        }
      );

      test(
        'Overlay Strategists with-card trial explains card collection auto-renewal and cancellation',
        async ({ page }) => {
        await openPlanSelection(
          page,
          'plan-with-card-modal-validation'
        );

        const planPage =
          new PlanSelectionPage(
            page
          );

        await planPage.openOverlayStrategistsTrialWithCardModal();

        await planPage.validateOverlayStrategistsTrialModalContent(
          'with-card'
        );

        await planPage.cancelTrialModal();

        await planPage.validatePlanVisible(
          'Overlay Strategists'
        );
        }
      );

      test(
        'Overlay Strategists without-card trial explains Free plan fallback after expiry',
        async ({ page }) => {
        await openPlanSelection(
          page,
          'plan-without-card-modal-validation'
        );

        const planPage =
          new PlanSelectionPage(
            page
          );

        await planPage.openOverlayStrategistsTrialWithoutCardModal();

        await planPage.validateOverlayStrategistsTrialModalContent(
          'without-card'
        );

        await planPage.closeTrialModal();

        await planPage.validatePlanVisible(
          'Overlay Strategists'
        );
        }
      );

      test(
        'Overlay Strategists trial start requires terms acceptance',
        async ({ page }) => {
        await openPlanSelection(
          page,
          'plan-terms-validation'
        );

        const planPage =
          new PlanSelectionPage(
            page
          );

        await planPage.openOverlayStrategistsTrialWithoutCardModal();

        await planPage.validateTrialTermsRequired();
        }
      );
    }

    if (planSelectionFreeActivationEnabled) {
      test(
        'Curious Explorer free plan completes onboarding without Stripe',
        async ({ page }) => {
        const hasPreparedUser =
          Boolean(
            getExistingPlanSelectionUser()
          );

        await openPlanSelection(
          page,
          'plan-free-activation',
          {
            useExistingUser:
              hasPreparedUser
          }
        );

        const planPage =
          new PlanSelectionPage(
            page
          );

        await planPage.selectPlan(
          'Curious Explorer'
        );

        await expect(
          page
        ).not.toHaveURL(
          /checkout\.stripe\.com/
        );

        await new DashboardPage(
          page
        ).validateLoaded();
        }
      );
    }
    }
  );
}

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

async function openPlanSelection(
  page: Page,
  scenario: string
) {
  const existingUser =
    getExistingPlanSelectionUser();

  if (existingUser) {
    console.log(
      `${scenario} Existing plan-selection email:`,
      existingUser.email
    );

    const login =
      new LoginPage(
        page
      );

    await login.login(
      existingUser.email,
      existingUser.password
    );

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

    await expect(
      page.getByText(
        /choose your plan|select a plan|get started/i
      ).first()
    ).toBeVisible({
      timeout: 30000
    });

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

test.describe(
  'Plan Selection Validation',
  () => {

    test.describe.configure({
      timeout: 20 * 60 * 1000
    });

    test.skip(
      !envEnabled(
        'PLAN_SELECTION_VALIDATION_ENABLED'
      ),
      'Skipped because PLAN_SELECTION_VALIDATION_ENABLED is not configured.'
    );

    test(
      'Plan cards and monthly annual toggle are visible',
      async ({ page }) => {
        await openPlanSelection(
          page,
          'plan-toggle-validation'
        );

        const planPage =
          new PlanSelectionPage(
            page
          );

        await planPage.validatePlanVisible(
          'Curious Explorer'
        );

        await planPage.validatePlanVisible(
          'Income Builder'
        );

        await planPage.validatePlanVisible(
          'Overlay Strategists'
        );

        await planPage.validateBillingToggle();
      }
    );

    test(
      'Overlay Strategists with-card trial modal content and cancel behavior',
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
      'Overlay Strategists without-card trial modal content and close behavior',
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
);

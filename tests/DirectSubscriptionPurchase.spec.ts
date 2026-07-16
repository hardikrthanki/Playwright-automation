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
import { StripePaymentPage }
  from './pages/StripePaymentPage';

/* =============================================================================
TEST SUITE: Direct Subscription Purchase

PURPOSE
-------
Validates Subscription Management Use Case 2 from the FRD. These tests start
with non-destructive browser checks first: plan selection, checkout summary, and
Stripe readiness before any payment is submitted.

RUN
---
$env:DIRECT_SUBSCRIPTION_PURCHASE_ENABLED="true"
npx playwright test tests/DirectSubscriptionPurchase.spec.ts --headed
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

async function openPlanSelectionForFreshUser(
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

if (
  envEnabled(
    'DIRECT_SUBSCRIPTION_PURCHASE_ENABLED'
  )
) {
  test.describe(
    'Direct Subscription Purchase',
    () => {
    test.describe.configure({
      timeout: 20 * 60 * 1000
    });

    test(
      'Income Builder monthly checkout shows subscription summary before payment',
      async ({ page }) => {
        const user =
          await openPlanSelectionForFreshUser(
            page,
            'direct-income-builder-summary'
          );

        await test.step(
          'Open Income Builder checkout',
          async () => {
            await new PlanSelectionPage(
              page
            ).selectPlan(
              'Income Builder'
            );
          }
        );

        await test.step(
          'Validate Stripe checkout summary before payment',
          async () => {
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
          }
        );
      }
    );
    }
  );
}

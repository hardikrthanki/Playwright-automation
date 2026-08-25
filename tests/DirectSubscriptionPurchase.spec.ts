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

type CheckoutPlanName =
  | 'Income Builder'
  | 'Overlay Strategists'
  | 'Portfolio Hedger'
  | 'Marketplace';

type CheckoutBillingInterval =
  | 'monthly'
  | 'annual';

type CheckoutSummaryScenario = {
  planName: CheckoutPlanName;
  interval: CheckoutBillingInterval;
  expectedBillingCopy: RegExp;
};

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

async function validateCheckoutSummaryAndReturn(
  page: Page,
  email: string,
  scenario: CheckoutSummaryScenario
) {
  const planPage =
    new PlanSelectionPage(
      page
    );

  await test.step(
    `Open ${scenario.planName} ${scenario.interval} checkout`,
    async () => {
      if (
        scenario.interval === 'annual'
      ) {
        await planPage.selectAnnualBilling();
      } else {
        await planPage.selectMonthlyBilling();
      }

      await planPage.selectPlan(
        scenario.planName
      );
    }
  );

  await test.step(
    `Validate ${scenario.planName} ${scenario.interval} checkout summary`,
    async () => {
      await new StripePaymentPage(
        page
      ).validateSubscriptionCheckoutDetails({
        expectedEmail:
          email,
        expectedPlan:
          scenario.planName,
        expectedBillingCopy:
          scenario.expectedBillingCopy
      });
    }
  );

  await test.step(
    `Return from ${scenario.planName} ${scenario.interval} checkout before payment`,
    async () => {
      await page.goBack({
        waitUntil: 'domcontentloaded'
      });

      await expect(
        page
      ).not.toHaveURL(
        /checkout\.stripe\.com|billing\.stripe\.com/i,
        {
          timeout: 15000
        }
      );

      await expect(
        page.getByText(
          /choose your plan|select a plan|get started/i
        ).first()
      ).toBeVisible({
        timeout: 30000
      });
    }
  );
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

    test(
      'Portfolio Hedger annual checkout shows subscription summary before payment',
      async ({ page }) => {
        const user =
          await openPlanSelectionForFreshUser(
            page,
            'direct-portfolio-hedger-annual-summary'
          );

        await test.step(
          'Open Portfolio Hedger annual checkout',
          async () => {
            const planPage =
              new PlanSelectionPage(
                page
              );

            await planPage.selectAnnualBilling();

            await planPage.selectPlan(
              'Portfolio Hedger'
            );
          }
        );

        await test.step(
          'Validate Stripe annual checkout summary before payment',
          async () => {
            await new StripePaymentPage(
              page
            ).validateSubscriptionCheckoutDetails({
              expectedEmail:
                user.email,
              expectedPlan:
                'Portfolio Hedger',
              expectedBillingCopy:
                /1,?490|per year|annual|subscription|total|due/i
            });
          }
        );
      }
    );

    test(
      'Income Builder annual checkout shows subscription summary before payment',
      async ({ page }) => {
        const user =
          await openPlanSelectionForFreshUser(
            page,
            'direct-income-builder-annual-summary'
          );

        await test.step(
          'Open Income Builder annual checkout',
          async () => {
            const planPage =
              new PlanSelectionPage(
                page
              );

            await planPage.selectAnnualBilling();

            await planPage.selectPlan(
              'Income Builder'
            );
          }
        );

        await test.step(
          'Validate Stripe annual checkout summary before payment',
          async () => {
            await new StripePaymentPage(
              page
            ).validateSubscriptionCheckoutDetails({
              expectedEmail:
                user.email,
              expectedPlan:
                'Income Builder',
              expectedBillingCopy:
                /290|per year|annual|subscription|total|due/i
            });
          }
        );
      }
    );

    test(
      'Marketplace monthly checkout shows subscription summary before payment',
      async ({ page }) => {
        const user =
          await openPlanSelectionForFreshUser(
            page,
            'direct-marketplace-monthly-summary'
          );

        await test.step(
          'Open Marketplace monthly checkout',
          async () => {
            await new PlanSelectionPage(
              page
            ).selectPlan(
              'Marketplace'
            );
          }
        );

        await test.step(
          'Validate Stripe monthly checkout summary before payment',
          async () => {
            await new StripePaymentPage(
              page
            ).validateSubscriptionCheckoutDetails({
              expectedEmail:
                user.email,
              expectedPlan:
                'Marketplace',
              expectedBillingCopy:
                /249|per month|monthly|subscription|total/i
            });
          }
        );
      }
    );

    test(
      'Remaining direct paid plan checkout summaries validate before payment with one user',
      async ({ page }) => {
        const user =
          await openPlanSelectionForFreshUser(
            page,
            'direct-remaining-paid-plan-summaries'
          );

        const scenarios: CheckoutSummaryScenario[] = [
          {
            planName: 'Portfolio Hedger',
            interval: 'monthly',
            expectedBillingCopy:
              /149|per month|monthly|subscription|total/i
          },
          {
            planName: 'Marketplace',
            interval: 'annual',
            expectedBillingCopy:
              /2,?490|per year|annual|subscription|total|due/i
          }
        ];

        for (const scenario of scenarios) {
          await validateCheckoutSummaryAndReturn(
            page,
            user.email,
            scenario
          );
        }
      }
    );

    test(
      'Income Builder checkout shows currency and conversion details before payment',
      async ({ page }) => {
        await openPlanSelectionForFreshUser(
          page,
          'direct-income-builder-currency-summary'
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
          'Validate Stripe currency and conversion copy',
          async () => {
            await new StripePaymentPage(
              page
            ).validateCurrencyAndConversionDetails();
          }
        );
      }
    );

    test(
      'Income Builder checkout preserves context on refresh and returns safely before payment',
      async ({ page }) => {
        const user =
          await openPlanSelectionForFreshUser(
            page,
            'direct-income-builder-refresh-back'
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

        const stripePage =
          new StripePaymentPage(
            page
          );

        await test.step(
          'Validate checkout context before refresh',
          async () => {
            await stripePage.validateSubscriptionCheckoutDetails({
              expectedEmail:
                user.email,
              expectedPlan:
                'Income Builder',
              expectedBillingCopy:
                /29|per month|monthly|subscription|total/i
            });
          }
        );

        await test.step(
          'Refresh Stripe checkout and validate context remains',
          async () => {
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
          }
        );

        await test.step(
          'Navigate back before payment without activating checkout',
          async () => {
            await page.goBack({
              waitUntil: 'domcontentloaded'
            });

            await expect(
              page
            ).not.toHaveURL(
              /checkout\.stripe\.com|billing\.stripe\.com/i,
              {
                timeout: 15000
              }
            );

            await expect(
              page.getByText(
                /choose your plan|select a plan|get started/i
              ).first()
            ).toBeVisible({
              timeout: 30000
            });
          }
        );
      }
    );
    }
  );
}

import {
  expect,
  test
} from './fixtures/subscriberAuth';

import {
  BASE_URL
} from './config/testData';

import { BillingPage }
  from './pages/BillingPage';

/* =============================================================================
TEST SUITE: Billing Edge Validation

PURPOSE
-------
One authenticated session validates in-app billing Overview, Plans, and
History once. It does not click Manage Subscription.

RUN
---
npx playwright test tests/BillingEdgeValidation.spec.ts --headed
============================================================================= */

test.describe(
  'Billing Edge Validation',
  () => {

    test.describe.configure({
      timeout: 120000
    });

    test(
      'Billing overview plans and history in one session',
      async ({ page }) => {
        const billing =
          new BillingPage(
            page
          );

        await test.step(
          'Overview shows current plan and management control',
          async () => {
            await billing.validateOverview();
            await billing.validateOverviewContract();
          }
        );

        await test.step(
          'Plans show Income Builder and billing interval',
          async () => {
            await billing.validatePlans();

            await expect(
              page.locator(
                'body'
              )
            ).toContainText(
              /monthly|annual|month|year|\/mo|\/yr|billing period|no plan changes|paid plan|current plan/i
            );
          }
        );

        await test.step(
          'History shows paid transactions and invoice PDF targets',
          async () => {
            await billing.validateTransactions();
            await billing.validateInvoiceAndPdfLinksHaveTargets();
          }
        );

        await test.step(
          'Route remains usable after back and forward',
          async () => {
            await page.goto(
              `${BASE_URL}/dashboard`,
              {
                waitUntil: 'domcontentloaded'
              }
            );

            await page.goBack({
              waitUntil: 'domcontentloaded'
            });

            await expect(
              page
            ).toHaveURL(
              /\/dashboard\/billing/,
              {
                timeout: 15000
              }
            );

            await page.goForward({
              waitUntil: 'domcontentloaded'
            });

            await expect(
              page
            ).toHaveURL(
              /\/dashboard/,
              {
                timeout: 15000
              }
            );
          }
        );
      }
    );
  }
);

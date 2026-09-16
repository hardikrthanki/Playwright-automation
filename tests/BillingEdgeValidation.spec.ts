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
One authenticated session validates billing navigation and evidence links
without mutating subscription state.

RUN
---
npx playwright test tests/BillingEdgeValidation.spec.ts --headed
============================================================================= */

test.describe(
  'Billing Edge Validation',
  () => {

    test.describe.configure({
      timeout: 180000
    });

    test(
      'Billing plans history invoices and back-forward in one session',
      async ({ page }) => {
        const billing =
          new BillingPage(
            page
          );

        await billing.validateOverview();

        await test.step(
          'Plans tab remains stable without checkout',
          async () => {
            await billing.validatePlansTabStable();

            await expect(
              page
            ).toHaveURL(
              /billing/
            );
          }
        );

        await test.step(
          'Overview exposes plan status and management',
          async () => {
            await billing.validateOverviewContract();
          }
        );

        await test.step(
          'Plan lifecycle action summary',
          async () => {
            await billing.validatePlanLifecycleActionSummary();
          }
        );

        await test.step(
          'Billing interval summary',
          async () => {
            await billing.validateBillingIntervalPresentationSummary();
          }
        );

        await test.step(
          'History remains stable after refresh',
          async () => {
            await billing.validateHistoryTabStable();

            await page.reload({
              waitUntil: 'domcontentloaded'
            });

            await billing.validateHistoryTabStable();
          }
        );

        await test.step(
          'Plans and history can be revisited',
          async () => {
            await billing.validatePlansTabStable();
            await billing.validateHistoryTabStable();
            await billing.validatePlansTabStable();

            await expect(
              page
            ).toHaveURL(
              /billing/
            );
          }
        );

        await test.step(
          'Invoice and PDF links have usable targets',
          async () => {
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

            await billing.validateOverviewContract();

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

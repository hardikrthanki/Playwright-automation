import {
  expect,
  test
} from '@playwright/test';

import {
  TEST_USERS
} from './config/testData';

import { BillingPage }
  from './pages/BillingPage';

import { LoginPage }
  from './pages/LoginPage';

/* =============================================================================
TEST SUITE: Billing Edge Validation

PURPOSE
-------
Validates billing navigation and evidence links without changing plans,
starting Stripe checkout, or mutating subscription state.

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

    test.beforeEach(
      async ({ page }) => {
        const login =
          new LoginPage(page);

        const billing =
          new BillingPage(page);

        await login.login(
          TEST_USERS.subscriber.email,
          TEST_USERS.subscriber.password
        );

        await billing.validateOverview();
      }
    );

    test(
      'Billing plans tab remains stable without launching checkout',
      async ({ page }) => {

        const billing =
          new BillingPage(page);

        await billing.validatePlansTabStable();

        await expect(
          page
        ).toHaveURL(
          /billing/
        );
      }
    );

    test(
      'Billing overview exposes plan status and management controls',
      async ({ page }) => {

        const billing =
          new BillingPage(page);

        await billing.validateOverviewContract();
      }
    );

    test(
      'Billing history and transactions remain stable after refresh',
      async ({ page }) => {

        const billing =
          new BillingPage(page);

        await billing.validateHistoryTabStable();

        await page.reload({
          waitUntil: 'domcontentloaded'
        });

        await billing.validateHistoryTabStable();
      }
    );

    test(
      'Billing invoice and PDF links have usable targets',
      async ({ page }) => {

        const billing =
          new BillingPage(page);

        await billing.validateInvoiceAndPdfLinksHaveTargets();
      }
    );
  }
);

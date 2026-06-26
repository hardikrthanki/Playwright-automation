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
TEST SUITE: Billing Deep Validation

PURPOSE
-------
Validate billing page persistence, plan visibility, transaction status, invoice
links, and PDF link availability for an active subscriber.

Run:
npx playwright test tests/BillingDeep.spec.ts --headed
============================================================================= */

test.describe(
  'Billing Deep Validation',
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
      'Billing page remains available after refresh',
      async ({ page }) => {

        await expect(
          page
        ).toHaveURL(
          /billing/
        );

        await page.reload({
          waitUntil: 'domcontentloaded'
        });

        await expect(
          page
        ).toHaveURL(
          /billing/,
          {
            timeout: 15000
          }
        );

        await expect(
          page.getByRole(
            'tab',
            {
              name: /plans/i
            }
          )
        ).toBeVisible();
      }
    );

    test(
      'Plans tab shows expected Income Builder plan',
      async ({ page }) => {

        const billing =
          new BillingPage(page);

        await billing.validatePlans();

        await expect(
          page.getByText(
            /income builder/i
          )
        ).toBeVisible();
      }
    );

    test(
      'Transactions tab shows paid transaction status',
      async ({ page }) => {

        const billing =
          new BillingPage(page);

        await billing.validateTransactions();

        await expect(
          page.getByText(
            /^paid$/i
          )
        ).toBeVisible();
      }
    );

    test(
      'Invoice link opens invoice page with paid status',
      async ({ page }) => {

        const billing =
          new BillingPage(page);

        await billing.validateTransactions();

        const invoiceLink =
          page.getByRole(
            'link',
            {
              name: /invoice/i
            }
          ).first();

        await expect(
          invoiceLink
        ).toBeVisible({
          timeout: 15000
        });

        const [invoicePage] =
          await Promise.all([
            page.context().waitForEvent(
              'page'
            ),
            invoiceLink.click()
          ]);

        await invoicePage.waitForLoadState(
          'domcontentloaded'
        );

        await expect(
          invoicePage
        ).toHaveURL(
          /invoice|stripe|billing/i
        );

        await expect(
          invoicePage.getByText(
            /invoice paid/i
          ).first()
        ).toBeVisible({
          timeout: 15000
        });

        await invoicePage.close();
      }
    );

    test(
      'PDF link is available and points to a non-empty URL',
      async ({ page }) => {

        const billing =
          new BillingPage(page);

        await billing.validateTransactions();

        const pdfLink =
          page.getByRole(
            'link',
            {
              name: /^pdf$/i
            }
          ).first();

        await expect(
          pdfLink
        ).toBeVisible({
          timeout: 15000
        });

        const href =
          await pdfLink.getAttribute(
            'href'
          );

        expect(
          href
        ).toBeTruthy();

        expect(
          href ?? ''
        ).toMatch(
          /^https?:\/\//
        );
      }
    );
  }
);

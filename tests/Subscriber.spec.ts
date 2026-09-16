/* =============================================================================
TEST SUITE: OOLTool Subscriber Billing Validation

PURPOSE
-------
One subscriber session: dashboard Option Expiry Overview, logout, login again,
then billing plan validation.

Run:
npx playwright test tests/Subscriber.spec.ts --headed
============================================================================= */

import {
  expect,
  test
} from '@playwright/test';

import { LoginPage }
  from './pages/LoginPage';

import { DashboardPage }
  from './pages/DashboardPage';

import { BillingPage }
  from './pages/BillingPage';

import {
  TEST_USERS
} from './config/testData';

test.setTimeout(
  180000
);

test(
  'Subscriber expiry overview logout login and plan validation',
  async ({ page }) => {
    const login =
      new LoginPage(
        page
      );

    const dashboard =
      new DashboardPage(
        page
      );

    const billing =
      new BillingPage(
        page
      );

    await test.step(
      'Login and validate Option Expiry Overview',
      async () => {
        await login.login(
          TEST_USERS.subscriber.email,
          TEST_USERS.subscriber.password
        );

        await dashboard.validate();

        await dashboard.validateExpiryOverview();
      }
    );

    await test.step(
      'Logout',
      async () => {
        await login.logout();
      }
    );

    await test.step(
      'Login again and validate plan',
      async () => {
        await login.login(
          TEST_USERS.subscriber.email,
          TEST_USERS.subscriber.password
        );

        await billing.validateOverview();

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

        await billing.validatePlans();

        await billing.validateTransactions();

        await billing.validateInvoicePage();

        await billing.validatePdfDownload();
      }
    );
  }
);

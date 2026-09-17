/* =============================================================================
TEST SUITE: OOLTool Subscriber Session Validation

PURPOSE
-------
One subscriber session: dashboard Option Expiry Overview, logout, then login
again. In-app billing Overview, Plans, and History live in
BillingEdgeValidation.spec.ts. Stripe portal lives in
BillingSubscriptionManagement.spec.ts.

Run:
npx playwright test tests/Subscriber.spec.ts --headed
============================================================================= */

import {
  test
} from '@playwright/test';

import { LoginPage }
  from './pages/LoginPage';

import { DashboardPage }
  from './pages/DashboardPage';

import {
  TEST_USERS
} from './config/testData';

test.setTimeout(
  180000
);

test(
  'Subscriber expiry overview logout and login',
  async ({ page }) => {
    const login =
      new LoginPage(
        page
      );

    const dashboard =
      new DashboardPage(
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
      'Login again and land on dashboard',
      async () => {
        await login.login(
          TEST_USERS.subscriber.email,
          TEST_USERS.subscriber.password
        );

        await dashboard.validate();
      }
    );
  }
);

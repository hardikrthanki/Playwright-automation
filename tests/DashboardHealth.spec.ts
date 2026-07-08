import {
  test
} from '@playwright/test';

import {
  BASE_URL,
  TEST_USERS
} from './config/testData';

import { DashboardPage }
  from './pages/DashboardPage';

import { LoginPage }
  from './pages/LoginPage';

/* =============================================================================
TEST SUITE: Dashboard Health

PURPOSE
-------
Validates that authenticated dashboard loads do not show the application
load-error screen and remain healthy after refresh/direct navigation.

RUN
---
npx playwright test tests/DashboardHealth.spec.ts --headed
============================================================================= */

test.describe(
  'Dashboard Health',
  () => {

    test.describe.configure({
      timeout: 120000
    });

    test.beforeEach(
      async ({ page }) => {
        const login =
          new LoginPage(page);

        await login.login(
          TEST_USERS.subscriber.email,
          TEST_USERS.subscriber.password
        );
      }
    );

    test(
      'Dashboard direct route does not show load-error screen',
      async ({ page }) => {

        const dashboard =
          new DashboardPage(page);

        await page.goto(
          `${BASE_URL}/dashboard`,
          {
            waitUntil: 'domcontentloaded'
          }
        );

        await dashboard.validateLoaded();
      }
    );

    test(
      'Dashboard refresh does not show load-error screen',
      async ({ page }) => {

        const dashboard =
          new DashboardPage(page);

        await dashboard.validateLoaded();

        await page.reload({
          waitUntil: 'domcontentloaded'
        });

        await dashboard.validateLoaded();
      }
    );
  }
);

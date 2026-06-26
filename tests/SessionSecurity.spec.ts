import {
  expect,
  test
} from '@playwright/test';

import {
  BASE_URL,
  TEST_USERS
} from './config/testData';

import { LoginPage }
  from './pages/LoginPage';

/* =============================================================================
TEST SUITE: Session Security

PURPOSE
-------
Validate that authenticated areas are protected after logout and browser
navigation cannot restore protected content.

Run:
npx playwright test tests/SessionSecurity.spec.ts --headed
============================================================================= */

test.describe(
  'Session Security',
  () => {

    test(
      'Logout prevents browser back and direct dashboard access',
      async ({ page }) => {
        test.setTimeout(
          120000
        );

        const login =
          new LoginPage(page);

        await login.login(
          TEST_USERS.subscriber.email,
          TEST_USERS.subscriber.password
        );

        await expect(
          page
        ).toHaveURL(
          /\/dashboard/,
          {
            timeout: 30000
          }
        );

        await login.logout();

        await page.goBack({
          waitUntil: 'domcontentloaded'
        });

        await expect(
          page
        ).toHaveURL(
          /\/login/,
          {
            timeout: 30000
          }
        );

        await expect(
          page.locator(
            'input[type="email"]'
          ).first()
        ).toBeVisible();

        await page.goto(
          `${BASE_URL}/dashboard`,
          {
            waitUntil: 'domcontentloaded'
          }
        );

        await expect(
          page
        ).toHaveURL(
          /\/login/,
          {
            timeout: 30000
          }
        );
      }
    );

    test(
      'Logged-out session remains on login after refresh',
      async ({ page }) => {
        test.setTimeout(
          120000
        );

        const login =
          new LoginPage(page);

        await login.login(
          TEST_USERS.subscriber.email,
          TEST_USERS.subscriber.password
        );

        await login.logout();

        await page.reload({
          waitUntil: 'domcontentloaded'
        });

        await expect(
          page
        ).toHaveURL(
          /\/login/,
          {
            timeout: 30000
          }
        );

        await expect(
          page.locator(
            'input[type="email"]'
          ).first()
        ).toBeVisible();
      }
    );

    test(
      'Authenticated session can open dashboard in a new tab',
      async ({ page, context }) => {
        test.setTimeout(
          120000
        );

        const login =
          new LoginPage(page);

        await login.login(
          TEST_USERS.subscriber.email,
          TEST_USERS.subscriber.password
        );

        const newTab =
          await context.newPage();

        await newTab.goto(
          `${BASE_URL}/dashboard`,
          {
            waitUntil: 'domcontentloaded'
          }
        );

        await expect(
          newTab
        ).toHaveURL(
          /\/dashboard/,
          {
            timeout: 30000
          }
        );

        await newTab.close();
      }
    );
  }
);

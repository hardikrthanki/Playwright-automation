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

/* =============================================================================
TEST SUITE: Unlock Account

PURPOSE
-------
Requests an unlock link for a temporarily locked account, pauses for the manual
email-link step, then validates the user can log in again.

Run:
$env:RUN_UNLOCK_ACCOUNT_TEST="true"
npx playwright test tests/UnlockAccount.spec.ts --headed

============================================================================= */

test(
  'Unlock Account Flow',
  async ({ page }) => {
    test.skip(
      process.env.RUN_UNLOCK_ACCOUNT_TEST !== 'true',
      'UnlockAccount.spec.ts is opt-in because it requires a locked account.'
    );

    test.setTimeout(
      5 * 60 * 1000
    );

    const login =
      new LoginPage(
        page
      );

    await login.requestUnlockLink(
      TEST_USERS.subscriber.email,
      TEST_USERS.subscriber.password
    );

    console.log(
      'Open the unlock email link in the Playwright browser, then resume.'
    );

    await page.pause();

    await login.login(
      TEST_USERS.subscriber.email,
      TEST_USERS.subscriber.password
    );

    const dashboard =
      new DashboardPage(
        page
      );

    await dashboard.validate();
  }
);

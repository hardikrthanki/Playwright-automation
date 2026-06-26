import {
  test
} from '@playwright/test';

import { LoginPage }
  from './pages/LoginPage';

import { ProfilePage }
  from './pages/ProfilePage';

import {
  TEST_USERS
} from './config/testData';

/* =============================================================================
TEST SUITE: Profile Password Mismatch

PURPOSE
-------
Validate password mismatch error message.

Run:
npx playwright test tests/ProfilePasswordMismatch.spec.ts --headed
============================================================================= */

test(
  'Password Mismatch Validation',
  async ({ page }) => {
    test.setTimeout(
      90000
    );

    const login =
      new LoginPage(page);

    const profile =
      new ProfilePage(page);

    await login.login(
      TEST_USERS.subscriber.email,
      TEST_USERS.subscriber.password
    );

    await profile.open();

    await profile.changePasswordMismatch(
      TEST_USERS.subscriber.password,
      'H@rdik1989',
      'H@rdik9999'
    );

    await profile.validatePasswordMismatch();

  }
);

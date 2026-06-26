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
TEST SUITE: Profile

PURPOSE
-------
Validate Profile functionality.

Run:
npx playwright test tests/Profile.spec.ts --headed
============================================================================= */

test(
  'Profile Update',
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
await profile.validateProfileLoaded();

  }
);

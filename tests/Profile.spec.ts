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
/ npx playwright test tests/Profile.spec.ts --headed
============================================================================= */

test(
  'Profile Update',
  async ({ page }) => {

    const login =
      new LoginPage(page);

    const profile =
      new ProfilePage(page);

 await login.login(
  TEST_USERS.subscriber.email,
  TEST_USERS.subscriber.password
);

await page.goto(
  'https://puat.ooltool.com/dashboard/profile'
);
await page.waitForTimeout(
  3000
);
await profile.waitForProfileData();
await profile.validateProfileLoaded();

  }
);
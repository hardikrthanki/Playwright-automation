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
await profile.validatePersonalInfoControls();

  }
);

test(
  'Profile name update persists and can be restored',
  async ({ page }) => {
    test.skip(
      process.env.PROFILE_UPDATE_VALIDATION_ENABLED !== 'true',
      'Skipped because PROFILE_UPDATE_VALIDATION_ENABLED is not configured.'
    );

    test.setTimeout(
      120000
    );

    const login =
      new LoginPage(page);

    const profile =
      new ProfilePage(page);

    await login.login(
      process.env.PROFILE_UPDATE_EMAIL ??
        TEST_USERS.subscriber.email,
      process.env.PROFILE_UPDATE_PASSWORD ??
        TEST_USERS.subscriber.password
    );

    await profile.open();
    await profile.validateProfileLoaded();

    const originalFirstName =
      await profile.firstNameInput.inputValue();

    const originalLastName =
      await profile.lastNameInput.inputValue();

    const uniqueSuffix =
      Date.now()
        .toString()
        .slice(-4);

    try {
      await profile.updateProfileAndValidatePersistence(
        `QA${uniqueSuffix}`,
        `User${uniqueSuffix}`
      );
    } finally {
      await profile.updateProfileAndValidatePersistence(
        originalFirstName,
        originalLastName
      );
    }
  }
);

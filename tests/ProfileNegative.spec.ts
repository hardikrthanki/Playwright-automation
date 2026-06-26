import {
  expect,
  test
} from '@playwright/test';

import {
  TEST_USERS
} from './config/testData';

import { LoginPage }
  from './pages/LoginPage';

import { ProfilePage }
  from './pages/ProfilePage';

/* =============================================================================
TEST SUITE: Profile Negative Scenarios

PURPOSE
-------
Validate profile-page guardrails without changing persistent account data.

Run:
npx playwright test tests/ProfileNegative.spec.ts --headed
============================================================================= */

test.describe(
  'Profile Negative Scenarios',
  () => {

    test.describe.configure({
      timeout: 90000
    });

    test.beforeEach(
      async ({ page }) => {
        const login =
          new LoginPage(page);

        const profile =
          new ProfilePage(page);

        await login.login(
          TEST_USERS.subscriber.email,
          TEST_USERS.subscriber.password
        );

        await profile.open();
      }
    );

    test(
      'Profile email field cannot be edited',
      async ({ page }) => {

        const profile =
          new ProfilePage(page);

        const originalEmail =
          await profile.emailInput.inputValue();

        await expect(
          profile.emailInput
        ).toBeDisabled();

        await expect(
          profile.emailInput
        ).toHaveValue(
          originalEmail
        );
      }
    );

    test(
      'Profile first name empty draft is not persisted without saving',
      async ({ page }) => {

        const profile =
          new ProfilePage(page);

        const originalFirstName =
          await profile.firstNameInput.inputValue();

        await profile.firstNameInput.fill(
          ''
        );

        await page.reload({
          waitUntil: 'domcontentloaded'
        });

        await profile.waitForProfileData();

        await expect(
          profile.firstNameInput
        ).toHaveValue(
          originalFirstName
        );
      }
    );

    test(
      'Profile last name empty draft is not persisted without saving',
      async ({ page }) => {

        const profile =
          new ProfilePage(page);

        const originalLastName =
          await profile.lastNameInput.inputValue();

        await profile.lastNameInput.fill(
          ''
        );

        await page.reload({
          waitUntil: 'domcontentloaded'
        });

        await profile.waitForProfileData();

        await expect(
          profile.lastNameInput
        ).toHaveValue(
          originalLastName
        );
      }
    );

    test(
      'Profile page keeps data after refresh',
      async ({ page }) => {

        const profile =
          new ProfilePage(page);

        const originalFirstName =
          await profile.firstNameInput.inputValue();

        const originalLastName =
          await profile.lastNameInput.inputValue();

        const originalEmail =
          await profile.emailInput.inputValue();

        await page.reload({
          waitUntil: 'domcontentloaded'
        });

        await profile.waitForProfileData();

        await expect(
          profile.firstNameInput
        ).toHaveValue(
          originalFirstName
        );

        await expect(
          profile.lastNameInput
        ).toHaveValue(
          originalLastName
        );

        await expect(
          profile.emailInput
        ).toHaveValue(
          originalEmail
        );
      }
    );

    test(
      'Profile password change button stays safe with empty password fields',
      async ({ page }) => {

        const profile =
          new ProfilePage(page);

        await expect(
          profile.currentPasswordInput
        ).toBeVisible();

        await expect(
          profile.newPasswordInput
        ).toBeVisible();

        await expect(
          profile.confirmPasswordInput
        ).toBeVisible();

        await profile.changePasswordButton.click();

        await expect(
          page
        ).toHaveURL(
          /\/dashboard\/profile/
        );
      }
    );
  }
);

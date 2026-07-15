import {
  expect,
  Locator,
  test
} from '@playwright/test';

import {
  BASE_URL,
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

async function findLocalPasswordToggle(
  passwordInput: Locator
) {
  return passwordInput.locator(
    'xpath=ancestor::div[contains(@class,"relative")][1]//button'
  ).first();
}

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
      'Profile email matches logged-in subscriber identity',
      async ({ page }) => {

        const profile =
          new ProfilePage(page);

        await expect(
          profile.emailInput
        ).toHaveValue(
          TEST_USERS.subscriber.email,
          {
            timeout: 10000
          }
        );

        await expect(
          profile.emailInput
        ).toBeDisabled();
      }
    );

    test(
      'Profile personal information controls are visible and safe',
      async ({ page }) => {

        const profile =
          new ProfilePage(page);

        await profile.validatePersonalInfoControls();

        await expect(
          profile.firstNameInput
        ).not.toHaveValue(
          ''
        );

        await expect(
          profile.lastNameInput
        ).not.toHaveValue(
          ''
        );

        await expect(
          profile.emailInput
        ).toBeDisabled();
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
      'Profile direct route remains usable after browser back and forward',
      async ({ page }) => {

        const profile =
          new ProfilePage(page);

        await page.goto(
          `${BASE_URL}/dashboard`,
          {
            waitUntil: 'domcontentloaded'
          }
        );

        await page.goBack({
          waitUntil: 'domcontentloaded'
        });

        await expect(
          page
        ).toHaveURL(
          /\/dashboard\/profile/,
          {
            timeout: 15000
          }
        );

        await profile.waitForProfileData();

        await page.goForward({
          waitUntil: 'domcontentloaded'
        });

        await expect(
          page
        ).toHaveURL(
          /\/dashboard/,
          {
            timeout: 15000
          }
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

    test(
      'Profile password visibility controls are usable without saving drafts',
      async ({ page }) => {

        const profile =
          new ProfilePage(page);

        const passwordInputs = [
          page.getByLabel(
            /^current password$/i
          ),
          page.getByLabel(
            /^new password$/i
          ),
          page.getByLabel(
            /^confirm new password$/i
          )
        ];

        await profile.currentPasswordInput.fill(
          'DraftCurrentPassword1!'
        );

        await profile.newPasswordInput.fill(
          'DraftNewPassword1!'
        );

        await profile.confirmPasswordInput.fill(
          'DraftNewPassword1!'
        );

        for (let index = 0; index < passwordInputs.length; index += 1) {
          const input =
            passwordInputs[index];

          await expect(
            input
          ).toHaveAttribute(
            'type',
            'password'
          );

          const toggle =
            await findLocalPasswordToggle(
              input
            );

          await expect(
            toggle
          ).toBeVisible({
            timeout: 10000
          });

          await toggle.click();

          await expect(
            input
          ).not.toHaveValue(
            ''
          );

          await toggle.click();

          await expect(
            input
          ).not.toHaveValue(
            ''
          );
        }

        await expect(
          page
        ).toHaveURL(
          /\/dashboard\/profile/
        );
      }
    );

    test(
      'Profile password drafts are cleared after refresh without saving',
      async ({ page }) => {

        const profile =
          new ProfilePage(page);

        await profile.currentPasswordInput.fill(
          'DraftCurrentPassword1!'
        );

        await profile.newPasswordInput.fill(
          'DraftNewPassword1!'
        );

        await profile.confirmPasswordInput.fill(
          'DraftNewPassword1!'
        );

        await page.reload({
          waitUntil: 'domcontentloaded'
        });

        await profile.waitForProfileData();

        await expect(
          profile.currentPasswordInput
        ).toHaveValue(
          ''
        );

        await expect(
          profile.newPasswordInput
        ).toHaveValue(
          ''
        );

        await expect(
          profile.confirmPasswordInput
        ).toHaveValue(
          ''
        );
      }
    );
  }
);

import {
  expect,
  test
} from '@playwright/test';

import {
  BASE_URL
} from './config/testData';

import { ForgotPasswordPage }
  from './pages/ForgotPasswordPage';

import { RegistrationPage }
  from './pages/RegistrationPage';

/* =============================================================================
TEST SUITE: Accessibility And Browser Behavior

PURPOSE
-------
Validate basic keyboard, accessibility, and browser refresh behavior for public
authentication screens.

Run:
npx playwright test tests/AccessibilityBrowser.spec.ts
============================================================================= */

test.describe(
  'Accessibility And Browser Behavior',
  () => {

    test(
      'Login form exposes accessible email and password fields',
      async ({ page }) => {

        await page.goto(
          `${BASE_URL}/login`,
          {
            waitUntil: 'domcontentloaded'
          }
        );

        await expect(
          page.getByLabel(
            /^email$/i
          ).or(
            page.locator(
              'input[type="email"]'
            ).first()
          )
        ).toBeVisible();

        await expect(
          page.getByLabel(
            /^password$/i
          ).or(
            page.locator(
              'input[type="password"]'
            ).first()
          )
        ).toBeVisible();

        await expect(
          page.getByRole(
            'button',
            {
              name: /sign in/i
            }
          )
        ).toBeVisible();
      }
    );

    test(
      'Login form supports Enter key submission without authenticating invalid data',
      async ({ page }) => {

        await page.goto(
          `${BASE_URL}/login`,
          {
            waitUntil: 'domcontentloaded'
          }
        );

        await page.locator(
          'input[type="email"]'
        ).first().fill(
          'invalid-email'
        );

        await page.locator(
          'input[type="password"]'
        ).first().fill(
          'AnyPassword123'
        );

        await page.keyboard.press(
          'Enter'
        );

        await expect(
          page
        ).toHaveURL(
          /\/login/
        );
      }
    );

    test(
      'Forgot password form supports Back to login navigation',
      async ({ page }) => {

        const forgotPassword =
          new ForgotPasswordPage(page);

        await forgotPassword.open();
        await forgotPassword.backToLogin();

        await expect(
          page
        ).toHaveURL(
          /\/login/,
          {
            timeout: 10000
          }
        );
      }
    );

    test(
      'Register page keeps form visible after browser refresh',
      async ({ page }) => {

        const registration =
          new RegistrationPage(page);

        await registration.open();

        await page.reload({
          waitUntil: 'domcontentloaded'
        });

        await expect(
          page
        ).toHaveURL(
          /\/register/,
          {
            timeout: 10000
          }
        );

        await expect(
          registration.firstNameInput
        ).toBeVisible();

        await expect(
          registration.emailInput
        ).toBeVisible();

        await expect(
          registration.mobileInput
        ).toBeVisible();
      }
    );

    test(
      'Register page exposes accessible primary actions',
      async ({ page }) => {

        const registration =
          new RegistrationPage(page);

        await registration.open();

        await expect(
          page.getByRole(
            'button',
            {
              name: /continue with google/i
            }
          )
        ).toBeVisible();

        await expect(
          registration.sendCodeButton
        ).toBeVisible();

        await expect(
          registration.submitButton
        ).toBeVisible();
      }
    );
  }
);

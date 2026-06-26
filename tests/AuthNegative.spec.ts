import {
  expect,
  test
} from '@playwright/test';

import {
  BASE_URL
} from './config/testData';

import { ForgotPasswordPage }
  from './pages/ForgotPasswordPage';

const protectedRoutes = [
  '/dashboard',
  '/dashboard/profile',
  '/dashboard/billing',
  '/onboarding',
  '/dashboard/settings',
  '/dashboard/security',
  '/dashboard/subscription',
  '/dashboard/notifications',
  '/dashboard/activity'
];

const unsafeEmailInputs = [
  {
    name: 'SQL injection',
    value: "' OR 1=1 --"
  },
  {
    name: 'XSS injection',
    value: '<script>alert(1)</script>'
  },
  {
    name: 'very long email',
    value: `${'a'.repeat(255)}@example.com`
  }
];

/* =============================================================================
TEST SUITE: Auth Negative Scenarios

PURPOSE
-------
Validate authentication guardrails without changing account state or risking
login lockout.

Run:
npx playwright test tests/AuthNegative.spec.ts --headed
============================================================================= */

test.describe(
  'Auth Negative Scenarios',
  () => {

    test(
      'Login form blocks empty required fields',
      async ({ page }) => {

        await page.goto(
          `${BASE_URL}/login`,
          {
            waitUntil: 'domcontentloaded'
          }
        );

        const emailInput =
          page.locator(
            'input[type="email"]'
          ).first();

        const passwordInput =
          page.locator(
            'input[type="password"]'
          ).first();

        const submitButton =
          page.locator(
            'button[type="submit"]'
          ).first();

        await submitButton.click();

        await expect(
          page
        ).toHaveURL(
          /\/login/
        );

        await expect(
          emailInput
        ).toBeVisible();

        await expect(
          passwordInput
        ).toBeVisible();

        await expect(
          emailInput
        ).toHaveJSProperty(
          'validity.valueMissing',
          true
        );
      }
    );

    test(
      'Login form blocks empty email only',
      async ({ page }) => {

        await page.goto(
          `${BASE_URL}/login`,
          {
            waitUntil: 'domcontentloaded'
          }
        );

        const emailInput =
          page.locator(
            'input[type="email"]'
          ).first();

        const passwordInput =
          page.locator(
            'input[type="password"]'
          ).first();

        const submitButton =
          page.locator(
            'button[type="submit"]'
          ).first();

        await passwordInput.fill(
          'AnyPassword123'
        );

        await submitButton.click();

        await expect(
          page
        ).toHaveURL(
          /\/login/
        );

        await expect(
          emailInput
        ).toHaveJSProperty(
          'validity.valueMissing',
          true
        );
      }
    );

    test(
      'Login form blocks empty password only',
      async ({ page }) => {

        await page.goto(
          `${BASE_URL}/login`,
          {
            waitUntil: 'domcontentloaded'
          }
        );

        const emailInput =
          page.locator(
            'input[type="email"]'
          ).first();

        const passwordInput =
          page.locator(
            'input[type="password"]'
          ).first();

        const submitButton =
          page.locator(
            'button[type="submit"]'
          ).first();

        await emailInput.fill(
          'user@example.com'
        );

        await submitButton.click();

        await expect(
          page
        ).toHaveURL(
          /\/login/
        );

        await expect(
          passwordInput
        ).toHaveJSProperty(
          'validity.valueMissing',
          true
        );
      }
    );

    test(
      'Login form blocks invalid email format',
      async ({ page }) => {

        await page.goto(
          `${BASE_URL}/login`,
          {
            waitUntil: 'domcontentloaded'
          }
        );

        const emailInput =
          page.locator(
            'input[type="email"]'
          ).first();

        const passwordInput =
          page.locator(
            'input[type="password"]'
          ).first();

        const submitButton =
          page.locator(
            'button[type="submit"]'
          ).first();

        await emailInput.fill(
          'invalid-email'
        );

        await passwordInput.fill(
          'AnyPassword123'
        );

        await submitButton.click();

        await expect(
          page
        ).toHaveURL(
          /\/login/
        );

        await expect(
          emailInput
        ).toBeVisible();

        await expect(
          passwordInput
        ).toBeVisible();

        await expect(
          page
        ).not.toHaveURL(
          /\/dashboard/
        );
      }
    );

    for (const input of unsafeEmailInputs) {
      test(
        `Login form rejects ${input.name} input`,
        async ({ page }) => {

          await page.goto(
            `${BASE_URL}/login`,
            {
              waitUntil: 'domcontentloaded'
            }
          );

          const emailInput =
            page.locator(
              'input[type="email"]'
            ).first();

          const passwordInput =
            page.locator(
              'input[type="password"]'
            ).first();

          const submitButton =
            page.locator(
              'button[type="submit"]'
            ).first();

          await emailInput.fill(
            input.value
          );

          await passwordInput.fill(
            'AnyPassword123'
          );

          await submitButton.click();

          await expect(
            page
          ).toHaveURL(
            /\/login/
          );

          await expect(
            page
          ).not.toHaveURL(
            /\/dashboard/
          );
        }
      );
    }

    for (const route of protectedRoutes) {
      test(
        `Protected route ${route} redirects unauthenticated user to login`,
        async ({ page }) => {

          await page.goto(
            `${BASE_URL}${route}`,
            {
              waitUntil: 'domcontentloaded'
            }
          );

          await expect(
            page
          ).toHaveURL(
            /\/login/,
            {
              timeout: 15000
            }
          );

          await expect(
            page.locator(
              'input[type="email"]'
            ).first()
          ).toBeVisible();
        }
      );
    }

    test(
      'Forgot password form blocks empty email',
      async ({ page }) => {

        const forgotPassword =
          new ForgotPasswordPage(page);

        await forgotPassword.open();

        await forgotPassword.sendResetButton.click();

        await expect(
          page
        ).toHaveURL(
          /\/forgot-password/
        );

        await expect(
          forgotPassword.emailInput
        ).toHaveJSProperty(
          'validity.valueMissing',
          true
        );
      }
    );

    test(
      'Forgot password form blocks invalid email format',
      async ({ page }) => {

        const forgotPassword =
          new ForgotPasswordPage(page);

        await forgotPassword.open();

        await forgotPassword.emailInput.fill(
          'invalid-email'
        );

        await expect(
          forgotPassword.emailInput
        ).toHaveJSProperty(
          'validity.typeMismatch',
          true
        );
      }
    );

    for (const input of unsafeEmailInputs) {
      test(
        `Forgot password rejects ${input.name} input`,
        async ({ page }) => {

          const forgotPassword =
            new ForgotPasswordPage(page);

          await forgotPassword.open();

          await forgotPassword.emailInput.fill(
            input.value
          );

          await forgotPassword.sendResetButton.click();

          await expect(
            page
          ).toHaveURL(
            /\/forgot-password/
          );
        }
      );
    }
  }
);

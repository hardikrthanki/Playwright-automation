import {
  expect,
  Locator,
  Page,
  test
} from '@playwright/test';

import {
  BASE_URL
} from './config/testData';

import { ForgotPasswordPage }
  from './pages/ForgotPasswordPage';

import { RegistrationPage }
  from './pages/RegistrationPage';

import { safeClick }
  from './helpers/safeClick';

/* =============================================================================
TEST SUITE: Auth UI Validation

PURPOSE
-------
Validates public authentication-screen navigation and non-mutating UI controls.

RUN
---
npx playwright test tests/AuthUiValidation.spec.ts --headed
============================================================================= */

async function findPasswordToggle(
  page: Page,
  passwordInput: Locator
) {

  const namedToggle =
    page.getByRole(
      'button',
      {
        name: /show password|hide password/i
      }
    ).first();

  if (
    await namedToggle.isVisible().catch(
      () => false
    )
  ) {
    return namedToggle;
  }

  const localToggle =
    passwordInput.locator(
      'xpath=ancestor::div[contains(@class,"relative")][1]//button'
    ).first();

  if (
    await localToggle.isVisible().catch(
      () => false
    )
  ) {
    return localToggle;
  }

  return page.locator(
    'button'
  ).filter({
    has:
      page.locator(
        'svg'
      )
  }).last();
}

test.describe(
  'Auth UI Validation',
  () => {

    test(
      'Login screen navigates to forgot password and back',
      async ({ page }) => {

        const forgotPassword =
          new ForgotPasswordPage(page);

        await forgotPassword.open();

        await forgotPassword.backToLogin();

        await expect(
          page
        ).toHaveURL(
          /\/login/
        );
      }
    );

    test(
      'Login direct link remains usable after refresh',
      async ({ page }) => {

        await page.goto(
          `${BASE_URL}/login`,
          {
            waitUntil: 'domcontentloaded'
          }
        );

        await expect(
          page.locator(
            'input[type="email"]'
          ).first()
        ).toBeVisible({
          timeout: 10000
        });

        await expect(
          page.locator(
            'input[type="password"]'
          ).first()
        ).toBeVisible({
          timeout: 10000
        });

        await page.reload({
          waitUntil: 'domcontentloaded'
        });

        await expect(
          page
        ).toHaveURL(
          /\/login/,
          {
            timeout: 10000
          }
        );

        await expect(
          page.getByRole(
            'button',
            {
              name: /sign in/i
            }
          )
        ).toBeVisible({
          timeout: 10000
        });
      }
    );

    test(
      'Login password draft is cleared after refresh',
      async ({ page }) => {

        await page.goto(
          `${BASE_URL}/login`,
          {
            waitUntil: 'domcontentloaded'
          }
        );

        const passwordInput =
          page.getByLabel(
            /^password$/i
          ).or(
            page.locator(
              'input[name="password"], input[type="password"]'
            )
          ).first();

        await expect(
          passwordInput
        ).toBeVisible({
          timeout: 10000
        });

        await passwordInput.fill(
          'DraftPassword123!'
        );

        await page.reload({
          waitUntil: 'domcontentloaded'
        });

        await expect(
          page
        ).toHaveURL(
          /\/login/,
          {
            timeout: 10000
          }
        );

        await expect(
          passwordInput
        ).toHaveValue(
          ''
        );
      }
    );

    test(
      'Forgot password back to login clears reset-only navigation state',
      async ({ page }) => {

        const forgotPassword =
          new ForgotPasswordPage(page);

        await forgotPassword.open();

        await forgotPassword.emailInput.fill(
          'draft-reset@example.com'
        );

        await forgotPassword.backToLogin();

        await expect(
          page
        ).toHaveURL(
          /\/login/,
          {
            timeout: 10000
          }
        );

        await expect(
          page.locator(
            'input[type="email"]'
          ).first()
        ).toBeVisible({
          timeout: 10000
        });

        await expect(
          page.locator(
            'input[type="password"]'
          ).first()
        ).toBeVisible({
          timeout: 10000
        });
      }
    );

    test(
      'Forgot password email draft is cleared after refresh',
      async ({ page }) => {

        const forgotPassword =
          new ForgotPasswordPage(page);

        await forgotPassword.open();

        await forgotPassword.emailInput.fill(
          'draft-reset@example.com'
        );

        await page.reload({
          waitUntil: 'domcontentloaded'
        });

        await expect(
          page
        ).toHaveURL(
          /\/forgot-password/,
          {
            timeout: 10000
          }
        );

        await expect(
          forgotPassword.emailInput
        ).toHaveValue(
          ''
        );
      }
    );

    test(
      'Forgot password direct link remains usable after refresh',
      async ({ page }) => {

        const forgotPassword =
          new ForgotPasswordPage(page);

        await page.goto(
          `${BASE_URL}/forgot-password`,
          {
            waitUntil: 'domcontentloaded'
          }
        );

        await expect(
          forgotPassword.emailInput
        ).toBeVisible({
          timeout: 10000
        });

        await page.reload({
          waitUntil: 'domcontentloaded'
        });

        await expect(
          page
        ).toHaveURL(
          /\/forgot-password/
        );

        await expect(
          forgotPassword.emailInput
        ).toBeVisible({
          timeout: 10000
        });

        await expect(
          forgotPassword.sendResetButton
        ).toBeVisible();
      }
    );

    test(
      'Public auth routes tolerate trailing slash and unknown query parameters',
      async ({ page }) => {

        const publicRoutes = [
          {
            url:
              `${BASE_URL}/login/?unknown=automation-safe-check`,

            expectedUrl:
              /\/login/,

            content:
              /sign in|continue with email/i
          },
          {
            url:
              `${BASE_URL}/forgot-password/?unknown=automation-safe-check`,

            expectedUrl:
              /\/forgot-password/,

            content:
              /forgot password|reset password|email/i
          },
          {
            url:
              `${BASE_URL}/register/?unknown=automation-safe-check`,

            expectedUrl:
              /\/register|\/signup/,

            content:
              /create account|sign up|mobile number/i
          }
        ];

        for (const route of publicRoutes) {
          await page.goto(
            route.url,
            {
              waitUntil: 'domcontentloaded'
            }
          );

          await expect(
            page
          ).toHaveURL(
            route.expectedUrl,
            {
              timeout: 10000
            }
          );

          await expect(
            page.locator(
              'body'
            )
          ).toContainText(
            route.content,
            {
              timeout: 10000
            }
          );
        }
      }
    );

    test(
      'Login screen navigates to create account',
      async ({ page }) => {

        await page.goto(
          `${BASE_URL}/login`,
          {
            waitUntil: 'domcontentloaded'
          }
        );

        await safeClick(
          page.getByRole(
            'link',
            {
              name: /create account|sign up/i
            }
          ).or(
            page.getByText(
              /create account|sign up/i
            )
          ).first(),
          'Open Create Account'
        );

        await expect(
          page
        ).toHaveURL(
          /\/register|\/signup/,
          {
            timeout: 10000
          }
        );
      }
    );

    test(
      'Auth pages remain usable with browser back and forward',
      async ({ page }) => {

        await page.goto(
          `${BASE_URL}/login`,
          {
            waitUntil: 'domcontentloaded'
          }
        );

        await safeClick(
          page.getByRole(
            'link',
            {
              name: /create account|sign up/i
            }
          ).or(
            page.getByText(
              /create account|sign up/i
            )
          ).first(),
          'Open Create Account'
        );

        await expect(
          page
        ).toHaveURL(
          /\/register|\/signup/,
          {
            timeout: 10000
          }
        );

        await page.goBack({
          waitUntil: 'domcontentloaded'
        });

        await expect(
          page
        ).toHaveURL(
          /\/login/,
          {
            timeout: 10000
          }
        );

        await expect(
          page.locator(
            'input[type="email"]'
          ).first()
        ).toBeVisible({
          timeout: 10000
        });

        await page.goForward({
          waitUntil: 'domcontentloaded'
        });

        await expect(
          page
        ).toHaveURL(
          /\/register|\/signup/,
          {
            timeout: 10000
          }
        );

        await expect(
          page.locator(
            'input[type="email"]'
          ).first()
        ).toBeVisible({
          timeout: 10000
        });
      }
    );

    test(
      'Login password visibility control is exposed without submitting form',
      async ({ page }) => {

        await page.goto(
          `${BASE_URL}/login`,
          {
            waitUntil: 'domcontentloaded'
          }
        );

        const passwordInput =
          page.getByLabel(
            /^password$/i
          ).or(
            page.locator(
              'input[name="password"]'
            )
          ).first();

        await expect(
          passwordInput
        ).toBeVisible();

        await passwordInput.fill(
          'DraftPassword123!'
        );

        const toggle =
          await findPasswordToggle(
            page,
            passwordInput
          );

        await expect(
          toggle
        ).toBeVisible({
          timeout: 10000
        });

        const initialType =
          await passwordInput.getAttribute(
            'type'
          );

        await safeClick(
          toggle,
          'Toggle Login Password Visibility'
        );

        await expect
          .poll(
            async () =>
              await passwordInput.getAttribute(
                'type'
              ),
            {
              timeout: 5000
            }
          )
          .not.toBe(
            initialType
          );

        await expect(
          page
        ).toHaveURL(
          /\/login/
        );

        await expect(
          passwordInput
        ).toBeVisible();
      }
    );

    test(
      'Register screen exposes required public form controls',
      async ({ page }) => {

        const registration =
          new RegistrationPage(page);

        await registration.open();

        await expect(
          registration.firstNameInput
        ).toBeVisible();

        await expect(
          registration.lastNameInput
        ).toBeVisible();

        await expect(
          registration.emailInput
        ).toBeVisible();

        await expect(
          registration.mobileInput
        ).toBeVisible();

        await expect(
          registration.passwordInput
        ).toBeVisible();

        await expect(
          registration.confirmPasswordInput
        ).toBeVisible();
      }
    );

    test(
      'Register screen password visibility toggle changes password field type',
      async ({ page }) => {

        const registration =
          new RegistrationPage(page);

        await registration.open();

        await expect(
          registration.passwordInput
        ).toBeVisible();

        await registration.passwordInput.fill(
          'DraftPassword123!'
        );

        const toggle =
          await findPasswordToggle(
            page,
            registration.passwordInput
          );

        await expect(
          toggle
        ).toBeVisible({
          timeout: 10000
        });

        const initialType =
          await registration.passwordInput.getAttribute(
            'type'
          );

        await safeClick(
          toggle,
          'Toggle Register Password Visibility'
        );

        await expect
          .poll(
            async () =>
              await registration.passwordInput.getAttribute(
                'type'
              ),
            {
              timeout: 5000
            }
          )
          .not.toBe(
            initialType
          );
      }
    );

    test(
      'Register screen navigates back to login',
      async ({ page }) => {

        const registration =
          new RegistrationPage(page);

        await registration.open();

        await safeClick(
          page
            .getByRole(
              'link',
              {
                name: /sign in|log in|back to login/i
              }
            )
            .or(
              page.getByText(
                /already have an account|sign in|log in|back to login/i
              )
            )
            .first(),
          'Back To Login'
        );

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
  }
);

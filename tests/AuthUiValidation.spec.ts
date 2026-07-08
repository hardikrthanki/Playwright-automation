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
      'Login password visibility toggle changes password field type',
      async ({ page }) => {

        await page.goto(
          `${BASE_URL}/login`,
          {
            waitUntil: 'domcontentloaded'
          }
        );

        const passwordInput =
          page.locator(
            'input[type="password"]'
          ).first();

        await expect(
          passwordInput
        ).toBeVisible();

        const toggle =
          await findPasswordToggle(
            page,
            passwordInput
          );

        test.skip(
          !(await toggle.isVisible().catch(
            () => false
          )),
          'Skipped because password visibility toggle is not exposed.'
        );

        const initialType =
          await passwordInput.getAttribute(
            'type'
          );

        await safeClick(
          toggle,
          'Toggle Login Password Visibility'
        );

        const changedType =
          await passwordInput.getAttribute(
            'type'
          );

        expect(
          changedType
        ).not.toBe(
          initialType
        );
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

        const toggle =
          await findPasswordToggle(
            page,
            registration.passwordInput
          );

        test.skip(
          !(await toggle.isVisible().catch(
            () => false
          )),
          'Skipped because registration password visibility toggle is not exposed.'
        );

        const initialType =
          await registration.passwordInput.getAttribute(
            'type'
          );

        await safeClick(
          toggle,
          'Toggle Register Password Visibility'
        );

        const changedType =
          await registration.passwordInput.getAttribute(
            'type'
          );

        expect(
          changedType
        ).not.toBe(
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

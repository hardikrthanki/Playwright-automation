import {
  expect,
  test
} from '@playwright/test';

import { RegistrationPage }
  from './pages/RegistrationPage';

const invalidEmailInputs = [
  {
    name: 'missing domain',
    value: 'missing-domain@'
  },
  {
    name: 'missing @',
    value: 'missing-at.example.com'
  },
  {
    name: 'SQL injection',
    value: "' OR 1=1 --"
  },
  {
    name: 'XSS injection',
    value: '<script>alert(1)</script>'
  }
];

/* =============================================================================
TEST SUITE: Signup Negative Scenarios

PURPOSE
-------
Validate registration form guardrails without sending real OTP/email requests.

Run:
npx playwright test tests/SignupNegative.spec.ts --headed
============================================================================= */

test.describe(
  'Signup Negative Scenarios',
  () => {

    test(
      'Signup form blocks empty required fields',
      async ({ page }) => {

        const registration =
          new RegistrationPage(page);

        await registration.open();

        await expect(
          page
        ).not.toHaveURL(
          /\/dashboard/
        );

        await expect(
          registration.submitButton
        ).toBeDisabled();

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
      'Signup form blocks invalid email format',
      async ({ page }) => {

        const registration =
          new RegistrationPage(page);

        await registration.open();

        await registration.emailInput.fill(
          'invalid-email'
        );

        await expect(
          registration.emailInput
        ).toHaveJSProperty(
          'validity.typeMismatch',
          true
        );
      }
    );

    for (const input of invalidEmailInputs) {
      test(
        `Signup form blocks ${input.name} email input`,
        async ({ page }) => {

          const registration =
            new RegistrationPage(page);

          await registration.open();

          await registration.emailInput.fill(
            input.value
          );

          await expect(
            registration.emailInput
          ).toHaveJSProperty(
            'validity.typeMismatch',
            true
          );
        }
      );
    }

    test(
      'Signup email trims leading and trailing spaces',
      async ({ page }) => {

        const registration =
          new RegistrationPage(page);

        await registration.open();

        await registration.emailInput.fill(
          ' USER@example.com '
        );

        await expect(
          registration.emailInput
        ).toHaveValue(
          'USER@example.com'
        );
      }
    );

    test(
      'Signup form keeps submit disabled without password and confirmation',
      async ({ page }) => {

        const registration =
          new RegistrationPage(page);

        await registration.open();

        await expect(
          registration.passwordInput
        ).toBeVisible();

        await expect(
          registration.confirmPasswordInput
        ).toBeVisible();

        await expect(
          registration.submitButton
        ).toBeDisabled();
      }
    );

    test(
      'Signup form keeps submit disabled when passwords do not match',
      async ({ page }) => {

        const registration =
          new RegistrationPage(page);

        await registration.open();

        await registration.firstNameInput.fill(
          'Test'
        );

        await registration.lastNameInput.fill(
          'User'
        );

        await registration.emailInput.fill(
          'test.user@example.com'
        );

        await registration.mobileInput.fill(
          '2015550199'
        );

        await registration.passwordInput.fill(
          'Test@123456'
        );

        await registration.confirmPasswordInput.fill(
          'Different@123456'
        );

        await expect(
          registration.submitButton
        ).toBeDisabled();
      }
    );

    test(
      'Signup form keeps OTP request disabled without mobile number',
      async ({ page }) => {

        const registration =
          new RegistrationPage(page);

        await registration.open();

        await expect(
          registration.mobileInput
        ).toBeVisible();

        await expect(
          registration.sendCodeButton
        ).toBeVisible();

        await expect(
          registration.sendCodeButton
        ).toBeDisabled();
      }
    );

    test(
      'Signup form keeps OTP request disabled for short mobile number',
      async ({ page }) => {

        const registration =
          new RegistrationPage(page);

        await registration.open();

        await registration.mobileInput.fill(
          '123'
        );

        await expect(
          registration.sendCodeButton
        ).toBeDisabled();
      }
    );

    test(
      'Signup mobile input strips letters and keeps OTP disabled',
      async ({ page }) => {

        const registration =
          new RegistrationPage(page);

        await registration.open();

        await registration.mobileInput.fill(
          'abcdefghij'
        );

        await expect(
          registration.mobileInput
        ).toHaveValue(
          ''
        );

        await expect(
          registration.sendCodeButton
        ).toBeDisabled();
      }
    );

    test(
      'Signup mobile input normalizes formatted US number',
      async ({ page }) => {

        const registration =
          new RegistrationPage(page);

        await registration.open();

        await registration.mobileInput.fill(
          '201-555-0123'
        );

        await expect(
          registration.mobileInput
        ).toHaveValue(
          '2015550123'
        );

        await expect(
          registration.sendCodeButton
        ).toBeEnabled();
      }
    );

    test(
      'Signup mobile input limits extra digits to ten digits',
      async ({ page }) => {

        const registration =
          new RegistrationPage(page);

        await registration.open();

        await registration.mobileInput.fill(
          '12345678901'
        );

        await expect(
          registration.mobileInput
        ).toHaveValue(
          '2345678901'
        );

        await expect(
          registration.sendCodeButton
        ).toBeEnabled();
      }
    );

    test(
      'Signup form shows US mobile number guidance before OTP request',
      async ({ page }) => {

        const registration =
          new RegistrationPage(page);

        await registration.open();

        await expect(
          registration.mobileInput
        ).toBeVisible();

        await expect(
          page.getByText(
            /US mobile numbers only/i
          )
        ).toBeVisible();
      }
    );

    test(
      'Signup password visibility toggles work for both password fields',
      async ({ page }) => {

        const registration =
          new RegistrationPage(page);

        await registration.open();

        const showButtons =
          page.getByRole(
            'button',
            {
              name: /show/i
            }
          );

        await expect(
          registration.passwordInput
        ).toHaveAttribute(
          'type',
          'password'
        );

        await showButtons.nth(0).click();

        await expect(
          registration.passwordInput
        ).toHaveAttribute(
          'type',
          'text'
        );

        await expect(
          registration.confirmPasswordInput
        ).toHaveAttribute(
          'type',
          'password'
        );

        await showButtons.first().click();

        await expect(
          registration.confirmPasswordInput
        ).toHaveAttribute(
          'type',
          'text'
        );
      }
    );

    test(
      'Signup submit stays disabled before mobile OTP verification',
      async ({ page }) => {

        const registration =
          new RegistrationPage(page);

        await registration.open();

        await registration.firstNameInput.fill(
          'Test'
        );

        await registration.lastNameInput.fill(
          'User'
        );

        await registration.emailInput.fill(
          'test.user@example.com'
        );

        await registration.mobileInput.fill(
          '2015550199'
        );

        await registration.passwordInput.fill(
          'Test@123456'
        );

        await registration.confirmPasswordInput.fill(
          'Test@123456'
        );

        await expect(
          registration.sendCodeButton
        ).toBeEnabled();

        await expect(
          registration.submitButton
        ).toBeDisabled();
      } 
    );
  }
);

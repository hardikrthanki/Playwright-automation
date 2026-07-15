import {
  expect,
  test
} from '@playwright/test';

import { ResetPasswordPage }
  from './pages/ResetPasswordPage';
import {
  BASE_URL
} from './config/testData';

/* =============================================================================
TEST SUITE: Reset Password Negative Scenarios

PURPOSE
-------
Validate reset-password form guardrails with a fresh reset URL.

Run:
$env:RESET_URL="https://puat.ooltool.com/reset-password/..."
npx playwright test tests/ResetPasswordNegative.spec.ts --headed

NOTE
----
These tests intentionally do not submit a successful password reset, so the same
fresh RESET_URL can be reused across these negative checks.
============================================================================= */

const RESET_URL =
  process.env.RESET_URL ?? '';

test(
  'Invalid reset password link does not authenticate user',
  async ({ page }) => {
    await page.goto(
      `${BASE_URL}/reset-password/invalid-token-for-automation`,
      {
        waitUntil: 'domcontentloaded'
      }
    );

    await expect(
      page
    ).not.toHaveURL(
      /\/dashboard/
    );

    await expect(
      page.getByText(
        /reset password|set new password|invalid|expired|back to login|login/i
      ).first()
    ).toBeVisible({
      timeout: 10000
    });
  }
);

if (RESET_URL) {
  test.describe(
    'Reset Password Negative Scenarios',
    () => {

    test.beforeEach(
      async ({ page }) => {
        await page.goto(
          RESET_URL,
          {
            waitUntil: 'domcontentloaded'
          }
        );
      }
    );

    test(
      'Reset password form blocks empty password fields',
      async ({ page }) => {

        const resetPassword =
          new ResetPasswordPage(page);

        await resetPassword.waitForFormReady();

        await resetPassword.updatePasswordButton.click();

        await expect(
          page
        ).toHaveURL(
          /reset-password/
        );

        await expect(
          resetPassword.newPasswordInput
        ).toHaveJSProperty(
          'validity.valueMissing',
          true
        );
      }
    );

    test(
      'Reset password form blocks password mismatch',
      async ({ page }) => {

        const resetPassword =
          new ResetPasswordPage(page);

        await resetPassword.waitForFormReady();

        await resetPassword.newPasswordInput.fill(
          'Test@123456'
        );

        await resetPassword.confirmPasswordInput.fill(
          'Different@123456'
        );

        await resetPassword.updatePasswordButton.click();

        await expect(
          page.getByText(
            /passwords do not match|password.*match|do not match/i
          )
        ).toBeVisible({
          timeout: 10000
        });
      }
    );

    test(
      'Reset password form keeps weak password on reset page',
      async ({ page }) => {

        const resetPassword =
          new ResetPasswordPage(page);

        await resetPassword.waitForFormReady();

        await resetPassword.newPasswordInput.fill(
          'short'
        );

        await resetPassword.confirmPasswordInput.fill(
          'short'
        );

        await resetPassword.updatePasswordButton.click();

        await expect(
          page
        ).toHaveURL(
          /reset-password/
        );

        await expect(
          resetPassword.newPasswordInput
        ).toBeVisible();
      }
    );

    test(
      'Back to login works from reset password page',
      async ({ page }) => {

        const resetPassword =
          new ResetPasswordPage(page);

        await resetPassword.waitForFormReady();

        await resetPassword.backToLogin();

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
}

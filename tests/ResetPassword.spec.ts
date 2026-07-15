import {
  test
} from '@playwright/test';

import { ResetPasswordPage }
  from './pages/ResetPasswordPage';

import {
  TEST_USERS
} from './config/testData';

/* =============================================================================
TEST SUITE: Reset Password

PURPOSE
-------
Validate password reset functionality.

Run:
npx playwright test tests/ResetPassword.spec.ts --headed

NOTE
----
Set RESET_URL before running this file:
$env:RESET_URL="https://puat.ooltool.com/reset-password/..."
npx playwright test tests/ResetPassword.spec.ts --headed

============================================================================= */

const RESET_URL =
  process.env.RESET_URL ??
  '';

if (RESET_URL) {
  test(
    'Reset Password',
    async ({ page }) => {

    await page.goto(
      RESET_URL
    );

    const resetPassword =
      new ResetPasswordPage(
        page
      );

    await resetPassword.fillPassword(
      TEST_USERS.subscriber.password
    );

    await resetPassword.updatePassword();

    await resetPassword.validateSuccess();

    }
  );
}

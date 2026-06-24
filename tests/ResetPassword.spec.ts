import {
  test
} from '@playwright/test';

import { ResetPasswordPage }
  from './pages/ResetPasswordPage';

/* =============================================================================
TEST SUITE: Reset Password

PURPOSE
-------
Validate password reset functionality.

NOTE
----
Use a valid reset-password URL.

============================================================================= */

test(
  'Reset Password',
  async ({ page }) => {
const RESET_URL =
  'PASTE_RESET_URL_HERE';

await page.goto(
  RESET_URL
);

    const resetPassword =
      new ResetPasswordPage(
        page
      );

    await resetPassword.fillPassword(
      'H@rdik1989'
    );

    await resetPassword.updatePassword();

    await resetPassword.validateSuccess();

  }
);
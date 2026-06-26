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

Run:
npx playwright test tests/ResetPassword.spec.ts --headed

NOTE
----
Set RESET_URL before running this file:
$env:RESET_URL="https://puat.ooltool.com/reset-password/..."
npx playwright test tests/ResetPassword.spec.ts --headed

============================================================================= */

test(
  'Reset Password',
  async ({ page }) => {
const RESET_URL =
  process.env.RESET_URL ??
  '';

if (!RESET_URL) {
  test.skip(
    true,
    'RESET_URL is required for this standalone reset-password test.'
  );
}

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

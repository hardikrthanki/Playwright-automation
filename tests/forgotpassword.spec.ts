import {
  test
} from '@playwright/test';

import { ForgotPasswordPage }
  from './pages/ForgotPasswordPage';
  import { ResetPasswordPage }
  from './pages/ResetPasswordPage';

import {
  BASE_URL,
  TEST_USERS
} from './config/testData';

/* =============================================================================
TEST SUITE: Forgot Password

PURPOSE
-------
Validate Forgot Password UI flow.
/npx playwright test tests/ForgotPassword.spec.ts --headed

============================================================================= */

test(
  'Forgot Password Flow',
  async ({ page }) => {
    await page.goto(
      'https://puat.ooltool.com/login'
    );

    const forgotPassword =
      new ForgotPasswordPage(
        page
      );

    await forgotPassword.open();

    await forgotPassword.requestReset(
      TEST_USERS.subscriber.email
    );
    console.log(
  '\n📧 RESET EMAIL SENT'
);

console.log(
  '📧 Open Gmail'
);

console.log(
  '📧 Click Reset Password Link'
);

console.log(
  '▶️ Resume Playwright After Reset Page Opens'
);

await page.pause();
const resetPassword =
  new ResetPasswordPage(
    page
  );

await resetPassword.fillPassword(
  'H@rdik1989'
);

await resetPassword.updatePassword();

await resetPassword.validateSuccess();

    await forgotPassword.validateEmailSent(
      TEST_USERS.subscriber.email
    );

    await forgotPassword.backToLogin();

  }
);
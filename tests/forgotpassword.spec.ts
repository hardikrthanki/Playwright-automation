import {
  Page,
  test
} from '@playwright/test';

import { ForgotPasswordPage }
  from './pages/ForgotPasswordPage';

import { ResetPasswordPage }
  from './pages/ResetPasswordPage';

import { LoginPage }
  from './pages/LoginPage';

import { DashboardPage }
  from './pages/DashboardPage';

import {
  TEST_USERS
} from './config/testData';

/* =============================================================================
TEST SUITE: Forgot Password

PURPOSE
-------
Validate Forgot Password and Reset Password flow.

Run:
npx playwright test tests/forgotpassword.spec.ts --headed

============================================================================= */

test(
  'Forgot Password Flow',
  async ({ page }) => {
    test.setTimeout(
      5 * 60 * 1000
    );

    const newPassword =
      'H@rdik1989';

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

    await forgotPassword.validateEmailSent(
      TEST_USERS.subscriber.email
    );

    console.log(
      '\n📧 RESET EMAIL SENT'
    );

    console.log(
      '📧 Open Gmail'
    );

    console.log(
      '📧 Copy reset password link'
    );

    console.log(
      '📧 Paste reset link in SAME Playwright browser'
    );

    console.log(
      '▶️ Resume Playwright After Reset Page Opens'
    );

    const findResetPage =
      async (): Promise<Page | undefined> => {
        for (const browserPage of page.context().pages()) {
          const url =
            browserPage.url();

          if (
            /reset|new-password/i.test(url) &&
            !/forgot-password/i.test(url)
          ) {
            return browserPage;
          }

          if (
            await browserPage
              .locator(
                'form input[type="password"]'
              )
              .count() >= 2
          ) {
            return browserPage;
          }
        }

        return undefined;
      };

    let resetPage:
      Page | undefined;

    for (let attempt = 1; attempt <= 3; attempt++) {
      console.log(
        `Open the reset password link in the Playwright browser, then resume. Attempt ${attempt}/3`
      );

      await page.pause();

      resetPage =
        await findResetPage();

      if (resetPage) {
        break;
      }

      console.log(
        'Reset password page was not detected. Current page is still:',
        page.url()
      );
    }

    if (!resetPage) {
      throw new Error(
        'Reset password page was not opened. Please paste the reset email link into the Playwright browser before resuming.'
      );
    }

    await resetPage.bringToFront();

    const resetPassword =
      new ResetPasswordPage(
        resetPage
      );

    await resetPassword.fillPassword(
      newPassword
    );

    await resetPassword.updatePassword();

    await resetPassword.validateSuccess();

    const login =
      new LoginPage(
        resetPage
      );

    await login.login(
      TEST_USERS.subscriber.email,
      newPassword
    );

    const dashboard =
      new DashboardPage(
        resetPage
      );

    await dashboard.validate();

  }
);

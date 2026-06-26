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

    // Keep the shared subscriber account on the configured password so
    // profile and subscriber specs can run after this reset flow.
    const newPassword =
      TEST_USERS.subscriber.password;

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
      '\nRESET EMAIL SENT'
    );

    console.log(
      'Open Gmail'
    );

    console.log(
      'Copy reset password link'
    );

    console.log(
      'Paste reset link in SAME Playwright browser'
    );

    console.log(
      'Resume Playwright after reset page opens'
    );

    const waitForResetPage =
      async (): Promise<Page | undefined> => {
        const deadline =
          Date.now() + 30000;

        while (Date.now() < deadline) {
          for (const browserPage of page.context().pages()) {
            const url =
              browserPage.url();

            const passwordInputs =
              browserPage.locator(
                'form input[type="password"]'
              );

            if (
              await passwordInputs.count() >= 2 &&
              await passwordInputs.nth(0).isVisible() &&
              await passwordInputs.nth(1).isVisible()
            ) {
              return browserPage;
            }

            if (
              /reset|new-password/i.test(url) &&
              !/forgot-password/i.test(url)
            ) {
              console.log(
                'Reset URL opened; waiting for password form:',
                url
              );
            }
          }

          await page.waitForTimeout(
            1000
          );
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
        await waitForResetPage();

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

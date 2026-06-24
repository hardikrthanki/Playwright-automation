import {
  Page,
  Locator,
  expect
} from '@playwright/test';

import { BasePage }
  from './BasePage';

import { safeClick }
  from '../helpers/safeClick';

import { Logger }
  from '../utils/logger';

import {
  BASE_URL
} from '../config/testData';

/* =============================================================================
PAGE OBJECT: ForgotPasswordPage

PURPOSE
-------
Handles Forgot Password functionality.

FEATURES COVERED
----------------
1. Open Forgot Password Page
2. Submit Email
3. Validate Reset Link Message
4. Navigate Back To Login

============================================================================= */

export class ForgotPasswordPage
  extends BasePage {

  readonly forgotPasswordLink: Locator;
  readonly emailInput: Locator;
  readonly sendResetButton: Locator;
  readonly backToLoginLink: Locator;

  constructor(page: Page) {

    super(page);

    this.forgotPasswordLink =
      page.locator(
        'a[href="/forgot-password"]'
      );

    this.emailInput =
      page.locator(
        'input[type="email"]'
      );

    this.sendResetButton =
      page.getByRole(
        'button',
        {
          name: /send reset link/i
        }
      );

    this.backToLoginLink =
      page.getByText(
        /back to login/i
      );
  }

  async open() {

    Logger.info(
      'Opening Forgot Password Page'
    );

    await this.page.goto(
      `${BASE_URL}/forgot-password`
    );

    await expect(
      this.sendResetButton
    ).toBeVisible();

    Logger.success(
      'Forgot Password Page Opened'
    );
  }

  async requestReset(
    email: string
  ) {

    Logger.info(
      `Requesting Password Reset: ${email}`
    );

    await this.emailInput.fill(
      email
    );

    await safeClick(
      this.sendResetButton,
      'Send Reset Link'
    );
  }

  async validateEmailSent(
    email: string
  ) {

    Logger.info(
      'Validating Email Sent Screen'
    );

    await expect(
      this.page.getByText(
        /check your email/i
      )
    ).toBeVisible({
      timeout: 10000
    });

    await expect(
      this.page.getByText(
        email
      )
    ).toBeVisible();

    Logger.success(
      'Reset Link Message Verified'
    );
  }

  async backToLogin() {

    Logger.info(
      'Returning To Login Page'
    );

    await safeClick(
      this.backToLoginLink,
      'Back To Login'
    );

    await expect(
      this.page.locator(
        'input[type="email"]'
      )
    ).toBeVisible();

    Logger.success(
      'Returned To Login Page'
    );
  }
}
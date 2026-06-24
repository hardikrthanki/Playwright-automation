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

/* =============================================================================
PAGE OBJECT: ResetPasswordPage

PURPOSE
-------
Handles password reset after clicking reset email link.

FEATURES COVERED
----------------
1. Enter New Password
2. Confirm Password
3. Update Password
4. Navigate Back To Login

============================================================================= */

export class ResetPasswordPage
  extends BasePage {

  readonly newPasswordInput: Locator;

  readonly confirmPasswordInput: Locator;

  readonly updatePasswordButton: Locator;

  readonly backToLoginLink: Locator;

  constructor(page: Page) {

    super(page);

    this.newPasswordInput =
      page.locator(
        'input[type="password"]'
      ).nth(0);

    this.confirmPasswordInput =
      page.locator(
        'input[type="password"]'
      ).nth(1);

    this.updatePasswordButton =
      page.getByRole(
        'button',
        {
          name: /update password/i
        }
      );

    this.backToLoginLink =
      page.getByText(
        /back to login/i
      );
  }

  async fillPassword(
    password: string
  ) {

    Logger.info(
      'Updating Password'
    );
    console.log(
  'Current URL:',
  this.page.url()
);

    await this.newPasswordInput.fill(
      password
    );

    await this.confirmPasswordInput.fill(
      password
    );

    Logger.success(
      'Password Fields Completed'
    );
  }

  async updatePassword() {

    await safeClick(
      this.updatePasswordButton,
      'Update Password'
    );

    Logger.success(
      'Update Password Clicked'
    );
  }

  async validateSuccess() {

    await expect(
      this.page.getByText(
        /password updated|password reset|success/i
      )
    ).toBeVisible({
      timeout: 10000
    });

    Logger.success(
      'Password Updated Successfully'
    );
  }

  async backToLogin() {

    await safeClick(
      this.backToLoginLink,
      'Back To Login'
    );

    Logger.success(
      'Returned To Login'
    );
  }
}
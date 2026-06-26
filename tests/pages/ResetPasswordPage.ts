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
  validatePasswordPolicy
} from '../config/testData';

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

  readonly setNewPasswordHeading: Locator;

  readonly updatePasswordButton: Locator;

  readonly backToLoginLink: Locator;

  constructor(page: Page) {

    super(page);

    this.setNewPasswordHeading =
      page.getByRole(
        'heading',
        {
          name: /set new password/i
        }
      );

    this.newPasswordInput =
      page.getByLabel(
        /^new password$/i
      ).or(
        page.locator(
          'form input[type="password"]'
        ).nth(0)
      );

    this.confirmPasswordInput =
      page.getByLabel(
        /^confirm password$/i
      ).or(
        page.locator(
          'form input[type="password"]'
        ).nth(1)
      );

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

  async waitForFormReady() {

    await this.page.waitForLoadState(
      'domcontentloaded'
    );

    await expect(
      this.setNewPasswordHeading
    ).toBeVisible({
      timeout: 30000
    });

    await expect(
      this.newPasswordInput
    ).toBeVisible({
      timeout: 30000
    });

    await expect(
      this.confirmPasswordInput
    ).toBeVisible({
      timeout: 30000
    });
  }

  async fillPassword(
    password: string
  ) {

    validatePasswordPolicy(
      password
    );

    Logger.info(
      'Updating Password'
    );
    console.log(
  'Current URL:',
  this.page.url()
);

    await this.waitForFormReady();

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

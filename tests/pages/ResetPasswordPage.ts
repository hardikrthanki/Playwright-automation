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

  readonly updatePasswordButton: Locator;

  readonly backToLoginLink: Locator;

  private pendingPassword = '';

  constructor(page: Page) {

    super(page);

    this.newPasswordInput =
      page.getByRole(
        'textbox',
        {
          name: /^new password$/i
        }
      );

    this.confirmPasswordInput =
      page.getByRole(
        'textbox',
        {
          name: /^confirm password$/i
        }
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

    this.pendingPassword =
      password;

    await this.dismissMarketingOverlays();

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
    const cookieButton =
      this.page.getByRole(
        'button',
        {
          name: /^(essential only|accept( all)?)$/i
        }
      );

    if (
      await cookieButton.first().waitFor({
        state: 'visible',
        timeout: 3000
      }).then(
        () => true
      ).catch(
        () => false
      )
    ) {
      await cookieButton.first().click({
        timeout: 3000
      }).catch(
        () => undefined
      );
    }

    const submitReset =
      async () => {
        await this.dismissMarketingOverlays();

        await this.page.waitForTimeout(
          1000
        );

        await this.newPasswordInput.fill(
          this.pendingPassword
        );

        await this.confirmPasswordInput.fill(
          this.pendingPassword
        );

        await expect(
          this.newPasswordInput
        ).toHaveValue(
          this.pendingPassword
        );

        const responsePromise =
          this.page.waitForResponse(
            (response) =>
              response.request().method() === 'POST' &&
              /\/auth\/reset-password/i.test(
                response.url()
              ),
            {
              timeout: 8000
            }
          ).catch(
            () => null
          );

        await this.updatePasswordButton.click({
          timeout: 8000
        });

        const raced =
          await Promise.race([
            responsePromise,
            this.page.waitForTimeout(
              2000
            ).then(
              () => null
            )
          ]);

        if (
          !raced
        ) {
          await this.page.locator(
            'form'
          ).evaluate(
            (form) => {
              (form as HTMLFormElement).requestSubmit();
            }
          );
        }

        return responsePromise;
      };

    let response =
      await submitReset();

    if (
      !response
    ) {
      response =
        await submitReset();
    }

    if (response) {
      console.log(
        `Reset response ${response.status()}`
      );
    }

    Logger.success(
      'Update Password Clicked'
    );
  }

  async validateSuccess() {

    const confirmed =
      await this.page.getByText(
        /password (has been )?(updated|reset|changed)|successfully/i
      ).first().waitFor({
        state: 'visible',
        timeout: 15000
      }).then(
        () => true
      ).catch(
        () => false
      );

    if (!confirmed) {
      await expect(
        this.page
      ).toHaveURL(
        /\/login/,
        {
          timeout: 20000
        }
      );
    }

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

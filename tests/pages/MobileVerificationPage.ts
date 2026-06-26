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
  AUTH_SETTINGS
} from '../config/testData';

/* =============================================================================
PAGE OBJECT: MobileVerificationPage

PURPOSE
-------
Handles the post-login mobile number verification step during onboarding.

============================================================================= */

export class MobileVerificationPage
  extends BasePage {

  readonly mobileInput: Locator;

  readonly sendCodeButton: Locator;

  readonly otpInput: Locator;

  readonly verifyButton: Locator;

  constructor(page: Page) {

    super(page);

    this.mobileInput =
      page.locator(
        'input[type="tel"], input[inputmode="tel"]'
      ).first();

    this.sendCodeButton =
      page.getByRole(
        'button',
        {
          name: /send code via sms/i
        }
      );

    this.otpInput =
      page.locator(
        'input[inputmode="numeric"], input[name="otp"]'
      ).first();

    this.verifyButton =
      page.getByRole(
        'button',
        {
          name: /^verify$/i
        }
      );
  }

  async completeIfVisible(
    mobileNumber: string
  ) {

    if (
      !AUTH_SETTINGS.postLoginMobileVerificationEnabled
    ) {
      Logger.info(
        'Post-login mobile verification is disabled in auth settings'
      );

      return;
    }

    const heading =
      this.page.getByRole(
        'heading',
        {
          name: /verify your mobile number/i
        }
      );

    try {
      await expect(
        heading
      ).toBeVisible({
        timeout: 5000
      });
    } catch {
      Logger.info(
        'Mobile verification step not shown'
      );

      return;
    }

    Logger.info(
      'Verifying Mobile Number'
    );

    await this.mobileInput.fill(
      mobileNumber
    );

    await safeClick(
      this.sendCodeButton,
      'Send Code via SMS'
    );

    await expect(
      this.otpInput
    ).toBeVisible({
      timeout: 15000
    });

    await this.otpInput.fill(
      AUTH_SETTINGS.otpCode
    );

    await safeClick(
      this.verifyButton,
      'Verify Mobile OTP'
    );

    await expect(
      heading
    ).toBeHidden({
      timeout: 30000
    });

    Logger.success(
      'Mobile Number Verified'
    );
  }
}

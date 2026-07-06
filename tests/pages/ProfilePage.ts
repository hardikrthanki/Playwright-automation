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
  AUTH_SETTINGS,
  BASE_URL
} from '../config/testData';

/* =============================================================================
PAGE OBJECT: ProfilePage

PURPOSE
-------
Handles Profile page functionality.

FEATURES COVERED
----------------
1. Personal Information
2. Change Password
3. Mobile Number

============================================================================= */

export class ProfilePage
  extends BasePage {

  readonly firstNameInput: Locator;

  readonly lastNameInput: Locator;

  readonly saveChangesButton: Locator;

  readonly currentPasswordInput: Locator;

  readonly newPasswordInput: Locator;

  readonly confirmPasswordInput: Locator;

  readonly changePasswordButton: Locator;
  readonly emailInput: Locator;

  readonly mobileSectionHeading: Locator;

  readonly changeMobileNumberButton: Locator;

  readonly mobileNumberInput: Locator;

  readonly sendMobileCodeButton: Locator;

  readonly mobileOtpInput: Locator;

  readonly verifyMobileButton: Locator;

  readonly mobileValidationMessage: Locator;
  
constructor(page: Page) {
  super(page);
  this.emailInput =
  page.locator('#email');
    this.firstNameInput =
      page.getByLabel(
        /first name/i
      );

    this.lastNameInput =
      page.getByLabel(
        /last name/i
      );

    this.saveChangesButton =
      page.getByRole(
        'button',
        {
          name: /save changes/i
        }
      );

    this.currentPasswordInput =
      page.locator(
        'input[type="password"]'
      ).nth(0);

    this.newPasswordInput =
      page.locator(
        'input[type="password"]'
      ).nth(1);

    this.confirmPasswordInput =
      page.locator(
        'input[type="password"]'
      ).nth(2);

    this.changePasswordButton =
      page.getByRole(
        'button',
        {
          name: /change password/i
        }
      );

    this.mobileSectionHeading =
      page.getByText(
        /mobile number/i
      ).first();

    this.changeMobileNumberButton =
      page.getByRole(
        'button',
        {
          name: /change number|change mobile|update mobile/i
        }
      );

    this.mobileNumberInput =
      page.locator(
        'input[type="tel"], input[inputmode="tel"], input[autocomplete="tel"]'
      ).first();

    this.sendMobileCodeButton =
      page.getByRole(
        'button',
        {
          name: /send code via sms|send code|send otp/i
        }
      );

    this.mobileOtpInput =
      page.locator(
        'input[inputmode="numeric"], input[name*="otp" i], input[id*="otp" i]'
      ).first();

    this.verifyMobileButton =
      page.getByRole(
        'button',
        {
          name: /^verify$|verify mobile|verify otp/i
        }
      );

    this.mobileValidationMessage =
      page.getByText(
        /invalid|valid mobile|us mobile|10 digits|required|phone number/i
      ).first();
  }

  async open() {

    await this.page.goto(
      `${BASE_URL}/dashboard/profile`,
      {
        waitUntil: 'domcontentloaded'
      }
    );

    await this.waitForProfileData();
  }

  async updateProfile(
    firstName: string,
    lastName: string
  ) {

    Logger.info(
      'Updating Profile'
    );

    await this.firstNameInput.fill(
      firstName
    );

    await this.lastNameInput.fill(
      lastName
    );

    await safeClick(
      this.saveChangesButton,
      'Save Changes'
    );

    Logger.success(
      'Profile Updated'
    );
  }

  async changePassword(
    currentPassword: string,
    newPassword: string
  ) {

    Logger.info(
      'Changing Password'
    );

    await this.currentPasswordInput.fill(
      currentPassword
    );

    await this.newPasswordInput.fill(
      newPassword
    );

    await this.confirmPasswordInput.fill(
      newPassword
    );

    await safeClick(
      this.changePasswordButton,
      'Change Password'
    );

    Logger.success(
      'Password Change Submitted'
    );
  }
  async validateProfileLoaded() {

  Logger.info(
    'Validating Profile Data'
  );

  await expect(
    this.firstNameInput
  ).not.toHaveValue('');

  await expect(
    this.lastNameInput
  ).not.toHaveValue('');

  await expect(
    this.emailInput
  ).not.toHaveValue('');

  await expect(
    this.emailInput
  ).toBeDisabled();

  Logger.success(
    'Profile Data Loaded'
  );

  Logger.success(
    'Email Field Disabled'
  );
}
async waitForProfileData() {

  await expect(
    this.emailInput
  ).not.toHaveValue(
    '',
    {
      timeout: 10000
    }
  );
}
async validatePasswordMismatch() {

  await expect(
    this.page.getByText(
      /passwords do not match/i
    )
  ).toBeVisible();

  Logger.success(
    'Password Mismatch Message Verified'
  );
}
async validateWrongCurrentPassword() {

  await expect(
    this.page.getByText(
      /current password is incorrect|incorrect current password|wrong current password|invalid current password/i
    )
  ).toBeVisible({
    timeout: 10000
  });

  Logger.success(
    'Wrong Current Password Message Verified'
  );
}
async changePasswordMismatch(
  currentPassword: string,
  newPassword: string,
  confirmPassword: string
) {

  Logger.info(
    'Testing Password Mismatch'
  );

  await this.currentPasswordInput.fill(
    currentPassword
  );

  await this.newPasswordInput.fill(
    newPassword
  );

  await this.confirmPasswordInput.fill(
    confirmPassword
  );

  await safeClick(
    this.changePasswordButton,
    'Change Password'
  );
}

async validateMobileSectionLoaded() {

  Logger.info(
    'Validating Profile Mobile Section'
  );

  await expect(
    this.mobileSectionHeading
  ).toBeVisible({
    timeout: 10000
  });

  await expect(
    this.page.getByText(
      /verified|change number|mobile number|phone number/i
    ).first()
  ).toBeVisible({
    timeout: 10000
  });

  Logger.success(
    'Profile Mobile Section Loaded'
  );
}

async openMobileNumberChange() {

  Logger.info(
    'Opening Mobile Number Change Form'
  );

  await expect(
    this.changeMobileNumberButton
  ).toBeVisible({
    timeout: 10000
  });

  await safeClick(
    this.changeMobileNumberButton,
    'Change Mobile Number'
  );

  await expect(
    this.mobileNumberInput
  ).toBeVisible({
    timeout: 10000
  });

  Logger.success(
    'Mobile Number Change Form Opened'
  );
}

async validateInvalidMobileNumberBlocked(
  invalidMobileNumber = '123'
) {

  await this.openMobileNumberChange();

  Logger.info(
    'Validating Invalid Mobile Number'
  );

  await this.mobileNumberInput.fill(
    invalidMobileNumber
  );

  const sendDisabled =
    await this.sendMobileCodeButton
      .isDisabled()
      .catch(
        () => false
      );

  if (sendDisabled) {
    Logger.success(
      'Send Code Button Disabled For Invalid Mobile Number'
    );

    return;
  }

  await safeClick(
    this.sendMobileCodeButton,
    'Send Mobile Code With Invalid Number'
  );

  await expect(
    this.mobileOtpInput
  ).not.toBeVisible({
    timeout: 3000
  });

  await expect(
    this.mobileValidationMessage
  ).toBeVisible({
    timeout: 5000
  });

  Logger.success(
    'Invalid Mobile Number Validation Verified'
  );
}

async requestMobileNumberOtp(
  mobileNumber: string
) {

  await this.openMobileNumberChange();

  Logger.info(
    'Requesting Mobile Number OTP'
  );

  await this.mobileNumberInput.fill(
    mobileNumber
  );

  await safeClick(
    this.sendMobileCodeButton,
    'Send Mobile Code'
  );

  await expect(
    this.mobileOtpInput
  ).toBeVisible({
    timeout: 15000
  });

  Logger.success(
    'Mobile Number OTP Requested'
  );
}

async completeMobileNumberChange(
  mobileNumber: string,
  otpCode =
    AUTH_SETTINGS.otpCode
) {

  await this.requestMobileNumberOtp(
    mobileNumber
  );

  Logger.info(
    'Completing Mobile Number Change'
  );

  await this.mobileOtpInput.fill(
    otpCode
  );

  await safeClick(
    this.verifyMobileButton,
    'Verify Mobile Number'
  );

  await expect(
    this.page.getByText(
      /verified|mobile number updated|phone number updated|saved/i
    ).first()
  ).toBeVisible({
    timeout: 15000
  });

  Logger.success(
    'Mobile Number Change Verified'
  );
}
  }

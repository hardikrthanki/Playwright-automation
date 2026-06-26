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
PAGE OBJECT: ProfilePage

PURPOSE
-------
Handles Profile page functionality.

FEATURES COVERED
----------------
1. Personal Information
2. Change Password

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
  }

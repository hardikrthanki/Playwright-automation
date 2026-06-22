import {
  Page,
  Locator,
  expect
} from '@playwright/test';

import { safeClick }
  from '../helpers/safeClick';

/* =============================================================================
PAGE OBJECT: RegistrationPage

PURPOSE
-------
Handles new user registration process.

FEATURES COVERED
----------------
1. Open Registration Page
2. Create New Account
3. Registration Validation

METHODS
-------
open()
register(email)

USED BY
-------
onboarding.spec.ts

============================================================================= */

const BASE_URL =
  'https://puat.ooltool.com';

const PASSWORD =
  'Test@123456';

export class RegistrationPage {

  readonly page: Page;

  readonly createAccountLink: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {

    this.page = page;

    this.createAccountLink =
      page.getByRole('link', {
        name: /create account/i,
      });

    this.firstNameInput =
      page.locator(
        'input[name="firstName"]'
      );

    this.lastNameInput =
      page.locator(
        'input[name="lastName"]'
      );

    this.emailInput =
      page.locator(
        'input[name="email"]'
      );

    this.passwordInput =
      page.locator(
        'input[name="password"]'
      );

    this.confirmPasswordInput =
      page.locator(
        'input[name="confirmPassword"]'
      );

    this.submitButton =
      page.getByRole('button', {
        name: 'Create Account',
        exact: true,
      });
  }

  async open() {

    console.log(
      '🌐 Opening application'
    );

    await this.page.goto(
      BASE_URL
    );

    await this.page.waitForLoadState(
      'networkidle'
    );

    await safeClick(
      this.createAccountLink,
      'Open Create Account'
    );

    await this.page.waitForLoadState(
      'networkidle'
    );
  }

  async register(
    email: string
  ) {

    console.log(
      `📝 Registering: ${email}`
    );

    await this.firstNameInput.fill(
      'Hardik'
    );

    await this.lastNameInput.fill(
      'Thanki'
    );

    await this.emailInput.fill(
      email
    );

    await this.passwordInput.fill(
      PASSWORD
    );

    await this.confirmPasswordInput.fill(
      PASSWORD
    );

    await safeClick(
      this.submitButton,
      'Submit Registration'
    );

    await expect(
      this.page
        .getByText(
          /check your email|verification sent|verify your email|registered/i
        )
        .or(
          this.page.getByRole(
            'heading',
            {
              name:
                /verify|thank you|check/i,
            }
          )
        )
    ).toBeVisible({
      timeout: 15000,
    });

    console.log(
      '✅ Registration successful. Verification email sent.'
    );
  }
}
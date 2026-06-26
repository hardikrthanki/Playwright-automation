import {
  Page,
  Locator,
  expect
} from '@playwright/test';

import { safeClick }
from '../helpers/safeClick';

import {
  AUTH_SETTINGS,
  BASE_URL,
  TEST_USERS,
  validatePasswordPolicy
}
from '../config/testData';

import { BasePage }
from './BasePage';

import { Logger }
from '../utils/logger';


/* =============================================================================
PAGE OBJECT: RegistrationPage

PURPOSE
-------
Handles new user registration process.

FLOW COVERED
------------
1. Open Application
2. Open Create Account
3. Enter User Details
4. Enter Mobile Number
5. Send SMS OTP
6. Verify OTP
7. Submit Registration
8. Validate Verification Message

USED BY
-------
onboarding.spec.ts

============================================================================= */


export class RegistrationPage
extends BasePage {


  readonly createAccountLink: Locator;

  readonly firstNameInput: Locator;

  readonly lastNameInput: Locator;

  readonly emailInput: Locator;

  readonly mobileInput: Locator;

  readonly sendCodeButton: Locator;

  readonly otpInput: Locator;
  readonly verifyOtpButton: Locator;

  readonly passwordInput: Locator;

  readonly confirmPasswordInput: Locator;

  readonly submitButton: Locator;
  



  constructor(page: Page) {

    super(page);


    this.createAccountLink =
      page.getByRole(
        'link',
        {
          name: /create account/i
        }
      );


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


    this.mobileInput =
      page.locator(
        'input[type="tel"]'
      );


    this.sendCodeButton =
      page.getByRole(
        'button',
        {
          name: /send code via sms/i
        }
      );


    this.otpInput =
      page.locator(
        'input[inputmode="numeric"]'
      );
      this.verifyOtpButton =
  page.getByRole(
    'button',
    {
      name: 'Verify',
      exact: true
    }
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
      page.getByRole(
        'button',
        {
          name: 'Create Account',
          exact: true
        }
      ).or(
        page.locator(
          'button[type="submit"]'
        ).filter({
          hasText: /create account/i
        })
      );

  }



  async open() {


    Logger.info(
      'Opening application'
    );


    await this.page.goto(
      BASE_URL,
      {
        waitUntil:
        'domcontentloaded',

        timeout:
        60000
      }
    );


    await this.page.waitForTimeout(
      3000
    );


    await safeClick(
      this.createAccountLink,
      'Open Create Account'
    );

    await expect(
      this.firstNameInput
    ).toBeVisible({
      timeout: 15000
    });

    await expect(
      this.submitButton
    ).toBeVisible({
      timeout: 15000
    });


    Logger.success(
      'Create Account Opened'
    );

  }




  async register(
    email: string,
    mobileNumber =
      TEST_USERS.onboarding.mobile
  ) {


    Logger.step(
      `Registering: ${email}`
    );

    validatePasswordPolicy(
      TEST_USERS.onboarding.password
    );


    await this.firstNameInput.fill(
      TEST_USERS.onboarding.firstName
    );


    await this.lastNameInput.fill(
      TEST_USERS.onboarding.lastName
    );


    console.log(
      'Registration Email:',
      email
    );


    await this.emailInput.fill(
      email
    );


    await this.mobileInput.fill(
      mobileNumber
    );


    if (
      AUTH_SETTINGS.registrationMobileOtpEnabled
    ) {
      await expect(
        this.sendCodeButton
      )
      .toBeEnabled({
        timeout:10000
      });


      await safeClick(
        this.sendCodeButton,
        'Send Code via SMS'
      );


      Logger.info(
        'Entering OTP'
      );


      await this.otpInput.fill(
        AUTH_SETTINGS.otpCode
      );


      await safeClick(
        this.verifyOtpButton,
        'Verify OTP'
      );


      Logger.success(
        'OTP Verify Clicked'
      );


      await this.page.waitForTimeout(
        2000
      );
    } else {
      Logger.info(
        'Registration mobile OTP is disabled in auth settings'
      );
    }



    await this.passwordInput.fill(
      TEST_USERS.onboarding.password
    );


    await this.confirmPasswordInput.fill(
      TEST_USERS.onboarding.password
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
            /verify|thank you|check/i
          }
        )

      )

    )
    .toBeVisible({

      timeout:
      15000

    });



    Logger.success(
      'Registration successful. Verification email sent.'
    );


  }


}

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
        'input[type="tel"], input[inputmode="tel"], input[autocomplete="tel-national"], input[autocomplete="tel"]'
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
        'input[autocomplete="one-time-code"], input[inputmode="numeric"], input[name*="otp" i], input[name*="code" i], input[id*="otp" i], input[id*="code" i]'
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



  private envEnabled(
    name: string
  ) {
    return [
      '1',
      'true',
      'yes',
      'on'
    ].includes(
      (
        process.env[name] ??
        ''
      ).toLowerCase()
    );
  }



  private async collectOtpRequestDiagnostics() {
    const bodyText =
      await this.page
        .locator(
          'body'
        )
        .innerText()
        .catch(
          () => ''
        );

    const relevantLines =
      bodyText
        .split(
          /\r?\n/
        )
        .map(
          line =>
            line.trim()
        )
        .filter(Boolean)
        .filter(
          line =>
            /otp|code|sms|mobile|phone|too many|rate|request|invalid|error|try again|wait/i.test(
              line
            )
        )
        .slice(
          0,
          8
        );

    const mobileValue =
      await this.mobileInput
        .inputValue()
        .catch(
          () => ''
        );

    const sendCodeEnabled =
      await this.sendCodeButton
        .isEnabled()
        .catch(
          () => false
        );

    const stateSummary =
      `mobile="${mobileValue}", sendCodeEnabled=${sendCodeEnabled}`;

    return relevantLines.length > 0
      ? `${stateSummary}; ${relevantLines.join(
        ' | '
      )}`
      : `${stateSummary}; No visible OTP/SMS error text found.`;
  }



  private async waitForRegistrationOtpInput() {
    const manualFallback =
      this.envEnabled(
        'REGISTRATION_OTP_MANUAL_FALLBACK'
      );

    for (
      let attempt = 1;
      attempt <= 3;
      attempt++
    ) {
      const otpVisible =
        await this.otpInput
          .first()
          .waitFor({
            state: 'visible',
            timeout: 20000
          })
          .then(
            () => true
          )
          .catch(
            () => false
          );

      if (otpVisible) {
        return;
      }

      const diagnostics =
        await this.collectOtpRequestDiagnostics();

      Logger.info(
        `OTP input not visible after SMS request. Attempt ${attempt}/3. Visible diagnostics: ${diagnostics}`
      );

      if (
        attempt === 3
      ) {
        if (manualFallback) {
          Logger.info(
            'Manual OTP fallback enabled. Complete the OTP request manually, then resume Playwright.'
          );

          await this.page.pause();

          await expect(
            this.otpInput.first()
          ).toBeVisible({
            timeout: 30000
          });

          return;
        }

        throw new Error(
          `Registration OTP input did not appear after requesting SMS code. Visible diagnostics: ${diagnostics}`
        );
      }

      await this.waitForSendCodeEnabled();

      await safeClick(
        this.sendCodeButton,
        `Retry Send Code via SMS (${attempt + 1}/3)`
      );
    }
  }



  private async fillMobileNumber(
    mobileNumber: string
  ) {
    await this.mobileInput.fill(
      ''
    );

    await this.mobileInput.click();

    await this.mobileInput.type(
      mobileNumber,
      {
        delay: 35
      }
    );

    await this.mobileInput.blur();

    await this.page.waitForTimeout(
      700
    );
  }



  private async waitForSendCodeEnabled() {
    const enabled =
      await this.sendCodeButton
        .isEnabled({
          timeout: 15000
        })
        .catch(
          () => false
        );

    if (enabled) {
      return;
    }

    const mobileValue =
      await this.mobileInput
        .inputValue()
        .catch(
          () => ''
        );

    const diagnostics =
      await this.collectOtpRequestDiagnostics();

    throw new Error(
      `Send code via SMS button stayed disabled after entering mobile number "${mobileValue}". Visible diagnostics: ${diagnostics}`
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


    await this.fillMobileNumber(
      mobileNumber
    );


    if (
      AUTH_SETTINGS.registrationMobileOtpEnabled
    ) {
      await this.waitForSendCodeEnabled();


      await safeClick(
        this.sendCodeButton,
        'Send Code via SMS'
      );

      await this.waitForRegistrationOtpInput();


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
